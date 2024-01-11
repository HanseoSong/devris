function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class Block {
    constructor(mino) {
        this.mino = mino;
        this.r = 0;
        this.x = 3;
        this.y = 19;

        this.harddrop = () => {
            while(!collide(board, this)) this.y++;
            this.y--;
        };
        this.fix = () => {
            for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
                if(tetromino[this.mino][this.r][i][j]) board[this.y+i][this.x+j]=true;
            }
            block = nextblock();
            wasHolded=false;
        };
    }
}

let bag=Object.keys(tetromino);
let nextbag=Object.keys(tetromino);
shuffle(nextbag);
let blockcount=-1;

function kick(block, direction) {
    let kicktable;
    const r = (direction=="cw"?(block.r+3)%4:(block.r));

    if(block.mino == 'O') {
        return true;
    }
    else if(block.mino == 'I') {
        kicktable = kickI[r];
    }
    else kicktable = kickSZLJT[r];

    for(let i=0; i<5; i++) {
        block.x+=kicktable[i]["dx"]*(direction=="cw"?1:-1);
        block.y-=kicktable[i]["dy"]*(direction=="cw"?1:-1);
        if(!collide(board, block)) return true;
        block.x-=kicktable[i]["dx"]*(direction=="cw"?1:-1);
        block.y+=kicktable[i]["dy"]*(direction=="cw"?1:-1);
    }
    return false;
}

function nextblock() {
    blockcount++;
    if (blockcount % 7 == 0) {
        bag = [...nextbag];
        shuffle(nextbag);
    }
    const block = new Block(bag[blockcount % 7]);
    if(collide(board, block)) gameover();
    else return block;
}

let isgameover=false;
function gameover() {
    isgameover=true;
    clearInterval(frameInterval);
}

function collide(board, block) {
    for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
        if(tetromino[block.mino][block.r][i][j]) {
            if(block.x+j < 0 || 10 <= block.x+j || block.y+i<-1 || block.y+i >= 40) return true;
            if(board[block.y+i][block.x+j]) return true;
        }
    }
    return false;
}

let block = nextblock();
let hold = null;

function drawHold() {
    const canvas = document.getElementById("hold");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(hold==null) return;
    else {
        for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
            if(tetromino[hold][0][i][j]) {
                ctx.fillRect(10+20*j, 10+20*i, 20, 20);
            }
        }
    }
}

function drawBlock() {
    const canvas = document.getElementById("block");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
        if(tetromino[block.mino][block.r][i][j]) ctx.fillRect(10+30*(block.x+j), 10+30*(block.y+i-20), 30, 30);
    }
}

function drawNext() {
    const canvas = document.getElementById("next");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=1; i<=5; i++) for(let j=0; j<4; j++) for(let k=0; k<4; k++){
        if(blockcount%7+i<7) {
            if(tetromino[bag[blockcount%7+i]][0][j][k]) {
                ctx.fillRect(10+20*k, 10+20*((i-1)*4+j), 20, 20);
            }
        }
        else {
            if(tetromino[nextbag[blockcount%7+i-7]][0][j][k]) {
                ctx.fillRect(10+20*k, 10+20*((i-1)*4+j), 20, 20);
            }
        }
    }
}

let gravity = 50;
let gravcount = 0;
let das = 10;
let rdascount = 0;
let ldascount = 0;
let wasPressed = isPressed;
let wasHolded = false;

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
    for(let i=39; i>=0; i--) {
        while(isRowFilled(i)) breakLine(i);
    }
}

function frame() {
    if(isPressed["hold"] && !wasPressed["hold"] && !wasHolded) {
        const tmp = hold;
        hold = block.mino;
        if(tmp==null) block=nextblock();
        else block = new Block(tmp);
        wasHolded=true;
        gravcount=0;
    }

    gravcount++;

    if(gravcount>=gravity) {
        gravcount=0;
        const moved = {...block};
        moved.y++;
        if(!collide(board, moved)) block.y++;
        else {
            block.fix();
            checkFilled();
        }
    }

    if(isPressed["right"]) {
        if(rdascount==0 || rdascount>=das) {
            const moved = {...block};
            moved.x++;
            if(!collide(board, moved)) block.x++;
        }
        rdascount++;
    }
    else rdascount=0;

    if(isPressed["left"]) {
        if(ldascount==0 || ldascount>=das) {
            const moved = {...block};
            moved.x--;
            if(!collide(board, moved)) block.x--;
        }
        ldascount++;
    }
    else ldascount=0;

    if(isPressed["cw"] && !wasPressed["cw"]) {
        const moved = {...block};
        moved.r = (moved.r + 1) % 4;
        if(kick(moved, "cw")) {
            block.r = (block.r + 1) % 4;
            kick(block, "cw");
        }
    }

    if(isPressed["ccw"] && !wasPressed["ccw"]) {
        const moved = {...block};
        moved.r = (moved.r + 3) % 4;
        if(kick(moved, "ccw")) {
            block.r = (block.r + 3) % 4;
            kick(block, "ccw");
        }
    }

    if(isPressed["half"] && !wasPressed["half"]) {
        const moved = {...block};
        moved.r = (moved.r + 2) % 4;
        if(!collide(board, moved)) block.r = (block.r + 2) % 4;
    }

    if(isPressed["down"]) {
        const moved = {...block};
        moved.y++;
        if(!collide(board, moved)) {
            block.y++;
            gravcount = 0;
        }
    }

    if(isPressed["hd"] && !wasPressed["hd"]) {
        block.harddrop();
        gravcount=0;
        block.fix();
        checkFilled();
    }

    wasPressed = {...isPressed}
}

window.onload = () => {
    frameInterval = setInterval(() => {
        frame();
        setTimeout(() => {
            if(isgameover) return;
            drawHold();
            drawBoard();
            drawBlock();
            drawNext();
        }, 1000/60);
    }, 1000/60);
}
