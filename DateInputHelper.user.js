// ==UserScript==
// @name         DateInputHelper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Assist in selecting dates for less clicking!
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary*
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/DateInputHelper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var buttons = document.getElementsByTagName("form")[0]; // first title on page. use this to append buttons
    createButton("Current Hour").onclick = function () {
        var d = new Date();
        setDate(d, d);
    }

    createButton("Last Hour").onclick = function () {
        var d = new Date();
        var date = new Date(d.getTime() - 3600000) // subtract one hour
        setDate(date, date);
    }

    createButton("Today").onclick = function() {
        var d = new Date();
        var endDate = new Date(d.getTime() - 3600000)
        d.setHours(0);
        setDate(d, endDate);
    }

    createButton("Yesterday").onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(0);
        endDate.setHours(23);
        setDate(d, endDate);
    }

    createButton("This Week").onclick = function() {
        var d = new Date();
        var startDate = new Date(d.getTime() - (3600000 * 24 * d.getDay())); // subtract days until we get to sunday, then set hour to 0 to get beginning of week
        startDate.setHours(0);
        setDate(startDate, d);
    }

    createButton("Last Week").onclick = function() {
        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - (3600000 * 24 * (endDate.getDay() + 7))); // subtract days until we get to sunday, then subtract 7 more to get last week
        startDate.setHours(0);
        endDate = new Date(startDate.getTime() + (3600000 * 24 * 6)); //add 7 days to get end of week
        endDate.setHours(23);
        setDate(startDate, endDate);
    }

    function createButton(name) {
        var button = document.createElement('button');
        button.innerHTML = name;
        buttons.appendChild(button);
        return button;
    }

    function setDate(start, end) {
        document.getElementById("date_start_hour").selectedIndex = start.getHours();
        document.getElementById("date_start_day").value = start.getDate();
        document.getElementById("date_start_month").selectedIndex = start.getMonth();
        document.getElementById("date_start_year").value = start.getFullYear();
        document.getElementById("date_end_hour").selectedIndex = end.getHours();
        document.getElementById("date_end_day").value = end.getDate();
        document.getElementById("date_end_month").selectedIndex = end.getMonth();
        document.getElementById("date_end_year").value = end.getFullYear();
    }
})();
