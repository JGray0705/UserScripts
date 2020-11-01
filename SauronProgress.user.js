// ==UserScript==
// @name         SauronProgress
// @namespace    https://github.com/JGray0705/UserScripts
// @version      2.0
// @description  Change progress bar color based on if you are on time, behind, or too far ahead
// @author       grajef@
// @match        http://sauron-na.aka.amazon.com/*
// @downloadURL  https://github.com/JGray0705/UserScripts/raw/master/SauronProgress.user.js
// @grant        none
// ==/UserScript==

(function() {
    let s = document.getElementsByTagName("span")[0];
    let green = document.createElement("p");
    let blue = document.createElement("p");
    let red = document.createElement("p");
    let targetInput = document.createElement("select");
    let time = document.createElement("p");

    green.innerHTML = "A green progress bar indicates batching is on time.";
    blue.innerHTML = "A blue progress bar indicates batching is ahead.";
    red.innerHTML = "A red progress bar indicates batching is behind.";
    time.innerHTML = "Targe completion time: " + new Date().getHours() + ":";

    green.style.color = "green";
    blue.style.color = "#5d9def";
    red.style.color = "red";

    s.after(green);
    green.after(blue);
    blue.after(red);

    let goal = document.createElement("p");
    red.after(goal);

    goal.after(time);
    time.appendChild(targetInput);

    for(let i = 0; i < 60; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        targetInput.appendChild(option);
    }

    targetInput.value = getCookie("completionTime");
    targetInput.onchange = function() {
       document.cookie = "completionTime=" + this.value; // set the cookie so user does not need to select this box every time page loads
    }

    function getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) { // separate the cookies
          let [k,v] = el.split('='); // split by name, value
          cookie[k.trim()] = v;
      });
      return cookie[name];
    }

    setInterval(function() {
        let progress = document.getElementsByTagName("b")[1].innerHTML.split("(")[1].split(")")[0].split("%")[0];
        progress = Number(progress);
        var bars = document.querySelectorAll(".progress-bar");
        if(progress >= 100) {
            // all done! set to green
            goal.innerHTML = "Target: 100%";
            for(let bar of bars) {
                bar.classList.add("bg-success");
            }
        }
        else {
            let t = new Date();
            let min = t.getMinutes() * 100;

            let timePercent = min / targetInput.value;
            goal.innerHTML = "Target: " + (timePercent > 100 ? 100 : Math.round(timePercent)) + "%";
            if(timePercent > progress) {
                // we are behind. set to red
                for(let bar of bars) {
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "red";
                }
            }
            else if(timePercent < (progress - 5)) {
                // ahead, too many batchers. set to blue
                for(let bar of bars) {
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "#5d9def";
                }
            }
            else {
                for(let bar of bars) {
                    // on time. set to green
                    bar.classList.remove("bg-success");
                    bar.style.backgroundColor = "green";
                }
            }
        }
    }, 5000);
})();
