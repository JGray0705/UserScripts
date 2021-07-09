// ==UserScript==
// @name         Inventory Add-on
// @namespace    https://github.com/jgray0705/userscripts
// @version      3.0
// @description  Add inventory search form to the inventory results page
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_for_asin*
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_at*
// @match        https://aftlite-na.amazon.com/inventory/view_catalog_data_for_asin*
// @match        https://aftlite-portal.amazon.com/inventory/view_inventory_for_asin_display*
// @match        https://aftlite-portal.amazon.com/inventory/view_inventory_at*
// @match        https://aftlite-portal.amazon.com/inventory/view_catalog_data_for_asin*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/InventoryAddOn.user.js
// @grant        none
// ==/UserScript==

(function() {
    // highlight missing exp dates red
    let td = document.querySelectorAll("td");
    for(let t of td) {
        if(t.innerHTML.trim() == "Missing") {
            t.style.backgroundColor = "red";
        }
    }
    // just copy of the HTML from the inventory page
    if(window.location.href.match("aftlite-portal")) { // check for portal page to add some classes for css
        var mainDiv = document.getElementById("main-content");
        if(!mainDiv) { mainDiv = document.getElementById("a-page"); }
        var portalRow1 = document.createElement("div");
        var portalRow2 = document.createElement("div");
        var portalRow3 = document.createElement("div");
        portalRow1.innerHTML = '<form accept-charset="UTF-8" action="/inventory/view_inventory_for_asin" method="post">Inventory by ASIN or UPC <input type="text" name="asin" size="20"><input type="submit" name="view" value="view or update"/></form>'
        portalRow2.innerHTML = '<form accept-charset="UTF-8" action="/inventory/view_inventory_at" method="get">Inventory by Location <input type="text" name="location_name" size="20"/><input type="submit" name="view" value="view or move"/></form>'
        portalRow3.innerHTML = '<form accept-charset="UTF-8" action="/inventory/view_catalog_data_for_asin" method="post">Catalog or weight data by ASIN <input type="text" name="asin" size="20"/><input type="submit" name="view" value="View"/></form>';
        mainDiv.appendChild(portalRow1);
        mainDiv.appendChild(portalRow2);
        mainDiv.appendChild(portalRow3);
        var buttons = document.querySelectorAll('input[type="submit"]');
        buttons.forEach(x => {
            x.classList.add("a-button-primary");
            x.classList.add("a-button");
            x.style.borderRadius = '2px';
            x.style.padding = '1px';
        }); // make all of the buttons match
        if(window.location.href.match("view_inventory_for_asin_display")) { // asin page for AFTLite-Portal
            var portalAsinHeader = document.getElementsByTagName("h3")[0];
            addImage(portalAsinHeader);
        }
    }
    else {
        var tables = document.getElementsByTagName("table");
        var table = tables[tables.length - 1];
        var row1 = document.createElement("tr");
        var row2 = document.createElement("tr");
        var row3 = document.createElement("tr");
        row1.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_inventory_for_asin" method="post">Inventory by ASIN or UPC <input type="text" name="asin" size="20"><input type="submit" name="view" value="view or update"/></form></td>'
        row2.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_inventory_at" method="post">Inventory by Location <input type="text" name="location_name" size="20"/><input type="submit" name="view" value="view or move"/></form></td>'
        row3.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_catalog_data_for_asin" method="post">Catalog or weight data by ASIN <input type="text" name="asin" size="20"/><input type="submit" name="view" value="View"/></form></td>';
        try {
        tables[1].appendChild(row1);
        tables[1].appendChild(row2);
        tables[1].appendChild(row3);
        } catch (e) {
            let h = document.getElementsByTagName("html")[0];
            h.appendChild(row1);
            h.appendChild(row2);
            h.appendChild(row3);
        }
        if(window.location.href.match("view_inventory_for_asin")) { // add image to asin page for AFTLite-na
            var asinHeader = document.getElementsByTagName("h2")[0];
            addImage(asinHeader);
        }
    }
})();

function addImage(title) {
    let t = title.innerHTML.split(" ");
    let asin = t[t.length - 1];
    let img = document.createElement("img");
    img.src = "https://m.media-amazon.com/images/P/" + asin + ".jpg";
    img.width = 250
    let barcode = document.createElement("img");
    barcode.src = "https://aftlite-na.amazon.com/barby_generator/view_barcode?code=" + asin;
    barcode.width = 120;
    barcode.height = 80;
    document.body.appendChild(img);
    title.after(barcode);
    barcode.after(document.createElement("br"));
}

