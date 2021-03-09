// ==UserScript==
// @name         UPHDrilldownInMinutes
// @namespace    https://github.com/jgray0705/UserScripts
// @version      2.0
// @description  Convert hours to minutes
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @downloadURL  https://github.com/jgray0705/UserScripts/raw/master/UPHDrilldownInMinutes
// @grant        none
// ==/UserScript==

(function() {
    let table = document.getElementById("summaryReport");
    let row = 0;
    sortCells(table)
    for(var i = 1; row = table.rows[i]; i++) {
        let text = "";
        let time = parseFloat(row.cells[3].innerHTML);
        if(isNaN(time)) continue;
        time = time * 60;
        let hours = Math.floor(time / 60);
        let minutes = Math.floor(time % 60);
        let hour = hours == 1 ? " Hour " : " Hours ";
        let minute = minutes == 1 ? " Minute" : " Minutes";
        text = hours + hour + minutes + minute;
        row.cells[3].innerHTML = text;
    }

    function sortCells(table) {
        let rows, i, x, y, shouldSwitch;
        let switching = true;
        while (switching) {
            switching = false;
            rows = table.children[1].children;
            /* Loop through all table rows (except the first, which contains table headers): */
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = parseFloat(rows[i].cells[3].innerHTML);
                y = parseFloat(rows[i + 1].cells[3].innerHTML);
                if(isNaN(y) || isNaN(x)) continue;
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
