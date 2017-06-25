// ==UserScript==
// @name         bilibili - Frame seeking
// @namespace    dwscdv3
// @version      1.0
// @description  
// @author       Dwscdv3
// @include      *://www.bilibili.com/html/html5player.html*
// @include      *://www.bilibili.com/blackboard/html5player.html*
// @include      *://www.bilibili.com/video/av*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement("style");
    style.innerHTML =
        ".bilibili-player-video-progress-bar { width: calc(100% - 60px) }" +
        ".bilibili-player-video-progress > div { display: inline-block }" +
        ".bilibili-player-video-progress > .bilibili-player-video-btn { vertical-align: top }";
    document.body.appendChild(style);

    var fps = 24;
    var video;

    var loop1 = setInterval(function () {
        if (document.getElementsByClassName("bilibili-player-context-menu-container black").length > 0) {
            video = document.getElementsByTagName("video")[0];
            clearInterval(loop1);
            var videoRect = video.getBoundingClientRect();
            fireMouseEvent(video, "contextmenu", {
                bubbles: true,
                button: 2,
                clientX: videoRect.left,
                clientY: videoRect.top
            });
            setTimeout(function () {
                fireEvent(
                    document.getElementsByClassName("bilibili-player-context-menu-container active")[0]
                    .children[0]
                    .children[5]
                    .children[0],
                    "click", { bubbles: true }
                );
                setTimeout(function () {
                    fps = parseFloat(document.querySelector("[data-name=fps]").children[1].textContent);
                    console.log("FPS: " + fps);
                    fireEvent(document.getElementsByClassName("bilibili-player-video-info-close")[0], "click");
                    var prog = document.getElementsByClassName("bilibili-player-video-progress")[0];
                    var prevButton = document.createElement("div");
                    prevButton.textContent = "<";
                    prevButton.className = "bilibili-player-video-btn";
                    prevButton.onclick = prevFrame;
                    prog.appendChild(prevButton);
                    var nextButton = document.createElement("div");
                    nextButton.textContent = ">";
                    nextButton.className = "bilibili-player-video-btn";
                    nextButton.onclick = nextFrame;
                    prog.appendChild(nextButton);
                }, 500);
            }, 500);
        }
    }, 100);

    function prevFrame() {
        player.pause();
        video.currentTime -= 1 / fps;
        console.debug("CurrentTime: " + video.currentTime);
    }
    function nextFrame() {
        player.pause();
        video.currentTime += 1 / fps;
        console.debug("CurrentTime: " + video.currentTime);
    }
    function fireEvent(element, eventType, params) {
        if (element.fireEvent) {
            element.fireEvent('on' + eventType);
        } else {
            var event = new Event(eventType, params);
            element.dispatchEvent(event);
        }
    }
    function fireMouseEvent(element, eventType, params) {
        if (element.fireEvent) {
            element.fireEvent('on' + eventType);
        } else {
            var event = new MouseEvent(eventType, params);
            element.dispatchEvent(event);
        }
    }
})();
