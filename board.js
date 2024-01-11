function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}

const board = create2DArray(40, 10);

function drawBoard() {
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#ddd";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=20; i<40; i++) for(let j=0; j<10; j++) {
        ctx.strokeRect(10+30*j, 10+30*(i-20), 30, 30);
    }
    ctx.strokeStyle = "#888";
    for(let i=0; i<40; i++) for(let j=0; j<10; j++) {
        if(board[i][j]) {
            ctx.fillStyle = color[board[i][j]];
            ctx.fillRect(10+30*j, 10+30*(i-20), 30, 30);
            ctx.strokeRect(10+30*j, 10+30*(i-20), 30, 30);
        }
    }
}