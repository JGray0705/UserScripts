// ==UserScript==
// @name         FreezerTracker
// @namespace    https://github.com/jgray0705/UserScripts
// @version      6.0
// @description  Tracks amount of time spent in frozen last 12 hours
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/FreezerTracker.user.js
// @grant        none
// ==/UserScript==

(function() {
    let functions = ["pack", "receive", "receive2_direct", "receive2", "receive_direct", "removal", "bcc", "stow"];
    let map = new Map();
    let findPeopleTable = window.location.href.match("aftlite-portal") ? document.getElementsByTagName("table")[0] : document.getElementById("recent_event_table");
    let titleCell = document.createElement("th");
    titleCell.innerHTML = "Time in Frozen(hours)";
    titleCell.classList.add("sortcol");
    setTimeout(function() {
        findPeopleTable.children[0].children[1].appendChild(titleCell);
        for(let row of findPeopleTable.rows) {
            if(row.rowIndex < 2) continue;
            let td = document.createElement("td");
            td.id = "freezer" + row.children[2].children[0].textContent;
            row.appendChild(td);
        }
    }, 500);
    for(let func of functions) {
        let xhr = new XMLHttpRequest();
        xhr.reponseType = "document";
        xhr.open("POST", "/labor_tracking/uph_drilldown");
        let data = new FormData();
        let endDate = new Date();
        let startDate = new Date(endDate.getTime() - 3600000 * 12); // search last 12 hours
        data.append("date[start_month]", startDate.getMonth() >= 9 ? startDate.getMonth() + 1 : "0" + (startDate.getMonth() + 1));
        data.append("date[start_day]", startDate.getDate() >= 10 ? startDate.getDate() : "0" + startDate.getDate());
        data.append("date[start_year]", startDate.getFullYear());
        data.append("date[start_hour]", startDate.getHours() >= 10 ? startDate.getHours() : "0" + startDate.getHours());
        data.append("date[end_month]", endDate.getMonth() >= 9 ? endDate.getMonth() + 1 : "0" + (endDate.getMonth() + 1));
        data.append("date[end_day]", endDate.getDate() >= 10 ? endDate.getDate() : "0" + endDate.getDate());
        data.append("date[end_year]", endDate.getFullYear());
        data.append("date[end_hour]", endDate.getHours() >= 10 ? endDate.getHours() : "0" + endDate.getHours());
        data.append("function", func);
        data.append("zone", "frozen");
        xhr.overrideMimeType('text/xml');
        xhr.onreadystatechange = function() {
            if(xhr.readyState != xhr.DONE) return;
            let table = xhr.responseXML.getElementById("detailReport");
            try {
                for(let row of table.children[1].children) {
                    if(row.rowIndez < 2) continue;
                    let login = row.children[0].textContent;
                    let uph = parseFloat(row.children[5].textContent);
                    if(map.has(login)) {
                        map.set(login, map.get(login) + uph);
                    } else {
                        map.set(login, uph);
                    }
                }
            } catch(e) { console.log(e) }
            for(let row of findPeopleTable.rows) {
                if(row.rowIndex < 2) continue;
                try{
                    let login = row.cells[2].children[0].innerHTML;
                    let cell = document.getElementById("freezer" + login);
                    let time = map.has(row.cells[2].children[0].innerHTML) ? map.get(row.cells[2].children[0].innerHTML) : 0;
                    if(time < 1.5) cell.style.backgroundColor = "orange";
                    else if(time < 2) cell.style.backgroundColor = "yellow";
                    if(time >= 2) cell.style.backgroundColor = "white";
                    cell.innerHTML = time;
                } catch(e) { console.log(e); }
            }
        }
        xhr.send(data);
    }
    titleCell.onclick = function() {
        let rows, i, x, y, shouldSwitch;
        let switching = true;
        while (switching) {
            switching = false;
            rows = findPeopleTable.children[1].children;
            /* Loop through all table rows (except the first, which contains table headers): */
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = Number(rows[i].querySelector('td[id^="freezer"]').innerHTML.split(" ")[0]);
                y = Number(rows[i + 1].querySelector('td[id^="freezer"]').innerHTML.split(" ")[0]);
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
