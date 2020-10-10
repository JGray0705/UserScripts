// ==UserScript==
// @name         Pallet Counter
// @namespace    https://aftlite-na.amazon.com
// @version      1.0
// @description  Add pallet count to receive inventory page
// @author       grajef@
// @match        https://aftlite-na.amazon.com/receive_inventory/show*
// @doanloadURL  https://github.com/JGray0705/UserScripts/raw/master/PalletCounter.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var pallets = document.body.getElementsByTagName("tbody")[2]; // pallets are listed in the third tbody on the page
    var count = pallets.children[1].children[2].children.length - 2;
    pallets.children[1].children[0].innerText += " (" + count + ")";
})();
