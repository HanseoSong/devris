const keyDraw = {
    ccw: [1, 2],
    cw: [3, 2],
    half: [0, 0],
    hold: [5, 2],
    hd: [4, 4],
    left: [8, 4],
    right: [12, 4],
    down: [10, 4]
}

function drawKeyview() {
    const canvas = document.getElementById("keyview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(let key in keyDraw) {
        ctx.strokeRect(10+30*keyDraw[key][0], 10+30*keyDraw[key][1], 50, 50);
        if(isPressed[key]) {
            ctx.fillRect(10+30*keyDraw[key][0], 10+30*keyDraw[key][1], 50, 50);
        }
    }
}

setInterval(drawKeyview, 10);
