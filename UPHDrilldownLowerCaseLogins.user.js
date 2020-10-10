// ==UserScript==
// @name         UPHDrilldownLowerCaseLogins
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Let's retail assistant work on the UPH drilldown page (requires lower case logins to work)
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/UPHDrilldownLowerCaseLogins.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var table = document.getElementById("summaryReport");
    var row = 0;
    for(var i = 1; row = table.rows[i]; i++) {
        row.cells[0].innerHTML = row.cells[0].innerHTML.toLowerCase();
    }
})();
