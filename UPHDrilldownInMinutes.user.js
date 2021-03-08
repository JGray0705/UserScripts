// ==UserScript==
// @name         UPHDrilldownInMinutes
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Convert hours to minutes
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @downloadURL  https://github.com/jgray0705/UserScripts/raw/master/UPHDrilldownInMinutes
// @grant        none
// ==/UserScript==

(function() {
    let table = document.getElementById("summaryReport");
    let row = 0;
    for(var i = 1; row = table.rows[i]; i++) {
        let text = "";
        let time = parseFloat(row.cells[3].innerHTML);
        if(isNaN(time)) continue;
        if(time >= 60) {
            let hours = time / 60;
            let minutes = Math.round((hours - Math.floor(hours)) * 60);
            text = hours + " Hours " + minutes + " Minutes";
        }
        else {
            let minutes = time * 60;
            text = minutes + " Minutes";
        }
        row.cells[3].innerHTML = text;
    }
})();