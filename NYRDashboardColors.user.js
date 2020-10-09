// ==UserScript==
// @name         NYRDashboardColors
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add SLA colors and auto refresh to the NYR dashboard
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inbound/nyr_dashboard*
// @grant        none
// ==/UserScript==

(function() {
    // set the colors
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
    // do auto reload things
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    var p = document.getElementsByTagName("p")[0];
    var label = document.createElement("label");
    label.innerHTML = "Auto Refresh";
    p.after(label);
    p.after(checkbox);
    checkbox.onClick = autoReload(checkbox);
    checkbox.checked = true;
})();

function autoReload(checkbox) {
    setInterval(function() {
        if(checkbox.checked) {
            location.reload();
        }
    }, 30000);
}
