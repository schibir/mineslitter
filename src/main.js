
import Mineslitter from "./mineslitter";

function main() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const mineslitter = new Mineslitter(context);

    canvas.addEventListener("mouseup", (event) => {
    }, false);

    canvas.addEventListener("mousedown", (event) => {
    }, false);

    canvas.addEventListener("mousemove", (event) => {
    }, false);
}
document.addEventListener("DOMContentLoaded", main);
