const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");
const RECT_SIZE = 40;
let WIDTH = 8 * RECT_SIZE;
let HEIGHT = 8 * RECT_SIZE;
let grid = [];
canvas.width = WIDTH;
canvas.height = HEIGHT;
const values = {
    ZERO: "",
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

let squareClickedX;
let squareClickedY;
let TAKEINPUT = true;
const findChildren = (x, y) => {
    let endArr = [];
    if (x > 0) {
        endArr.push(grid[x - 1][y]);
        if (y > 0) {
            endArr.push(grid[x - 1][y - 1]);
        }
        if (y < HEIGHT / RECT_SIZE - 1) {
            endArr.push(grid[x - 1][y + 1]);
        }
    }
    if (y > 0) {
        endArr.push(grid[x][y - 1]);
    }
    if (x < WIDTH / RECT_SIZE - 1) {
        endArr.push(grid[x + 1][y]);
        if (y > 0) {
            endArr.push(grid[x + 1][y - 1]);
        }
        if (y < HEIGHT / RECT_SIZE - 1) {
            endArr.push(grid[x + 1][y + 1]);
        }
    }
    if (y < HEIGHT / RECT_SIZE - 1) {
        endArr.push(grid[x][y + 1]);
    }
    return endArr;
};
const showAllBombs = () => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value == values.BOMB) {
                grid[i][j].seen = true;
            }
        }
    }
};
const checkForWin = () => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value != values.BOMB && grid[i][j].value !== "") {
                if (!grid[i][j].seen) {
                    console.log(grid[i][j]);
                    return false;
                }
            }
        }
    }
    return true;
};
const renderWin = () => {
    TAKEINPUT = false;
    c.fillStyle = "red";
    c.font = "60px Comic Sans MS bold";
    c.fillText("You Win!", WIDTH / 6, HEIGHT / 2);
};
document.addEventListener(
    "contextmenu",
    (e) => {
        if (TAKEINPUT) {
            e.preventDefault();
            squareClickedX = Math.floor((e.x - 30) / RECT_SIZE);
            if (squareClickedX < 0 || squareClickedX > WIDTH / RECT_SIZE) {
                return;
            }
            squareClickedY = Math.floor((e.y - 30) / RECT_SIZE);
            console.log(squareClickedX + ", " + squareClickedY);
            if (squareClickedY < 0 || squareClickedY > HEIGHT / RECT_SIZE) {
                return;
            }
            if (!grid[squareClickedX][squareClickedY].seen) {
                if (grid[squareClickedX][squareClickedY].isFlagged) {
                    BOMBS++;
                } else {
                    BOMBS--;
                }
                grid[squareClickedX][squareClickedY].isFlagged = !grid[
                    squareClickedX
                ][squareClickedY].isFlagged;
                c.beginPath();
                c.fillStyle = "white";
                c.rect(
                    squareClickedX * RECT_SIZE,
                    squareClickedY * RECT_SIZE,
                    RECT_SIZE,
                    RECT_SIZE
                );
                c.fill();
            }
            renderGrid();
        }
    },
    !TAKEINPUT
);
document.addEventListener("click", (e) => {
    if (TAKEINPUT) {
        squareClickedX = Math.floor((e.x - 30) / RECT_SIZE);
        if (squareClickedX < 0 || squareClickedX > WIDTH / RECT_SIZE) {
            return;
        }
        squareClickedY = Math.floor((e.y - 30) / RECT_SIZE);
        if (squareClickedY < 0 || squareClickedY > HEIGHT / RECT_SIZE) {
            return;
        }
        if (grid[squareClickedX][squareClickedY].isFlagged) {
            return;
        } else if (grid[squareClickedX][squareClickedY].value == values.BOMB) {
            TAKEINPUT = false;
            showAllBombs();
            renderGrid();
            //renderLose();

            console.log("YOU LOSE");
            return;
        } else if (grid[squareClickedX][squareClickedY].value == values.ZERO) {
            let queue = [];
            queue.push(grid[squareClickedX][squareClickedY]);
            while (queue.length > 0) {
                curr = queue.shift();
                c.beginPath();
                c.fillStyle = "grey";
                c.rect(
                    curr.x * RECT_SIZE,
                    curr.y * RECT_SIZE,
                    RECT_SIZE,
                    RECT_SIZE
                );
                c.fill();
                children = findChildren(curr.x, curr.y);
                for (let i = 0; i < children.length; i++) {
                    if (
                        children[i].value == values.ZERO &&
                        !children[i].seen &&
                        !children[i].isFlagged
                    ) {
                        queue.push(children[i]);
                        children[i].seen = true;
                    } else if (
                        children[i].value != values.BOMB &&
                        !children[i].seen &&
                        !children[i].isFlagged &&
                        children[i].value != values.ZERO
                    ) {
                        c.fillStyle = "grey";
                        c.rect(
                            children[i].x * RECT_SIZE,
                            children[i].y * RECT_SIZE,
                            RECT_SIZE,
                            RECT_SIZE
                        );
                        c.fill();
                        children[i].seen = true;
                    }
                }
            }
            renderGrid();
        } else {
            c.beginPath();
            c.fillStyle = "grey";
            c.rect(
                grid[squareClickedX][squareClickedY].x * RECT_SIZE,
                grid[squareClickedX][squareClickedY].y * RECT_SIZE,
                RECT_SIZE,
                RECT_SIZE
            );
            c.fill();
            grid[squareClickedX][squareClickedY].seen = true;
            renderGrid();
        }
        if (checkForWin()) {
            showAllBombs();
            renderGrid();
            renderWin();
        }
    }
});
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
    "",
    "grey",
];
function Node(x, y) {
    this.seen = false;
    this.value = values.ZERO;
    this.x = x;
    this.y = y;
    this.isFlagged = false;
}
const modes = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2,
};
let BOMBS = 10;
const makeBombs = () => {
    for (let i = 0; i < BOMBS; i++) {
        let bombX = Math.max(
            0,
            Math.floor(Math.random() * (WIDTH / RECT_SIZE))
        );
        let bombY = Math.max(
            0,
            Math.floor(Math.random() * (HEIGHT / RECT_SIZE))
        );
        if (grid[bombX][bombY].value == values.BOMB) {
            i--;
            continue;
        }
        grid[bombX][bombY].value = values.BOMB;
        try {
            if (grid[bombX - 1][bombY - 1].value != 9) {
                grid[bombX - 1][bombY - 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX + 1][bombY + 1].value != 9) {
                grid[bombX + 1][bombY + 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX - 1][bombY + 1].value != 9) {
                grid[bombX - 1][bombY + 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX + 1][bombY - 1].value != 9) {
                grid[bombX + 1][bombY - 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX][bombY - 1].value != 9) {
                grid[bombX][bombY - 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX][bombY + 1].value != 9) {
                grid[bombX][bombY + 1].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX - 1][bombY].value != 9) {
                grid[bombX - 1][bombY].value++;
            }
        } catch (error) {}
        try {
            if (grid[bombX + 1][bombY].value != 9) {
                grid[bombX + 1][bombY].value++;
            }
        } catch (error) {}
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
            if (grid[i][j].isFlagged) {
                c.font = "30px Comic Sans MS";
                c.fillText(
                    "🚩",
                    i * RECT_SIZE + RECT_SIZE / 5 - 5,
                    j * RECT_SIZE + RECT_SIZE - 10
                );
            } else if (grid[i][j].seen) {
                if (!grid[i][j].isFlagged) {
                    drawSquare(i * RECT_SIZE, j * RECT_SIZE, grid[i][j].value);
                } else {
                    drawSquare(i * RECT_SIZE, j * RECT_SIZE, 10);
                }
            }
        }
    }
    document.getElementById("Bombs").textContent = "Bombs left: " + BOMBS;
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
            let newN = new Node(i, j);
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
document.getElementById("reset").addEventListener("click", () => {
    TAKEINPUT = true;
    grid = createGrid(mode);
    makeBombs();
    renderGrid();
});
document.getElementById("difficulty").addEventListener("change", () => {
    if (parseInt(document.getElementById("difficulty").value) != mode) {
        TAKEINPUT = true;
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
