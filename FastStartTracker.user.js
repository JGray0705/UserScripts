// ==UserScript==
// @name         FastStartTracker
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Highlight people in ADMN for more than 5 minutes to help track fast start
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people
// @grant        none
// ==/UserScript==

(function() {
    if(window.location.href.match("aftlite-na")) {
        let table = document.getElementById("recent_event_table");
        searchTable(table);
    }
    else {
        let portalTable = document.getElementsByTagName("table")[0];
        searchTable(portalTable);
    }
})();

function searchTable(t) {
    for(let row of t.rows) {
        if(row.rowIndex <= 1) continue; // first 2 rows of the table are not important
        let cell = row.cells[7].innerHTML.trim();
        let time = Number(row.cells[5].innerHTML.split("mins")[0]);
        if(cell.includes("ADMN") && time >= 5) {
            row.cells[5].style.background = "purple";
        }
    }
}
