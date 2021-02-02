// ==UserScript==
// @name         AutoAdmn
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Sign into admn when barcode is scanned
// @author       grajef@
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// ==/UserScript==

(function() {
    let input = document.getElementById("scan_code");
    let form = document.querySelector("form");
    input.addEventListener('focus', (event) => {
        input.value = "ADMN";
        form.submit();
    });
})();