function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let bag=Object.keys(tetromino);
let nextbag=Object.keys(tetromino);
shuffle(nextbag);
let blockcount=-1;

class Block {
    constructor() {
        this.mino = tetromino[bag[blockcount % 7]],
        this.r = 0,
        this.x = 3,
        this.y = 1,
        this.down = () => {
            this.y++;
            if(collide(board, this)) {
                this.y--;
                return false;
            }
            return true;
        },
        this.right = () => {
            this.x++;
            if(collide(board, this)) {
                this.x--;
                return false;
            }
            return true;
        },
        this.left = () => {
            this.x--;
            if(collide(board, this)) {
                this.x++;
                return false;
            }
            return true;
        },
        this.halfturn = () => {
            this.r = (this.r + 2) % 4;
            if(collide(board, this)) {
                this.r = (this.r + 2) % 4;
                return false;
            }
            return true;
        },
        this.cw = () => {
            this.r = (this.r + 1) % 4;
            if(collide(board, this)) {
                this.r = (this.r + 3) % 4;
                return false;
            }
            return true;
        },
        this.ccw = () => {
            this.r = (this.r + 3) % 4;
            if(collide(board, this)) {
                this.r = (this.r + 1) % 4;
                return false;
            }
            return true;
        },
        this.harddrop = () => {
            while(!collide(board, this)) this.y++;
            this.y--;
        },
        this.fix = () => {
            for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
                if(this.mino[this.r][i][j]) board[this.y+i][this.x+j]=true;
            }
        }
    }
}

function nextblock() {
    blockcount++;
    if (blockcount % 7 == 0) {
        bag = [...nextbag];
        shuffle(nextbag);
    }
    const block = new Block();
    if(collide(board, block)) gameover();
    else return block;
}

function gameover() {
    clearInterval(frameInterval);
}

function collide(board, block) {
    for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
        if(block.mino[block.r][i][j]) {
            if(block.x+j < 0 || 9 < block.x+j || block.y+i<-1 || block.y+i > 21) return true;
            if(board[block.y+i][block.x+j]) return true;
        }
    }
    return false;
}

let block = nextblock();

function drawBlock() {
    const canvas = document.getElementById("block");
    if(canvas==null) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
        if(block.mino[block.r][i][j]) ctx.fillRect(10+40*(block.x+j), 10+40*(block.y+i-2), 40, 40);
    }
}

function drawNext() {
    const canvas = document.getElementById("next");
    if(canvas==null) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=1; i<=5; i++) for(let j=0; j<4; j++) for(let k=0; k<4; k++){
        if(blockcount%7+i<7) {
            if(tetromino[bag[blockcount%7+i]][0][j][k]) {
                ctx.fillRect(10+30*k, 10+30*((i-1)*4+j), 30, 30);
            }
        }
        else {
            if(tetromino[nextbag[blockcount%7+i-7]][0][j][k]) {
                ctx.fillRect(10+30*k, 10+30*((i-1)*4+j), 30, 30);
            }
        }
    }
}

let gravity = 50;
let gravcount = 0;
let das = 10;
let rdascount = 0;
let ldascount = 0;
let wasPressed;

function isRowFilled(i) {
    for(let j=0; j<10; j++) {
        if(!board[i][j]) return false;
    }
    return true;
}

function breakLine(r) {
    for(let i=r; i>0; i--) {
        for(let j=0; j<10; j++) board[i][j]=board[i-1][j];
    }
    for(let j=0; j<10; j++) board[0][j]=false;
}

function checkFilled() {
    for(let i=21; i>=0; i--) {
        while(isRowFilled(i)) breakLine(i);
    }
}

function frame() {
    gravcount++;

    if(gravcount>=gravity) {
        gravcount=0;
        if(!block.down()) {
            block.fix();
            checkFilled();
            block=nextblock();
        }
    }

    if(isPressed["right"]) {
        if(rdascount==0 || rdascount>=das) block.right();
        rdascount++;
    }
    else rdascount=0;

    if(isPressed["left"]) {
        if(ldascount==0 || ldascount>=das) block.left();
        ldascount++;
    }
    else ldascount=0;

    if(isPressed["cw"] && !wasPressed["cw"]) {
        block.cw();
    }

    if(isPressed["ccw"] && !wasPressed["ccw"]) {
        block.ccw();
    }

    if(isPressed["half"] && !wasPressed["half"]) {
        block.halfturn();
    }

    if(isPressed["down"]) {
        if(!block.down()) gravcount++;
        else gravcount=0;
    }

    if(isPressed["hd"] && !wasPressed["hd"]) {
        block.harddrop();
        block.fix();
        checkFilled();
        block=nextblock();
        gravcount=0;
    }

    wasPressed = {...isPressed}
    setTimeout(drawBoard, 1000/60);
    setTimeout(drawBlock, 1000/60);
    setTimeout(drawNext, 1000/60);
}

frameInterval = setInterval(frame, 1000/60);