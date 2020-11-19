// ==UserScript==
// @name         BlindCountsDueDate
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Show the date/time that blind counts are due
// @author       grajef@
// @match        https://aftlite-na.amazon.com/bcc/assign*
// @match        https://aftlite-portal.amazon.com/bcc_admin/assign*
// @grant        none
// ==/UserScript==

(function() {
    var table = 0;
    if(window.location.href.match("aftlite-na")) {
        table = document.querySelectorAll("table")[1];
    } else table = document.querySelectorAll("table")[0];
    let head = document.createElement("th");
    head.innerHTML = "Due By";
    table.children[0].children[0].appendChild(head);
    let head2 = document.createElement("th");
    head2.innerHTML = "Bins";
    table.children[0].children[0].appendChild(head2);

    let today = new Date();
    for(let row of table.rows) {
        try{
            // Second_AdHoc_2020-11-16_04-33-21
            let title = row.cells[0].innerHTML.split(">")[1].split("<")[0];
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
            if(today.getDay() == d.getDay() && today.getMonth() == d.getMonth() && today.getYear() == d.getYear()) {
                // count is due today
                data.style.backgroundColor = "yellow";
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
                }
                for(let bin of bins.rows) {
                    total++;
                    if(!bin.cells[2].innerHTML.includes("Incomplete")) {
                        complete++;
                    }
                }
                let d = document.createElement("td");
                d.innerHTML = complete + "/" + total;
                row.appendChild(d);
            }
            req.send();
        } catch {} // don't really need anything here. This will fail if the list name is in a different format. Pick skip counts always have the same format
    }
})();