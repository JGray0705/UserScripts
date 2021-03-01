// ==UserScript==
// @name         AsinBulkMove
// @namespace    https://github.com/jgray0705/UserScripts
// @version      1.0
// @description  Move all of one asin into one location
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_for_asin*
// @match        https://aftlite-portal.amazon.com/inventory/view_inventory_for_asin_display*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/AsinBulkMove.user.js
// @grant        none
// ==/UserScript==

(function() {
    let inputDiv = document.createElement("div");
    let textBox = document.createElement("input");
    let textBoxDate = document.createElement("input");
    let button = document.createElement("button");
    textBox.type = "text";
    textBoxDate.type = "text";
    textBox.placeholder = "Destination Location";
    textBoxDate.placeholder = "Exp Date";
    textBoxDate.size = "6";
    button.type = "submit";
    textBox.Name = "destinationLocation";
    textBoxDate.Name = "expirationDate";
    button.innerHTML = "Move all";
    inputDiv.append(textBox);
    inputDiv.append(textBoxDate);
    inputDiv.append(button);

    let title = document.getElementsByTagName("h2")[0];
    let t = title.innerHTML.split(" ");
    let asin = t[t.length - 1].trim();

    if(window.location.href.match("aftlite-portal")) {
        let mainDiv = document.getElementById("main-content");
        if(!mainDiv) { mainDiv = document.getElementById("a-page"); }
        mainDiv.before(inputDiv);
    } else {
        try {
            let table = document.getElementsByTagName("table")[1];
            table.before(inputDiv);
            let total = 0;
            for(let row of table.rows) {
                let cell = row.cells[0];
                let loc = cell.innerHTML.split("[")[0].trim();
                if(loc.includes("csX")) {
                    total++;
                }
            }
            let completion = document.createElement("span");
            let completed = 0;
            completion.innerHTML = "Moved: 0/" + total;
            completion.style.color = "Green";
            button.onclick = function(){
                button.after(completion);
                let i = 0;
                let interval = setInterval(function() {
                    let row = table.rows[i];
                    let cell = row.cells[0];
                    if(cell.innerHTML.includes("csX")) {
                        let loc = cell.children[0].innerHTML.split("[")[0].trim(); // get text from <a>
                        let date = row.cells[5].querySelector('input[name="expiration_date"').value;
                        if(date != textBoxDate.value) {
                            let dateStr = "20" + textBoxDate.value.substring(4, 6) + "-" + textBoxDate.value.substring(0, 2) + "-" + textBoxDate.value.substring(2, 4) + "T12:00:00";
                            let dateMinusOne = new Date(dateStr);
                            dateMinusOne = new Date(dateMinusOne - 3600000 * 24);
                            let month = dateMinusOne.getMonth() >= 9 ? dateMinusOne.getMonth() + 1 : "0" + (dateMinusOne.getMonth() + 1);
                            let day = dateMinusOne.getDate() >= 10 ? dateMinusOne.getDate() : "0" + dateMinusOne.getDate();
                            let year = String(dateMinusOne.getFullYear());
                            let d = month + day + year.substring(2);

                            let xhr = new XMLHttpRequest();
                            let form = row.cells[5].querySelector("form");
                            xhr.open("POST", form.action);
                            xhr.responseType = "document";
                            let data = new FormData(form);
                            data.append("expiration_date", d);
                            xhr.send(data);
                        }
                        let moveData = new FormData();
                        moveData.append("location_to_name", textBox.value.trim());
                        moveData.append("quantity", row.cells[3].querySelector('input[name="quantity"]').value.trim());
                        moveData.append("asin", asin);
                        moveData.append("location_from_name", loc);
                        moveData.append("location_from_id", cell.children[0].innerHTML.split("[")[1].split("]")[0].trim());
                        moveData.append("source_item_id", row.cells[3].querySelector('input[name="id"]').value.trim());
                        let req = new XMLHttpRequest();
                        req.open("POST", "/inventory/move_inventory");
                        req.send(moveData);
                        req.onreadystatechange = function() {
                            if(req.readyState != req.DONE) return;
                            completed++;
                            completion.innerHTML = "Moved: " + completed + "/" + total;
                        }
                    }
                    i++;
                    if(i == table.rows.length) clearInterval(interval);
                }, 375);
                //setTimeout(function() {
                //location = location + "?asin=" + asin;
                //}, 4000);
            }
        } catch(e) {console.log(e);}
    }
})();