// ==UserScript==
// @name         AFTLiteTabTitles
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Change tab title to better reflect page
// @author       grajef@
// @match        https://aftlite-na.amazon.com/*
// @grant        none
// ==/UserScript==

(function() {
    let spl = window.location.pathname.split('/');
    document.title = spl[spl.length - 1];
})();