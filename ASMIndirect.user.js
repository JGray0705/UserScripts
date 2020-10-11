// ==UserScript==
// @name         ASMIndirect
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Sign in to ASM
// @author       grajef@
// @match        https://aftlite-na.amazon.com/indirect_action/signin_indirect_action*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/ASMIndirect.user.js
// @grant        none
// ==/UserScript==

(function() {
    let button1 = "ASM";
    let button2 = "EOS";
    
    var button = document.createElement("button");
    button.innerHTML = button1;
    button.onclick = function() {
        var login = document.getElementsByTagName("span")[0].innerHTML.match(/\(([^)]+)\)/)[1];
        document.getElementsByName("name")[0].value = login;
        document.getElementsByName("code")[0].value = button1;
    };
    var buttonEOS = document.createElement("button");
    buttonEOS.innerHTML = button2;
    buttonEOS.onclick = function() {
        var login = document.getElementsByTagName("span")[0].innerHTML.match(/\(([^)]+)\)/)[1];
        document.getElementsByName("name")[0].value = login;
        document.getElementsByName("code")[0].value = button2;
    };
    document.getElementsByTagName("form")[0].appendChild(button);
    document.getElementsByTagName("form")[0].appendChild(buttonEOS);
})();
