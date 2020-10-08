// ==UserScript==
// @name         ASMIndirect
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Sign in to ASM
// @author       grajef@
// @match        https://aftlite-na.amazon.com/indirect_action/signin_indirect_action*
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
    var buttonEOS = document.createElement("button");
    buttonEOS.innerHTML = "EOS";
    buttonEOS.onclick = function() {
        var login = document.getElementsByTagName("span")[0].innerHTML.match(/\(([^)]+)\)/)[1];
        document.getElementsByName("name")[0].value = login;
        document.getElementsByName("code")[0].value = "EOS";
    };
    document.getElementsByTagName("form")[0].appendChild(button);
    document.getElementsByTagName("form")[0].appendChild(buttonEOS);
})();