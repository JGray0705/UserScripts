// ==UserScript==
// @name         Inventory Add-on
// @namespace    https://github.com/jgray0705/userscripts
// @version      1.0
// @description  Add inventory search form to the inventory results page
// @author       grajef@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_for_asin*
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_at*
// @match        https://aftlite-na.amazon.com/inventory/view_catalog_data_for_asin*
// @grant        none
// ==/UserScript==

(function() {
    var body = document.body;
    // just copy of the HTML from the inventory page
    //body.innerHTML += '<table><tr><td class="BigLabel">Inventory</td><td colspan="4"><div><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="Tr5o+H6fuuahQjuzSMSjnHfE4CoWhwX6r0UexvBRjwo="></div><table><tbody><tr><td colspan="2"><form accept-charset="UTF-8" action="/inventory/view_inventory_for_asin" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="Tr5o+H6fuuahQjuzSMSjnHfE4CoWhwX6r0UexvBRjwo="></div>Inventory by ASIN or UPC <input type="text" name="asin" size="20"><input type="submit" name="view" value="view or update"></form></td></tr><tr><td colspan="2" width="400"><form accept-charset="UTF-8" action="/inventory/view_inventory_at" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="Tr5o+H6fuuahQjuzSMSjnHfE4CoWhwX6r0UexvBRjwo="></div>Inventory by Location <input type="text" name="location_name" size="20"><input type="submit" name="view" value="view or move"></form></td></tr><tr><td colspan="2" width="400"><form accept-charset="UTF-8" action="/inventory/view_catalog_data_for_asin" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="Tr5o+H6fuuahQjuzSMSjnHfE4CoWhwX6r0UexvBRjwo="></div>Catalog or weight data by ASIN <input type="text" name="asin" size="20"><input type="submit" name="view" value="View"></form></td></tr><tr></table>';
    if(window.location.href.indexOf("view_inventory_for_asin")) { // add image to asin page
        var asinHeader = document.getElementsByTagName("h2")[0].innerHTML.split(" ");
        var asin = asinHeader[asinHeader.length - 1];
        var img = document.createElement("img");
        img.src = "https://m.media-amazon.com/images/P/" + asin + ".jpg";
        img.width = 250
        body.appendChild(img);
    }
})();
