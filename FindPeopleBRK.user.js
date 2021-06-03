// ==UserScript==
// @name         FindPeopleBRK
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Adds a row to show break times
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @grant        none
// ==/UserScript==

(function() {
    let map = new Map();
    let findPeopleTable = window.location.href.match("aftlite-portal") ? document.getElementsByTagName("table")[0] : document.getElementById("recent_event_table");
    let titleCell = document.createElement("th");
    titleCell.innerHTML = "Break Time (minutes)";
    titleCell.classList.add("sortcol");
    setTimeout(function() {
        findPeopleTable.children[0].children[1].appendChild(titleCell);
        for(let row of findPeopleTable.rows) {
            if(row.rowIndex < 2) continue;
            let td = document.createElement("td");
            td.id = "brk" + row.children[2].children[0].textContent;
            row.appendChild(td);
        }
    }, 1000);
    let xhr = new XMLHttpRequest();
    xhr.reponseType = "document";
    xhr.open("POST", "/labor_tracking/uph_drilldown");
    let data = new FormData();
    let endDate = new Date();
    let startDate = new Date();
    startDate.setHours(0);
    data.append("date[start_month]", startDate.getMonth() >= 9 ? startDate.getMonth() + 1 : "0" + (startDate.getMonth() + 1));
    data.append("date[start_day]", startDate.getDate() >= 10 ? startDate.getDate() : "0" + startDate.getDate());
    data.append("date[start_year]", startDate.getFullYear());
    data.append("date[start_hour]", startDate.getHours() >= 10 ? startDate.getHours() : "0" + startDate.getHours());
    data.append("date[end_month]", endDate.getMonth() >= 9 ? endDate.getMonth() + 1 : "0" + (endDate.getMonth() + 1));
    data.append("date[end_day]", endDate.getDate() >= 10 ? endDate.getDate() : "0" + endDate.getDate());
    data.append("date[end_year]", endDate.getFullYear());
    data.append("date[end_hour]", endDate.getHours() >= 10 ? endDate.getHours() : "0" + endDate.getHours());
    data.append("function", "BRK");
    data.append("zone", "--");
    xhr.overrideMimeType('text/xml');
    xhr.onreadystatechange = function() {
        if(xhr.readyState != xhr.DONE) return;
        let table = xhr.responseXML.getElementById("summaryReport");
        try {
            for(let row of table.children[1].children) {
                if(row.rowIndez < 2) continue;
                let login = row.children[0].textContent.toLowerCase();
                let uph = parseFloat(row.children[3].textContent);
                uph = Math.floor(uph * 60)
                map.set(login, uph);
            }
        } catch(e) { console.log(e) }
        console.log(map);
        for(let row of findPeopleTable.rows) {
            if(row.rowIndex < 2) continue;
            try{
                let login = row.cells[2].children[0].innerHTML;
                let time = map.has(login) ? map.get(login) : 0;
                let cell = document.getElementById("brk" + login);
                if(time > 20) cell.style.backgroundColor = "red";
                else cell.style.backgroundColor = "white";
                cell.innerHTML = time + " min";
            } catch(e) { console.log(e); }
        }
    }
    xhr.send(data);
    titleCell.onclick = function() {
        let rows, i, x, y, shouldSwitch;
        let switching = true;
        while (switching) {
            switching = false;
            rows = findPeopleTable.children[1].children;
            /* Loop through all table rows (except the first, which contains table headers): */
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = Number(rows[i].querySelector('td[id^="brk"]').innerHTML.split(" ")[0]);
                y = Number(rows[i + 1].querySelector('td[id^="brk"]').innerHTML.split(" ")[0]);
                if(y > x) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switchand mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }
})();