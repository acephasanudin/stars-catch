const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const players = {};
let food = { x: 100, y: 100 };

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', (socket) => {
    players[socket.id] = { x: 20, y: 20, score: 0, col: 'rgb(255,255,255)' };

    io.emit('allPlayers', players);
    io.emit('updateFood', food);

    socket.on('moved', (player) => {
        players[socket.id] = { ...player, col: player.col };

        io.emit('playerUpdate', socket.id, players[socket.id]);
    });

    socket.on('newFoodPos', (pos) => {
        food = { x: pos.x, y: pos.y };

        io.emit('updateFood', food);
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('allPlayers', players);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
