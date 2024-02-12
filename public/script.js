let x = 20;
let y = 20;
let dx = 8;
let dy = 8;
let score = 0;
let col = 'rgb(255,255,255)';
let players = {};

let food = { x: 100, y: 100 };

const socket = io.connect();

socket.on('allPlayers', (newPlayers) => {
    players = newPlayers;
});

socket.on('playerUpdate', (id, player) => {
    players[id] = player;
});

socket.on('updateFood', (newFood) => {
    food = newFood;
});

function setup() {
    createCanvas(1000, 600);

    col = `rgb(${floor(random(0, 255))},${floor(random(0, 255))},${floor(random(0, 255))})`;
    socket.emit('moved', { x, y, score, col });
}

function draw() {
    background('rgba(240,240,240,0.5)');

    strokeWeight(2);

    fill("yellow");
    rectMode(CENTER);
    rect(food.x, food.y, 10, 10);

    for (const playerID in players) {
        if (playerID === socket.id) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        fill(players[playerID].col);
        ellipse(players[playerID].x, players[playerID].y, 20, 20);
    }

    fill('#222');
    textAlign(CENTER);
    text("Scores", width - 50, 25);

    let i = 1;
    for (const playerID in players) {
        fill(players[playerID].col);
        textSize(20);
        text(players[playerID].score, width - 50, 25 + i * 25);
        i++;
    }

    handleFoodCollision();
    handleKeyInput();
    handleCanvasBoundaries();
}

function handleFoodCollision() {
    if (x > food.x - 10 && x < food.x + 10 && y > food.y - 10 && y < food.y + 10) {
        socket.emit('newFoodPos', { x: random(10, width - 10), y: random(10, height - 10) });
        score++;
        socket.emit('moved', { x, y, score, col });
    }
}

function handleKeyInput() {
    if (keyIsDown(LEFT_ARROW)) {
        x -= dx;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        x += dx;
    }
    if (keyIsDown(UP_ARROW)) {
        y -= dy;
    }
    if (keyIsDown(DOWN_ARROW)) {
        y += dy;
    }

    socket.emit('moved', { x, y, score, col });
}

function handleCanvasBoundaries() {
    if (x < 0) {
        x = width;
    }
    if (x > width) {
        x = 0;
    }
    if (y < 0) {
        y = height;
    }
    if (y > height) {
        y = 0;
    }
}
