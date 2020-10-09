// ==UserScript==
// @name         FindPeopleTools
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add auto refresh and highlight idle logins
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @match        https://aftlite-portal.amazon.com/labor_tracking/find_people*
// @grant        none
// ==/UserScript==

(function() {
    if(window.location.href.match("aftlite-na")) {
        var table = document.getElementById("recent_event_table");
        searchTable(table);
        var cb = getCheckbox();
        var label = document.createElement("label");
        label.innerHTML = "Auto Refresh";
        var p = document.getElementById("content");
        p.before(label);
        p.before(cb);
    }
    else {
        var portalTable = document.getElementsByTagName("table")[0];
        searchTable(portalTable);
        var cbLabel = document.createElement("label");
        var check = getCheckbox();
        check.style.float = "left";
        check.style.marginLeft = "10px";
        check.style.marginRight = "4px";
        cbLabel.innerHTML = "Auto Refresh";
        var main = document.getElementById("main-content");
        main.before(check);
        check.after(cbLabel);
    }
})();
function getCheckbox() {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onClick = autoReload(checkbox);
    checkbox.checked = true;
    return checkbox;
}

function searchTable(t) {
    for(let row of t.rows) {
        var cell = row.cells[7].innerHTML;
        var time = Number(row.cells[5].innerHTML.split("mins")[0]);
        if(time >= 10 || (time >= 15 && cell.includes("BRK"))) {
            if(cell.includes("IDLE") || cell.includes("BRK") || !cell.includes("indirect")) {
                row.cells[5].style.background = "red";
            }
        }
    }
}
function autoReload(checkbox) {
    setInterval(function() {
        if(checkbox.checked) {
            location.reload();
        }
    }, 30000);
}