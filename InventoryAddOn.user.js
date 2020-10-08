// ==UserScript==
// @name         Inventory Add-on
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add inventory search form to the inventory results page
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_for_asin*
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_at*
// @match        https://aftlite-na.amazon.com/inventory/view_catalog_data_for_asin*
// @match        https://aftlite-portal.amazon.com/inventory/view_inventory_for_asin_display*
// @grant        none
// ==/UserScript==

(function() {
    // just copy of the HTML from the inventory page
    var tables = document.getElementsByTagName("table");
    var table = tables[tables.length - 1];
    var row1 = document.createElement("tr");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("tr");
    row1.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_inventory_for_asin" method="post">Inventory by ASIN or UPC <input type="text" name="asin" size="20"><input type="submit" name="view" value="view or update"/></form></td>'
    row2.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_inventory_at" method="post">Inventory by Location <input type="text" name="location_name" size="20"/><input type="submit" name="view" value="view or move"/></form></td>'
    row3.innerHTML = '<td><form accept-charset="UTF-8" action="/inventory/view_catalog_data_for_asin" method="post">Catalog or weight data by ASIN <input type="text" name="asin" size="20"/><input type="submit" name="view" value="View"/></form></td>';
    tables[1].appendChild(row1);
    tables[1].appendChild(row2);
    tables[1].appendChild(row3);
    if(window.location.href.indexOf("aftlite-portal" <= -1)) { // check for portal page to add some classes for css
        var buttons = document.querySelectorAll('input[type="submit"]');
        buttons.forEach(x => {
            x.classList.add("a-button-primary");
            x.classList.add("a-button");
            x.style.borderRadius = '2px';
            x.style.padding = '1px';
        }); // make all of the buttons match
        if(window.location.href.indexOf("view_inventory_for_asin_display") <= -1) { // asin page for AFTLite-Portal
            var portalAsinHeader = document.getElementsByTagName("h3")[0].innerHTML.split(" ");
            addImage(portalAsinHeader);
        }
    }
    else if(window.location.href.indexOf("view_inventory_for_asin") <= -1) { // add image to asin page for AFTLite-na
        var asinHeader = document.getElementsByTagName("h2")[0].innerHTML.split(" ");
        addImage(asinHeader);
    }
})();

function addImage(title) {
    var asin = title[title.length - 1];
    var img = document.createElement("img");
    img.src = "https://m.media-amazon.com/images/P/" + asin + ".jpg";
    img.width = 250
    document.body.appendChild(img);
}