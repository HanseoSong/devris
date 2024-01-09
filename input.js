document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

const keyMap = {
    ccw: 90,
    cw: 88,
    half: 65,
    hold: 67,
    hd: 32,
    left: 37,
    right: 39,
    down: 40
}

const isPressed = {}
for(let key in keyMap) isPressed[key]=false;

function keyDownHandler(ev) {
    for(let key in keyMap) {
        if(ev.keyCode == keyMap[key]) {
            isPressed[key] = true;
        }
    }
}

function keyUpHandler(ev) {
    for(let key in keyMap) {
        if(ev.keyCode == keyMap[key]) {
            isPressed[key] = false;
        }
    }
}