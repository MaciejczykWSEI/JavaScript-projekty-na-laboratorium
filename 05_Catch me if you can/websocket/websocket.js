const ws = require('ws').Server;

const server = new ws({
    port: 9000
});

server.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        server.clients.forEach(function each(client) {
            client.send(data);
        });
    });
});