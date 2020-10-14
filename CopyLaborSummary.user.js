// ==UserScript==
// @name         CopyLaborSummary
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Highlight and copy the labor summary table
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary
// @grant        none
// @downloadUrl  https://github.com/jgray0705/userscripts/raw/master/CopyLaborSummary.user.js
// ==/UserScript==

(function() {
    let form = document.getElementsByTagName("form")[0];
    let button = document.createElement("button");
    button.innerHTML = "Copy Report";
    button.onclick = function() {
        let table = document.getElementById("labor_summary_table");
        if(table !== null) {
            let body = document.body, range, sel;
            if (document.createRange && window.getSelection) {
                // clear any existing highlighted text
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();
                // selects the summary table
                try {
                    range.selectNodeContents(table);
                    sel.addRange(range);
                } catch (e) {
                    range.selectNode(table);
                    sel.addRange(range);
                }
                document.execCommand("copy");
            } else if (body.createTextRange) {
                range = body.createTextRange();
                range.moveToElementText(table);
                range.select();
                range.execCommand("Copy");
            }
        }
    }
    form.after(button);
})();