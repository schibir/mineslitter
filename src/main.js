
import Mineslitter from "./mineslitter";

function main() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const mineslitter = new Mineslitter(context);

    mineslitter.onsize = (width, height) => {
        canvas.width = width;
        canvas.height = height;
    };

    mineslitter.newGame(9, 9, 10);

    canvas.addEventListener("mousedown", (event) => {
    }, false);
}
document.addEventListener("DOMContentLoaded", main);
