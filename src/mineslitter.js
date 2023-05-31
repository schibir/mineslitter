
class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 0;
        this.mine = false;
        this.empty = false;
    }

    draw(ctx, img, scale, count, max_count, win) {
        const draw = (sx, sy) => {
            ctx.drawImage(img, sx, sy, 48, 48,
                12 + 16 * this.x * scale, 55 + 16 * this.y * scale, 16 * scale, 16 * scale);
        };

        if (count === this.value) {
            if (this.mine) win ? draw(48 * 9, 48) : draw(48 * this.value, 48 * 2);
            else draw(48 * this.value, 0);
        } else if (count < this.value) {
            if (this.mine) draw(48 * this.value, 48 * 2);
            else if (this.empty) {
                if (max_count >= this.value) draw(48 * this.value, 0);
                else draw(48 * this.value, 48 * 3);
            } else draw(48 * this.value, 48);
        } else if (this.mine) draw(48 * 9, 48 * 3);
        else draw(48 * this.value, 48 * 3);
    }
}

export default class Mineslitter {
    constructor(context, scale) {
        this.context = context;
        this.myscale = scale;
        this.onsize = () => {};
        this.onwin = () => {};

        this.img_skin = document.getElementById("skin");
        this.img_tiles = document.getElementById("tiles");
    }

    newGame(width, height, mines, maxwidth) {
        this.stopGame();
        this.game_over = false;
        this.width = width;
        this.height = height;
        this.maxwidth = maxwidth;
        this.mines = mines;
        this.mines_left = this.mines;

        this.scale = Math.min(this.myscale, (maxwidth - 24) / (this.width * 16));

        /* eslint-disable indent */
        this.onsize(this.width * 16 * this.scale + 24,
                    this.height * 16 * this.scale + 67);
        /* eslint-enable indent */

        this.startGame();

        this.draw();
    }

    startGame() {
        this.generate();
        this.startTime = Date.now();

        this.timerId = setInterval(() => this.drawTime(), 100);
    }

    stopGame() {
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = 0;
    }

