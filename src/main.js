
import Mineslitter from "./mineslitter";

function isMobile() {
    const isAndroid = () => navigator.userAgent.match(/Android/i);
    const isBlackBerry = () => navigator.userAgent.match(/BlackBerry/i);
    const isiOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i);
    const isOpera = () => navigator.userAgent.match(/Opera Mini/i);
    const isWindows = () => navigator.userAgent.match(/IEMobile/i);
    return isAndroid() || isiOS() || isBlackBerry() || isOpera() || isWindows();
}

function main() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const gameContainer = document.querySelector(".game-container");
    const mineslitter = new Mineslitter(context, isMobile() ? 3 : 2);

    mineslitter.onsize = (width, height) => {
        canvas.width = width;
        canvas.height = height;
    };

    const radioClick = (id) => {
        const width = [9, 16, 30];
        const height = [9, 16, 16];

        const radio = document.getElementById(`mines${id}`);
        const minesCount = parseInt(radio.labels[0].innerText, 10);
        const sizeClass = id / 3 | 0;

        mineslitter.newGame(width[sizeClass], height[sizeClass], minesCount, gameContainer.offsetWidth);
    };

    radioClick(0);

    for (let i = 0; i < 9; i++) {
        document.getElementById(`mines${i}`).onclick = () => radioClick(i);
    }

    if (isMobile()) {
        const offsetX = canvas.offsetParent.offsetLeft + canvas.offsetLeft;
        const offsetY = canvas.offsetParent.offsetTop + canvas.offsetTop;
        document.addEventListener("touchend", (event) => {
            mineslitter.mouseUp(event.changedTouches[0].pageX - offsetX, event.changedTouches[0].pageY - offsetY);
        }, false);
        document.addEventListener("touchstart", (event) => {
            mineslitter.mouseDown(event.changedTouches[0].pageX - offsetX, event.changedTouches[0].pageY - offsetY);
        }, false);
    } else {
        canvas.addEventListener("mouseup", (event) => {
            mineslitter.mouseUp(event.offsetX, event.offsetY);
        }, false);
        canvas.addEventListener("mousedown", (event) => {
            mineslitter.mouseDown(event.offsetX, event.offsetY);
        }, false);
    }
}
window.addEventListener("load", main);
