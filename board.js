function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}

const board = create2DArray(22, 10);

function drawBoard() {
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#ddd";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=2; i<22; i++) for(let j=0; j<10; j++) {
        ctx.strokeRect(10+40*j, 10+40*(i-2), 40, 40);
    }
    for(let i=0; i<22; i++) for(let j=0; j<10; j++) {
        if(board[i][j]) ctx.fillRect(10+40*j, 10+40*(i-2), 40, 40);
    }
}