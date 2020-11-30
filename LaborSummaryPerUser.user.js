// ==UserScript==
// @name         LaborSummaryPerUser
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Gets the labor summary of individual users for the time provided
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary*
// @downloadUrl  https://github.com/jgray0705/UserScripts/raw/master/LaborSummaryPerUser.user.js
// @grant        none
// ==/UserScript==

// get labor summary of selected time period
// get list of functions from labor summary
// for each function, get uph drilldown
// on each uph drilldown, check if it includes any of the users in the input list
// create a table for each user
// display table

(function() {
    let div = document.createElement("div"); // this will hold all of our tables
    document.querySelector("form").after(div);
    let input = document.createElement("input");
    input.type = "text";
    input.name = "logins";
    input.size = 50;
    let summaryForm = document.getElementsByTagName("form")[0];
    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Search Users";
    submitButton.onclick = function() {
        div.innerHTML = "";
        submitButton.disabled = true;
        submitButton.innerHTML = "Loading";
        searchUsers(input.value.split(", "), summaryForm);
    }
    summaryForm.after(submitButton);
    summaryForm.after(input);
    let br = document.createElement("br");
    submitButton.after(br);

    function searchUsers(logins, dateForm) {
        // logins is a list of users
        // dateForm is the select boxes where the user chooses time frame
        // get labor summary for hours given to determine which functions to search for
        let request = new XMLHttpRequest();
        request.open("POST", "/labor_tracking/labor_summary", true);
        request.responseType = "document";
        let formData = new FormData(dateForm);
        request.onreadystatechange = function() {
            let functions = getFunctions(this.responseXML);
            let times = this.responseXML.querySelectorAll("b");
            for(let func of functions) {
                // get uph drilldown for each function
                // getUPHInfo returns an array of <tr> elements each with the id equal to the user login
                // for each login, get all rows that have an ID == login and put the results on a table for display
                if(func != "EOS") {
                    getAndDisplayUPHInfo(func, formData, logins, times);
                };
            }
            submitButton.disabled = false;
            submitButton.innerHTML = "Search Users";
        }
        request.send(formData);
    }

    function getFunctions(xml) {
        // find all of the functions in the labor summary
        let table = xml.getElementById("labor_summary_table");
        let functions = [];
        for(let row of table.rows) {
            let f = row.cells[0].innerHTML.trim();
            if(f != "" && f != "Function" && !functions.includes(f)) {
                functions.push(f);
            }
        }
        return functions;
    }

    function getAndDisplayUPHInfo(func, formData, logins, times) {
        // func is a string for activity name
        let request = new XMLHttpRequest();
        request.open("POST", "/labor_tracking/uph_drilldown");
        request.responseType = "document";
        formData.append("function", func);
        formData.append("zone", "--");
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                // search the result for all users in the input
                let retRows = [];
                let rows = this.responseXML.getElementById("summaryReport").children[1].querySelectorAll("tr");
                for(let row of rows) {
                    let login = row.cells[0].innerHTML.toLowerCase();
                    if(logins.includes(login)) {
                        // remove the first 2 columns (not needed)
                        row.removeChild(row.children[0]);
                        row.children[0].innerHTML = row.id;
                        row.style.backgroundColor = "#C2DFF0";
                        let table = document.getElementById(login);
                        if(table !== null) {
                            table.appendChild(row);
                        } else {
                            table = document.createElement("table");
                            table.id = login;

                            let head = document.createElement("thead");
                            table.appendChild(head);
                            let r1 = document.createElement("tr");
                            head.appendChild(r1);
                            let d = document.createElement("p");
                            d.innerHTML = login + " " + times[0].innerHTML + " - " + times[1].innerHTML;

                            let r2 = document.createElement("tr");
                            head.appendChild(r2);
                            let c1 = document.createElement("td");
                            c1.innerHTML = "Function";
                            r2.appendChild(c1);
                            let c2 = document.createElement("td");
                            c2.innerHTML = "Units";
                            r2.appendChild(c2);
                            let c3 = document.createElement("td");
                            c3.innerHTML = "Duration";
                            r2.appendChild(c3);
                            let c4 = document.createElement("td");
                            c4.innerHTML = "Rate";
                            r2.appendChild(c4);

                            for(let c of r2.cells) {
                                // set the header styles
                                c.width = "100";
                            }
                            table.appendChild(row);
                            table.style.border = "1px solid #000"
                            table.style.backgroundColor = "#DDD";
                            div.appendChild(table);
                            table.before(d);
                        }
                    }
                }
            }
        };
        request.send(formData);
    }
})();