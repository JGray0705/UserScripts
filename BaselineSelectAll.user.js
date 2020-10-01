// ==UserScript==
// @name         BaselineSelectAll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check all the boxes
// @author       grajef
// @match        https://aftlite-portal.amazon.com/admin/users
// @grant        none
// ==/UserScript==

(function() {

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
})();