// ==UserScript==
// @name         BlindCountsDueDate
// @namespace    https://github.com/jgray0705/UserScripts
// @version      2.0
// @description  Show the date/time that blind counts are due
// @author       grajef@
// @match        https://aftlite-na.amazon.com/bcc/assign*
// @match        https://aftlite-portal.amazon.com/bcc_admin/assign*
// @grant        none
// ==/UserScript==

(function() {
    let table = window.location.href.match("aftlite-na") ? document.querySelectorAll("table")[1] : document.querySelectorAll("table")[0];
    let head = document.createElement("th");
    head.innerHTML = "Due By";
    table.children[0].children[0].appendChild(head);
    let head2 = document.createElement("th");
    head2.innerHTML = "Bins";
    table.children[0].children[0].appendChild(head2);

    let today = new Date();
    for(let row of table.rows) {
        // check the time for due date
        try{
            // Second_AdHoc_2020-11-16_04-33-21
            let title = row.cells[0].innerHTML.split(">")[1].split("<")[0];
            title = title.replace("Second_", "").replace("Third_", "");
            if(title.includes("AdHoc")) {
                // AdHoc_2020-11-16_04-33-21
                title = title.replace("Second_", "").replace("Third_", "");
                // AdHoc 2020-11-16 04-33-21
                let date = title.split("_");
                // 04 33 21
                let d2 = date[2].split("-");
                // 2020-11-16T04:33:21.000Z
                let d = new Date(date[1] + "T" + d2.join(":") + ".000Z"); // create date as UTC and it will convert to local time
                d = new Date(d.getTime() + 60 * 60 * 24 * 1000);
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                let data = document.createElement("td");
                data.innerHTML = d.toLocaleString();
                row.appendChild(data);
                today.setHours(23);
                today.setMinutes(59);
                today.setSeconds(59);
                if(today.getDate() == d.getDate()) {
                    // count is due today
                    data.style.backgroundColor = "yellow";
                }
                else if(today.getDate() > d.getDate()) {
                    // count is late
                    data.style.backgroundColor = "red";
                }
            }
            else if(title.includes("IRDR")) {
                // IRDR_12012020_UAZ1_5
                let date = title.split("_")[1];
                // due date == date from name + 7 days
                let d = new Date(date.substring(0, 2) + "/" + date.substring(2, 4) + "/" + date.substring(5));
                d.setDate(d.getDate() + 7);
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                let data = document.createElement("td");
                data.innerHTML = d.toLocaleString();
                row.appendChild(data);
                today.setHours(23);
                today.setMinutes(59);
                today.setSeconds(59);
                if(today.getDate() == d.getDate()) {
                    // count is due today
                    data.style.backgroundColor = "yellow";
                }
                else if(today.getDate() > d.getDate()) {
                    // count is late
                    data.style.backgroundColor = "red";
                }
            }
            else if(title.includes("LUA") || title.includes("ROV") || title.includes("DOC") || title.includes("HEC")) {
                let date = title.split("_");
                date = date[date.length - 1].split("-");
                let d = new Date(date[0] + "/" + date[1] + "/" + date[2]);
                d.setDate(d.getDate() + 1);
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                let data = document.createElement("td");
                data.innerHTML = d.toLocaleString();
                row.appendChild(data);
                today.setHours(23);
                today.setMinutes(59);
                today.setSeconds(59);
                if(today.getDate() == d.getDate()) {
                    // count is due today
                    data.style.backgroundColor = "yellow";
                }
                else if(today.getDate() > d.getDate()) {
                    // count is late
                    data.style.backgroundColor = "red";
                }
            }
            let listLink = row.children[0].getElementsByTagName("a")[0].href.replace("https://aftlite-na.amazon.com", "");
            let req = new XMLHttpRequest();
            req.open("GET", listLink);
            req.responseType = "document";
            req.onload = function() {
                let total = 0;
                let complete = 0;
                var bins = 0;
                if(window.location.href.match("aftlite-na")) {
                    bins = this.responseXML.getElementsByClassName("reportLayout")[0].children[1]; // tbody of the table
                } else {
                    bins = this.responseXML.querySelector("table");
                    total = -1;
                    complete = -1;
                }
                for(let bin of bins.rows) {
                    total++;
                    if(!bin.cells[2].innerHTML.includes("Incomplete")) {
                        complete++;
                    }
                }
                let d = document.createElement("td");
                d.innerHTML = complete + "/" + total;
                if(total > 1000) d.style.backgroundColor = "red";
                row.appendChild(d);
            }
            req.send();
        } catch(error) {
            console.log(error);
        }
        // Check status of users assigned to count
        let assignedUsers = row.cells[2].querySelectorAll("a");
        for(let user of assignedUsers) {
            let login = window.location.href.match("aftlite-portal") ? user.innerHTML.split(" ")[2].replace(")", "") : user.innerHTML.split(" ")[1].replace(")", "");
            // get last action
            let request = new XMLHttpRequest();
            request.open("GET", "/labor_tracking/lookup_history?user_name=" + login);
            request.responseType = "document";
            request.onloadend = function() {
                let lastAction = "";
                if(window.location.href.match("aftlite-portal")) {
                    let table = request.responseXML.getElementsByTagName("table")[1];
                    lastAction = table.rows[1].cells[1].lastChild.textContent.trim();
                } else {
                    let table = request.responseXML.getElementsByClassName("reportLayout")[0];
                    lastAction = table.rows[1].cells[1].innerHTML.trim();
                }
                let cell = row.cells[2];
                if(lastAction == "EOS") {
                    cell.innerHTML = cell.innerHTML.replace(login, `<span style="background-color:red;">${login}(${lastAction})</span>`);
                } else cell.innerHTML = cell.innerHTML.replace(login, `${login}(${lastAction})`);
            }
            request.send();
        }
    }
    // sort the table
    // a.	Any IRDR Counts
    // b.	Oldest 2nd and 3rd AdHocs
    // c.	Oldest 2nd and 3rd strategics
    // d.	Newest 1st AdHocs
    // e.	Newest 1st Strategic
    var rows, i, x, y, shouldSwitch;
    var switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
    first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i];
            y = rows[i + 1];
            if(x.cells[3].textContent > y.cells[3].textContent){
                shouldSwitch = true;
                break;
            }
            if(x.cells[3].textContent == y.cells[3].textContent){
                if(x.cells[0].textContent.includes("IRDR") && y.cells[0].textContent.includes("IRDR")) {
                    if(x.cells[0].textContent.includes("Second") && y.cells[0].textContent.includes("Third")) {
                        shouldSwitch = true;
                        break;
                    }
                }
                if(x.cells[0].textContent.includes("AdHoc") && y.cells[0].textContent.includes("AdHoc")) {
                    if(x.cells[0].textContent.includes("Second") && y.cells[0].textContent.includes("Third")) {
                        shouldSwitch = true;
                        break;
                    }
                    if((!x.cells[0].textContent.includes("Second") && !x.cells[0].textContent.includes("Third")) && y.cells[0].textContent.includes("Second")) {
                        shouldSwitch = true;
                        break;
                    }
                }
                if(!x.cells[0].textContent.includes("IRDR") && y.cells[0].textContent.includes("IRDR")) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
})();