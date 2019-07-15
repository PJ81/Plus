const numbers = [];
const board = [];
const extra = [];
let scoreVal, score, maxRandom = 6,
    deleting = false;

function start() {
    create();
    reset();
    scoreVal.innerText = ("00000" + score).slice(-6);
    showMaxRandom()
}

function rnd() {
    return (Math.floor(Math.random() * maxRandom) + 1);
}

function reset() {
    score = 0;
    for (let t of board) {
        t.number = 0;
        t.innerText = "";
        t.topped = false;
    }
    for (let t of extra) {
        t.innerText = "D";
        t.used = false;
        t.className = "square small squareH";
    }
    for (let t of numbers) {
        t.number = rnd();
        t.innerText = `${t.number}`;
    }
}

function showMaxRandom() {
    let str = "";
    for (let l = 1; l <= maxRandom; l++) {
        str += `${l} `
    }
    document.getElementById("possibles").innerText = str;
}

function click() {
    if (deleting) {
        clearCell(this);
        deleting = false;
        return;
    }
    if (this.topped) return;

    if (this.number === 0) {
        this.number = numbers[0].number;
        this.classList.add("green");
    } else {
        this.number += numbers[0].number;
        this.topped = true;
        this.classList.remove("green");
        this.classList.add("red");
    }
    this.innerText = `${this.number}`;

    checkColRows();

    score += numbers[0].number;
    if (score > (maxRandom * (maxRandom - 1) * (maxRandom - 2))) {
        maxRandom++;
        showMaxRandom();
    }

    rotateNumbers();

    scoreVal.innerText = ("00000" + score).slice(-6);
}

function clearCell(d) {
    d.number = 0;
    d.innerText = "";
    d.topped = false;
    d.remove = false;
    d.classList.remove("green");
    d.classList.remove("red");
}

function checkColRows() {
    let found = true;
    for (let a = 1; a < 7; a++) {
        const n = document.getElementById(`qd${a}1`).number;
        if (n < 1) continue;
        found = true;
        for (let r = 2; r < 7; r++) {
            if (n !== document.getElementById(`qd${a}${r}`).number) {
                found = false;
                break;
            }
        }
        if (found) {
            score += n * 6;
            for (let r = 1; r < 7; r++) {
                document.getElementById(`qd${a}${r}`).remove = true;
            }
        }
    }
    for (let a = 1; a < 7; a++) {
        const n = document.getElementById(`qd1${a}`).number;
        if (n < 1) continue;
        found = true;
        for (let r = 2; r < 7; r++) {
            if (n !== document.getElementById(`qd${r}${a}`).number) {
                found = false;
                break;
            }
        }
        if (found) {
            score += n * 6;
            for (let r = 1; r < 7; r++) {
                document.getElementById(`qd${r}${a}`).remove = true;
            }
        }
    }

    for (let a = 1; a < 7; a++) {
        for (let r = 1; r < 7; r++) {
            const d = document.getElementById(`qd${a}${r}`);
            if (d.remove) clearCell(d);
        }
    }
}

function clearClick() {
    if (this.used) return;
    this.used = true;
    this.classList.add("red");
    this.classList.remove("squareH");
    deleting = true;
}

function rotateNumbers() {
    numbers[0].number = numbers[1].number;
    numbers[0].innerText = `${numbers[0].number}`;
    numbers[1].number = numbers[2].number;
    numbers[1].innerText = `${numbers[1].number}`;
    numbers[2].number = rnd();
    numbers[2].innerText = `${numbers[2].number}`;
}

function create() {
    const nb = document.getElementById("numbers");
    for (let r = 1; r < 4; r++) {
        const d = document.createElement("div");
        d.className = "square";
        d.id = `nb${r}`;
        d.number = 0;
        numbers.push(d);
        nb.appendChild(d);
    }
    numbers[0].classList.add("big");
    numbers[1].classList.add("mid");
    numbers[2].classList.add("mid");

    const qd = document.getElementById("quads");
    for (let a = 1; a < 7; a++) {
        for (let r = 1; r < 7; r++) {
            const d = document.createElement("div");
            d.className = "square squareH";
            d.id = `qd${a}${r}`;
            d.addEventListener("click", click, false);
            d.number = 0;
            d.remove = false;
            d.topped = false;
            board.push(d);
            qd.appendChild(d);
        }
    }

    const xt = document.getElementById("extra");
    for (let r = 1; r < 4; r++) {
        const d = document.createElement("div");
        d.id = `xt${r}`;
        d.addEventListener("click", clearClick, false);
        d.used = false;
        extra.push(d);
        xt.appendChild(d);
    }

    scoreVal = document.getElementById("scoreVal");
}