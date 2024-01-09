function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const bag=Object.keys(tetrimino);
let blockcount=0;

class Block {
    constructor() {
        this.mino = tetrimino[bag[blockcount % 7]],
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
    if (blockcount % 7 == 0) shuffle(bag);
    blockcount++;
    const block = new Block();
    if(collide(board, block)) gameover();
    else return block;
}

function gameover() {

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
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
        if(block.mino[block.r][j][i]) ctx.fillRect(10+40*(block.x+i), 10+40*(block.y+j-2), 40, 40);
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

    if(isPressed["down"]) {
        gravcount=0;
        block.down();
    }

    if(isPressed["hd"] && !wasPressed["hd"]) {
        block.harddrop();
        block.fix();
        checkFilled();
        block=nextblock();
    }

    wasPressed = {...isPressed}
    setTimeout(drawBlock, 1000/60);
}

setInterval(frame, 1000/60);