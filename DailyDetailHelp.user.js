// ==UserScript==
// @name         Daily Detail Help
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add a lookup history link to the daily detail page.
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-eu.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-nrt.amazon.com/labor_tracking/view_daily_detail*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/DailyDetailHelper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var table = document.getElementById("dailyReportTable");
    var row = 0;
    for(var i = 1; row = table.rows[i]; i++) {
        row.cells[0].innerHTML = "<a href=\"https://aftlite-na.amazon.com/labor_tracking/lookup_history?user_name=" + row.cells[0].innerHTML + "\">" + row.cells[0].innerHTML + "</a>"
    }
})();