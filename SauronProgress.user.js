// ==UserScript==
// @name         SauronProgress
// @namespace    https://github.com/JGray0705/UserScripts
// @version      1.0
// @description  Change progress bar color based on if you are on time, behind, or too far ahead
// @author       grajef@
// @match        http://sauron-na.aka.amazon.com/*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/SauronProgress.user.js
// @grant        none
// ==/UserScript==

(function() {
    let s = document.getElementsByTagName("span")[0];
    let green = document.createElement("p");
    let blue = document.createElement("p");
    let red = document.createElement("p");

    green.innerHTML = "A green progress bar indicates batching is on time.";
    blue.innerHTML = "A blue progress bar indicates batching is ahead.";
    red.innerHTML = "A red progress bar indicates batching is behind.";

    green.style.color = "green";
    blue.style.color = "#5d9def";
    red.style.color = "red";

    s.after(green);
    green.after(blue);
    blue.after(red);

    let goal = document.createElement("p");
    red.after(goal);
    setInterval(function() {
        let progress = document.getElementsByTagName("b")[1].innerHTML.split("(")[1].split(")")[0].split("%")[0];
        progress = Number(progress);
        var bars = document.querySelectorAll(".progress-bar");
        if(progress >= 100) {
            // all done! set to green
            goal.innerHTML = "Target: 100%";
            for(let bar of bars) {
                bar.classList.remove("bg-success");
                bar.style.backgroundColor = "green";
            }
        }
        else {
            let t = new Date();
            let min = t.getMinutes() - 4; // since batching starts ~ 4 minutes after the hour,
            min = min < 0 ? 0 : min * 100; // min is a decimal but progress is a whole number (x% vs. .x)

            let timePercent = min / 29; // this will target completion at 33 minutes after the hour (29 + the 4 subtracted earlier)
            goal.innerHTML = "Target: " + (timePercent > 100 ? 100 : Math.round(timePercent)) + "%";
            if(timePercent > progress) {
                // we are behind. set to red
                for(let bar of bars) {
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "red";
                }
            }
            else if(timePercent < (progress + 5)) {
                // on time. set to green
                for(let bar of bars) {
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "green";
                }
            }
            else {
                // ahead, too many batchers. set to yellow
                for(let bar of bars) {
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "#5d9def";
                }
            }
        }
    }, 5000);
})();
