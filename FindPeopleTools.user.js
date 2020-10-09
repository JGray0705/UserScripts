// ==UserScript==
// @name         FindPeopleTools
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add auto refresh and highlight idle logins
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @grant        none
// ==/UserScript==

(function() {
    var table = document.getElementById("recent_event_table");
    for(let row of table.rows) {
        var cell = row.cells[7].innerHTML;
        var time = Number(row.cells[5].innerHTML.split("mins")[0]);
        if(time >= 10 || (time >= 15 && cell.includes("BRK"))) {
            if(cell.includes("IDLE") || cell.includes("BRK") || !cell.includes("indirect")) {
                row.cells[5].style.background = "red";
            }
        }
    }

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    var p = document.getElementById("content");
    var label = document.createElement("label");
    label.innerHTML = "Auto Refresh";
    p.before(label);
    p.before(checkbox);
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