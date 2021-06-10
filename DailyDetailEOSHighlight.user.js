// ==UserScript==
// @name         DailyDetailEOSHighlight
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Highlights in orange any functions that are EOS
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @grant        none
// ==/UserScript==

(function() {
    let eos = document.getElementsByTagName('select');
    for(let box of eos) {
        if(box.value == "EOS") {
            box.parentNode.parentNode.style.background = 'orange';
        }
    }
})();