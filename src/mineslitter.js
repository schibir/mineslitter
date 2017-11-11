
export default class Mineslitter {
    constructor(context) {
        this.context = context;
        this.scale = 1.5;
        this.onsize = () => {};

        this.img_skin = document.skin;
        this.img_tiles = document.tiles;
    }

    newGame(width, height, mines) {
        this.stopGame();
        this.game_over = false;
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.mines_left = this.mines;

        /* eslint-disable indent */
        this.onsize(this.width * 16 * this.scale + 24 * this.scale,
                    this.height * 16 * this.scale + 67 * this.scale);
        /* eslint-enable indent */

        this.startTime = Date.now();

        this.draw();
    }

    stopGame() {
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = 0;
    }

    /* Draw */

    drawNumber(number, pos) {
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const num = clamp(number, 0, 999);
        const elem = new Array(3);
        elem[0] = num / 100 | 0;
        elem[1] = num / 10 % 10 | 0;
        elem[2] = num % 10 | 0;

        let posx = pos;
        elem.forEach((e) => {
            this.drawRect(94 + e * 13, 0, 13, 23, posx, 17, 13, 23);
            posx += 13;
        });
    }

    drawSmile(state) {
        this.drawRect(52 + 26 * state, 25, 26, 26, this.width * 8 - 1, 16, 26, 26);
    }

    drawMinesLeft() {
        this.drawNumber(this.mines_left, 17);
    }

    drawTime() {
        const time = Date.now() - this.startTime;
        const sec = time / 1000 | 0;
        this.drawNumber(sec, 12 + this.width * 16 - 4 - 40);
    }

    drawRect(sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        this.context.drawImage(this.img_skin, sx, sy, swidth, sheight,
            dx * this.scale, dy * this.scale, dwidth * this.scale, dheight * this.scale);
    }

    // drawTile(tile) {
    //     tile.draw(this.context, this.img_tiles, this.scale);
    // }

    draw() {
        this.drawRect(0, 0, 12, 55, 0, 0, 12, 55);
        this.drawRect(40, 0, 12, 55, this.width * 16 + 12, 0, 12, 55);
        this.drawRect(12, 0, 20, 55, 12, 0, this.width * 16, 55);
        this.drawRect(0, 72, 12, 12, 0, 55 + this.height * 16, 12, 12);
        this.drawRect(20, 72, 12, 12, this.width * 16 + 12, 55 + this.height * 16, 12, 12);
        this.drawRect(0, 56, 12, 10, 0, 55, 12, this.height * 16);
        this.drawRect(12, 72, 8, 12, 12, 55 + this.height * 16, this.width * 16, 12);
        this.drawRect(20, 64, 12, 8, this.width * 16 + 12, 55, 12, this.height * 16);
        this.drawRect(52, 0, 41, 25, 16, 16, 41, 25);
        this.drawRect(52, 0, 41, 25, 12 + this.width * 16 - 4 - 41, 16, 41, 25);

        // this.tiles.forEach((tile) => this.drawTile(tile, false));

        this.drawMinesLeft();
        this.drawTime();
        this.drawSmile(0);
    }
}
