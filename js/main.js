const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");
const RECT_SIZE = 40;
let WIDTH = 8 * RECT_SIZE;
let HEIGHT = 8 * RECT_SIZE;
let grid = [];
canvas.width = WIDTH;
canvas.height = HEIGHT;
const values = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    BOMB: 9,
};
const colors = [
    "white",
    "blue",
    "red",
    "green",
    "orange",
    "yellow",
    "brown",
    "black",
    "CornflowerBlue",
];
function Node(x, y) {
    this.seen = true;
    this.value = values.ZERO;
    this.x = x;
    this.y = y;
}
const modes = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2,
};
let BOMBS = 10;
const makeBombs = () => {
    for (let i = 0; i < BOMBS; i++) {
        let bombX = Math.max(0, Math.floor(Math.random() * (WIDTH / RECT_SIZE)));
        let bombY = Math.max(0, Math.floor(Math.random() * (HEIGHT / RECT_SIZE)));
        console.log(bombX+ ", " + bombY)
        grid[bombX][bombY].value = values.BOMB;
        try {
            grid[bombX-1][bombY-1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX+1][bombY+1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX-1][bombY+1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX+1][bombY-1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX][bombY-1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX][bombY+1].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX-1][bombY].value ++;
        } catch (error) {
            
        }
        try {
            grid[bombX+1][bombY].value ++;
        } catch (error) {
            
        }
    }
};
const drawSquare = (x, y, color) => {
    if (color == 9) {
        c.font = "30px Comic Sans MS";
        c.fillText("💣", x + RECT_SIZE / 5 - 5, y + RECT_SIZE - 10);
    } else {
        c.fillStyle = colors[color];
        c.font = "40px Comic Sans MS";
        c.fillText(`${color}`, x + RECT_SIZE / 5, y + RECT_SIZE - 5);
    }
};
const renderGrid = () => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            c.beginPath();
            c.rect(i * RECT_SIZE, j * RECT_SIZE, RECT_SIZE, RECT_SIZE);
            c.stroke();
            if (grid[i][j].seen) {
                drawSquare(i * RECT_SIZE, j * RECT_SIZE, grid[i][j].value);
            }
        }
    }
};
const createGrid = (mode) => {
    let maxI;
    let maxJ;
    if (mode == modes.EASY) {
        maxI = 8;
        maxJ = 8;
        BOMBS = 10;
    }
    if (mode == modes.MEDIUM) {
        maxI = 16;
        maxJ = 16;
        BOMBS = 40;
    }
    if (mode == modes.HARD) {
        maxI = 30;
        maxJ = 16;
        BOMBS = 99;
    }
    WIDTH = RECT_SIZE * maxI;
    HEIGHT = RECT_SIZE * maxJ;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    tgrid = [];
    for (let i = 0; i < maxI; i++) {
        tmp = [];
        for (let j = 0; j < maxJ; j++) {
            let newN = new Node(i * RECT_SIZE, j * RECT_SIZE);
            tmp.push(newN);
        }
        tgrid.push(tmp);
    }
    return tgrid;
};
let mode = parseInt(document.getElementById("difficulty").value);
grid = createGrid(modes.EASY);
makeBombs();
renderGrid();
document.getElementById("difficulty").addEventListener("change", () => {
    if (parseInt(document.getElementById("difficulty").value) != mode) {
        mode = parseInt(document.getElementById("difficulty").value);
        grid = createGrid(mode);
        if (mode == modes.EASY) {
            BOMBS = 10;
        }
        if (mode == modes.MEDIUM) {
            BOMBS = 40;
        }
        if (mode == modes.HARD) {
            BOMBS = 99;
        }
        makeBombs();
        renderGrid();
    }
});