    adjacentTiles(tile, callback) {
        for (let x = tile.x - 1; x <= tile.x + 1; x++) {
            for (let y = tile.y - 1; y <= tile.y + 1; y++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    callback(this.tiles[x + y * this.width]);
                }
            }
        }
    }

    generate() {
        const rand = (n) => Math.random() * n | 0;

        // generate all mines
        const mines = new Array(this.width * this.height);
        for (let i = 0; i < this.mines; i++) {
            const ind = rand(this.width * this.height);
            if (mines[ind]) i--;
            else mines[ind] = true;
        }

        this.tiles = new Array(this.width * this.height);
        for (let i = 0; i < this.tiles.length; i++) {
            const x = i % this.width | 0;
            const y = i / this.width | 0;
            this.tiles[i] = new Tile(x, y);
        }

        // calc value for mineless tiles
        this.tiles.forEach((tile) => {
            let count = 0;
            this.adjacentTiles(tile, (next) => {
                const ind = next.x + next.y * this.width;
                if (mines[ind]) count++;
            });
            const ind = tile.x + tile.y * this.width;
            this.tiles[ind].value = count;
        });

        // check for complete mines
        this.tiles.forEach((tile) => {
            let count = 0;
            this.adjacentTiles(tile, () => count++);
            if (count === tile.value) {
                this.adjacentTiles(tile, (next) => {
                    const ind = next.x + next.y * this.width;
                    this.tiles[ind].mine = true;
                    this.mines_left--;
                });
            }
        });
    }

    adjacentCount(tile) {
        let count = 0;
        this.adjacentTiles(tile, (next) => {
            if (next.mine) count++;
        });
        return count;
    }

    checkWin() {
        let countProperlyTile = 0;
        this.tiles.forEach((tile) => {
            let count = this.adjacentCount(tile);
            if (count === tile.value) countProperlyTile++;
        });
        if (countProperlyTile === this.width * this.height) {
            this.stopGame();
            this.onwin(Date.now() - this.startTime);
            this.tiles.forEach((tile) => {
                tile.draw(this.context, this.img_tiles, this.scale, tile.value, tile.value, true);
            });

            this.game_over = true;
            this.drawSmile(4);
        }
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
        this.drawRect(52 + 26 * state, 25, 26, 26, this.width * 8 * this.scale - 1, 16, 26, 26);
    }

    drawMinesLeft() {
        this.drawNumber(this.mines_left, 17);
    }

    drawTime() {
        const time = Date.now() - this.startTime;
        const sec = time / 1000 | 0;
        this.drawNumber(sec, 12 + this.width * 16 * this.scale - 4 - 40);
    }

    drawRect(sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        this.context.drawImage(this.img_skin, sx, sy, swidth, sheight,
            dx, dy, dwidth, dheight);
    }

    drawTile(tile) {
        let count = this.adjacentCount(tile);
        let max_count = count;
        this.adjacentTiles(tile, (next) => {
            let next_count = this.adjacentCount(next);
            if (next_count < next.value) {
                if (!next.mine && !next.empty) max_count++;
            }
        });
        tile.draw(this.context, this.img_tiles, this.scale, count, max_count, false);
    }

    draw() {
        this.drawRect(0, 0, 12, 55, 0, 0, 12, 55);
        this.drawRect(40, 0, 12, 55, this.width * 16 * this.scale + 12, 0, 12, 55);
        this.drawRect(12, 0, 20, 55, 12, 0, this.width * 16 * this.scale, 55);
        this.drawRect(0, 72, 12, 12, 0, 55 + this.height * 16 * this.scale, 12, 12);
        this.drawRect(20, 72, 12, 12, this.width * 16 * this.scale + 12,
            55 + this.height * 16 * this.scale, 12, 12);
        this.drawRect(0, 56, 12, 10, 0, 55, 12, this.height * 16 * this.scale);
        this.drawRect(12, 72, 8, 12, 12, 55 + this.height * 16 * this.scale,
            this.width * 16 * this.scale, 12);
        this.drawRect(20, 64, 12, 8, this.width * 16 * this.scale + 12,
            55, 12, this.height * 16 * this.scale);
        this.drawRect(52, 0, 41, 25, 16, 16, 41, 25);
        this.drawRect(52, 0, 41, 25, 12 + this.width * 16 * this.scale - 4 - 41, 16, 41, 25);

        this.tiles.forEach((tile) => this.drawTile(tile));

        this.drawMinesLeft();
        this.drawTime();
        this.drawSmile(0);
    }

    // mouse

    isSmile(x, y) {
        return x > this.width * 8 * this.scale - 1 &&
               x < this.width * 8 * this.scale - 1 + 26 &&
               y > 16 &&
               y < 16 + 26;
    }

    mouseDown(x, y, button) {
        const smile = this.isSmile(x, y);
        if (smile) {
            this.drawSmile(1);
            return;
        }
        if (this.game_over) return;
        if (!smile) this.drawSmile(2);

        const floatX = (x - 12) / (16 * this.scale);
        const floatY = (y - 55) / (16 * this.scale);
        if (floatX >= 0 && floatX < this.width && floatY >= 0 && floatY < this.height) {
            const indX = floatX | 0;
            const indY = floatY | 0;
            const tile = this.tiles[indX + indY * this.width | 0];
            if (tile.value !== 9) {
                if (button === 2) {
                    if (!tile.mine) this.mines_left--;
                    tile.mine = true;
                    this.drawMinesLeft();
                } else if (button === 0) tile.empty = true;
                else if (button === 1) {
                    let count = this.adjacentCount(tile);
                    if (count === tile.value) {
                        this.adjacentTiles(tile, (next) => {
                            if (!next.mine) next.empty = true;
                        });
                    }
                }
                else return;
                this.tiles.forEach((tile) => this.drawTile(tile));
                this.checkWin();
            }
        }
    }

    mouseUp(x, y) {
        if (this.isSmile(x, y)) {
            this.drawSmile(0);
            this.newGame(this.width, this.height, this.mines, this.maxwidth);
        }
        if (this.game_over) return;
        this.drawSmile(0);
    }
}
