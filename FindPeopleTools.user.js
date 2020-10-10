// ==UserScript==
// @name         FindPeopleTools
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.1
// @description  Add auto refresh and highlight idle logins
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people*
// @match        https://aftlite-portal.amazon.com/labor_tracking/find_people*
// @grant        none
// ==/UserScript==

(function() {
    if(window.location.href.match("aftlite-na")) {
        let table = document.getElementById("recent_event_table");
        searchTable(table);
        let cb = getCheckbox();
        let label = document.createElement("label");
        label.innerHTML = "Auto Refresh";
        let p = document.getElementsByTagName("table")[0];
        p.after(cb);
        p.after(label);
        var form = getIndirectForm();
        label.before(form);
        label.before(document.createElement("br"));
        form.before(document.createElement("br"));
    }
    else {
        let portalTable = document.getElementsByTagName("table")[0];
        searchTable(portalTable);
        let cbLabel = document.createElement("label");
        let check = getCheckbox();
        check.style.float = "left";
        check.style.marginLeft = "10px";
        check.style.marginRight = "4px";
        cbLabel.innerHTML = "Auto Refresh";
        let main = document.getElementById("main-content");
        main.before(check);
        check.after(cbLabel);
    }
})();

function getCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onClick = autoReload(checkbox);
    checkbox.checked = true;
    return checkbox;
}

function searchTable(t) {
    for(let row of t.rows) {
        let cell = row.cells[7].innerHTML;
        let time = Number(row.cells[5].innerHTML.split("mins")[0]);
        if(time >= 10 || (time >= 15 && cell.includes("BRK"))) {
            if(cell.includes("IDLE") || cell.includes("TIMEOFFTASK") || (time >= 15 && cell.includes("BRK")) || !cell.includes("indirect")) {
                row.cells[5].style.background = "red";
            }
        }
    }
}
function autoReload(checkbox) {
    setInterval(function() {
        if(checkbox.checked) {
            location.reload();
        }
    }, 30000);
}

function getIndirectForm() {
    let loginInput = document.createElement("input");
    let codeInput = document.createElement("input");
    let submitButton = document.createElement("button");
    loginInput.type = "text";
    loginInput.name = "name";
    codeInput.type = "text";
    codeInput.name = "code";
    submitButton.innerHTML = "signin";

    let table = document.createElement("table");
    let row1 = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.innerHTML = "Scan Badge/Enter Login";
    td2.appendChild(loginInput);
    row1.appendChild(td1);
    row1.appendChild(td2);
    table.appendChild(row1);

    let row2 = document.createElement("tr");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    td3.innerHTML = "Scan Activity Code";
    td4.appendChild(codeInput);
    row2.appendChild(td3);
    row2.appendChild(td4);
    var td5 = document.createElement("td");
    td5.appendChild(submitButton);
    row2.appendChild(td5);
    table.appendChild(row2);

    submitButton.onclick = function() {
        let data = new FormData();
        data.append("name", loginInput.value);
        data.append("code", codeInput.value);
        data.append("utf8", "x2713");

        let request = new XMLHttpRequest();
        request.open('POST', '/indirect_action/signin_indirect_action');
        request.responseType = "document";
        request.onload = function() {
            let f = document.getElementById("Flash");
            if(f !== null) { f.innerHTML = this.responseXML.getElementById("Flash").innerHTML; }
            else { table.before(this.responseXML.getElementById("Flash")); }
            loginInput.value = "";
            codeInput.value = "";
        }
        request.send(data);
    }
    // add event to submit form when enter key is pressed
    codeInput.addEventListener("keydown", function(e) {
        if(e.keyCode == 13) {
            submitButton.click();
        }
    });
    return table;
}