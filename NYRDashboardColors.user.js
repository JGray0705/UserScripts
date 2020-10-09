// ==UserScript==
// @name         NYRDashboardColors
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  try to take over the world!
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inbound/nyr_dashboard
// @grant        none
// ==/UserScript==

(function() {
    var table = document.getElementById("details");
    var col = table.getElementsByTagName("th")[7];
    col.click();
    col.click(); // click twice to sort lowest on top
    for(let row of table.rows) {
        if(row.rowIndex < 1) { continue; }
        var timeToSLA = Number(row.cells[7].innerHTML.split(":")[0]);
        if(timeToSLA < 0) {
            row.cells[7].style.background = 'red';
        }
        else if(timeToSLA < 2) {
            row.cells[7].style.background = 'orange';
        }
        else {
            row.cells[7].style.background = '#56d12a';
        }
    };
})();
