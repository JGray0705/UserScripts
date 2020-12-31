// ==UserScript==
// @name         SpecialtyToteDwellTime
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Show date/time first added for each item in a location
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_at*
// @grant        none
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/SpecialtyToteDwellTime
// ==/UserScript==

(function() {
    let specTotes = ["tsXSLACKOUT", "tsXPRODchillNP", "tsXPRODambNP", "tsXPACKrcv", "tsXTRIMrcv", "tsXTRIMpick", "tsXDELI"];

    let location = document.querySelector("h2").innerHTML.trim().split(" ")[3];
    let isSpecTote = false;
    for(let tote of specTotes) {
        if(location.includes(tote)) {
            isSpecTote = true;
            break;
        }
    }
    if(!isSpecTote) return; // only check specialty totes
    let links = document.querySelectorAll("table")[1].querySelectorAll("a");
    let xhr = new XMLHttpRequest();
    xhr.responseType = "document";
    xhr.open("GET", "/labor_tracking/lookup_history?location_name=" + location);
    xhr.onreadystatechange = function() {
        if(xhr.readyState != xhr.DONE) return;
        for(let link of links) {
            let asin = link.innerHTML.trim();
            let table = xhr.responseXML.getElementsByClassName("reportLayout")[0];
            for(let row of table.rows) {
                if(!row.cells[3].innerHTML.includes(asin)) continue; // only check history for current asin
                if(parseInt(row.cells[7].innerHTML) > 0) { // inventory was added
                    let date = FormatDate(new Date(row.cells[0].innerHTML));
                    let p = document.createElement("p");
                    p.innerHTML = "Dwell time: " + date;
                    link.after(p);
                    link.after(document.createElement("br"));
                    let dwellTimeHours = (new Date() - new Date(row.cells[0].innerHTML)) / 1000 / 3600;
                    if(dwellTimeHours >= 5) {
                        p.style.backgroundColor = "red";
                    }
                    else if(dwellTimeHours > 4){
                        p.style.backgroundColor = "yellow";
                    }
                    break;
                }
            }
        }
    }
    xhr.send();

    function FormatDate(date) {
        // return dates to be "x days, y minutes, z seconds ago"
        // date needs to be of type Date
        let output = "";
        let seconds = Math.floor((new Date() - date) / 1000); // time since date
        let interval = 0;
        if(seconds > 31536000) return "More than one year";
        interval = seconds / 2592000;
        if(interval > 1) return Math.floor(interval) + " months";
        interval = seconds / 86400;
        if(interval > 1) {
            output = Math.floor(interval) + " days, ";
            seconds -= Math.floor(interval) * 86400;
        }
        interval = seconds / 3600;
        seconds -= Math.floor(interval) * 3600;
        output += Math.floor(interval) + (Math.floor(interval) == 1 ? " hour " : " hours, ");
        interval = seconds / 60;
        output += Math.floor(interval) + (Math.floor(interval) == 1 ? " minute" : " minutes");
        return output;
    }
})();