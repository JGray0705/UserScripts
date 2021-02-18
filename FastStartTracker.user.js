// ==UserScript==
// @name         FastStartTracker
// @namespace    https://github.com/jgray0705/UserScripts
// @version      2.0
// @description  Highlight people in START for more than 5 minutes to help track fast start
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @match        https://aftlite-portal.amazon.com/labor_tracking/find_people*
// @grant        none
// ==/UserScript==

(function() {
    if(window.location.href.match("aftlite-na")) {
        let table = document.getElementById("recent_event_table");
        searchTable(table);
    }
    else {
        let portalTable = document.getElementsByTagName("tbody")[0];
        searchTable(portalTable);
    }
})();

function searchTable(t) {
    for(let row of t.rows) {
        if(row.rowIndex <= 1) continue; // first 2 rows of the table are not important
        let cell = row.cells[7].innerHTML.trim();
        let time = Number(row.cells[5].innerHTML.split("mins")[0]);
        if(cell.includes("START") && time >= 5) {
            if(window.location.href.match("aftlite-portal")) {
                row.cells[5].style.color = "white";
                row.cells[5].classList.remove("a-color-price");
            }
            row.cells[5].style.background = "purple";
        }
    }
}
