// ==UserScript==
// @name         ASMIndirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sign in to ASM
// @author       grajef@
// @match        https://aftlite-na.amazon.com/indirect_action/signin_indirect_action
// @grant        none
// ==/UserScript==

(function() {
    var button = document.createElement("button");
    button.innerHTML = "ASM";
    button.onclick = function() {
        var login = document.getElementsByTagName("span")[0].innerHTML.match(/\(([^)]+)\)/)[1];
        document.getElementsByName("name")[0].value = login;
        document.getElementsByName("code")[0].value = "ASM";
    };
    document.getElementsByTagName("form")[0].appendChild(button);
})();