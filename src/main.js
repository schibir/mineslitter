
import Mineslitter from "./mineslitter";
import LocalStorage from "./localStorage";

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
    const mobile = isMobile();
    const mineslitter = new Mineslitter(context, mobile ? 3 : 2);
    const localStorage = new LocalStorage();
    let currentGame = 0;

    if (mobile) {
        const rows = document.querySelectorAll(".hide-for-mobile");
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = "none";
        }
    } else {
        document.querySelector(".empty_class").style.display = "none";
    }

    mineslitter.onsize = (width, height) => {
        canvas.width = width;
        canvas.height = height;
    };

    const displayScore = (id) => {
        const score = localStorage.getBestScore(id);
        document.getElementById(`best${id}`).innerHTML = score ? score / 1000 : "-";
    };

    mineslitter.onwin = (score) => {
        localStorage.setBestScore(currentGame, score);
        displayScore(currentGame);
    };

    const radioClick = (id) => {
        const width = [9, 16, 30];
        const height = [9, 16, 16];

        const radio = document.getElementById(`mines${id}`);
        const minesCount = parseInt(radio.labels[0].innerText, 10);
        const sizeClass = id / 3 | 0;

        mineslitter.newGame(width[sizeClass], height[sizeClass], minesCount, gameContainer.offsetWidth);

        currentGame = id;
    };

    radioClick(0);

    for (let i = 0; i < 9; i++) {
        document.getElementById(`mines${i}`).onclick = () => radioClick(i);
        displayScore(i);
    }

    if (mobile) {
        const offsetX = () => canvas.offsetParent.offsetLeft + canvas.offsetLeft;
        const offsetY = () => canvas.offsetParent.offsetTop + canvas.offsetTop;
        document.addEventListener("touchend", (event) => {
            const { pageX, pageY } = event.changedTouches[0];
            mineslitter.mouseUp(pageX - offsetX(), pageY - offsetY());
        }, false);
        document.addEventListener("touchstart", (event) => {
            const { pageX, pageY } = event.changedTouches[0];
            mineslitter.mouseDown(pageX - offsetX(), pageY - offsetY(), document.getElementById('empty_mode').checked ? 0 : 2);
        }, false);
    } else {
        canvas.addEventListener("mouseup", (event) => {
            mineslitter.mouseUp(event.offsetX, event.offsetY);
        }, false);
        canvas.addEventListener("mousedown", (event) => {
            mineslitter.mouseDown(event.offsetX, event.offsetY, event.button);
        }, false);
    }

    canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); }
}
window.addEventListener("load", main);
