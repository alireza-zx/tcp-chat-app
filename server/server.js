const net = require("node:net");

const server = net.createServer();
const Creator = 'Alireza Hakimi (https://github.com/alireza-zx)';
const clients = [];
let idCounter = 1;

function getTime() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return color(`<${day}/${month}/${year} ${hours}:${minutes}>`, 90);
}

function color(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

// Note: Every client endpoint is a socket
// For each client we have one socket that corresponds that particular client
// For example if we have 100 clients connected to server, we would have 100 socket objects!
server.on('connection', socket => {
  socket.id = idCounter;
  ++idCounter;
  socket.write(Buffer.from(`%$%ID-%$%|${socket.id}`, 'utf-8'));
  console.log(`${getTime()} ${color(`A new client has connected to the server!, id= ${socket.id}`, 32)}`);

  socket.on('data', chunk => {
    const data = chunk.toString('utf-8');

    if (data.startsWith('%$%NAME-%$%|')) {
      const name = data.split('|')[1];
      socket.name = name;
      clients.forEach(s => s.write(Buffer.from(`%$%NEWUSER-%$%|${socket.id}--${socket.name}`)));
      clients.push(socket);
      return;
    }

    clients.forEach(s => s.write(Buffer.from(`${socket.id}--${socket.name}--${chunk.toString('utf-8')}`, 'utf-8')));
  });

  socket.on('close', () => {
    const idx = clients.findIndex(s => s.id === socket.id);
    clients.splice(idx, 1);
    clients.forEach(s => s.write(Buffer.from(`%$%LEFTUSER-%$%|${socket.id}--${socket.name}`, 'utf-8')));
    console.log(`${getTime()} ${color(`Client has disconnected!, id= ${socket.id}`, 31)}`);
  });

  socket.on('error', err => {
    console.log(`${getTime()} ${color(`Connection interrupted with client!, id= ${socket.id}`, 31)}`);
  });
});

// START THE SERVER
const PORT = 4000;
const HOST = '127.0.0.1';
server.listen(PORT, HOST, () => {
  console.log(`${getTime()} Chat-App TCP Server running at `, server.address());
  console.log(color(`Created by ${Creator}`, 90));
});