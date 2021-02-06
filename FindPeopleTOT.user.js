// ==UserScript==
// @name         FindPeopleTOT
// @namespace    https://github.com/jgray0705/UserScripts
// @version      2.0
// @description  Tracks amount of Time off task in last 12 hours
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/FindPeopleTOT.user.js
// @grant        none
// ==/UserScript==

(function() {
    let map = new Map();
    let findPeopleTable = window.location.href.match("aftlite-portal") ? document.getElementsByTagName("table")[0] : document.getElementById("recent_event_table");
    let titleCell = document.createElement("th");
    titleCell.innerHTML = "Total TOT(minutes)";
    titleCell.classList.add("sortcol");
    setTimeout(function() {
        findPeopleTable.children[0].children[1].appendChild(titleCell);
        for(let row of findPeopleTable.rows) {
            if(row.rowIndex < 2) continue;
            let td = document.createElement("td");
            td.id = row.children[2].children[0].textContent + "tot";
            row.appendChild(td);
        }
    }, 1000);
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
    data.append("function", "TIMEOFFTASK");
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
                let cell = document.getElementById(login + "tot");
                if(time <= 5) cell.style.backgroundColor = "yellow";
                else cell.style.backgroundColor = "red";
                if(time == 0) cell.style.backgroundColor = "white";
                cell.innerHTML = time + " min";
            } catch(e) { console.log(e); }
        }
    }
    xhr.send(data);
})();