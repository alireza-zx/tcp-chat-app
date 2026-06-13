const net = require('node:net');
const readline = require('node:readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const HOST = '127.0.0.1';
const PORT = 4000;
let userId = null;

function clearLine(dir) {
  return new Promise(res => {
    process.stdout.clearLine(dir, res);
  });
}

function moveCursor(dx, dy) {
  return new Promise(res => {
    process.stdout.moveCursor(dx, dy, res);
  });
}

function color(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log('connected to the server!');
  
  async function askName() {
    const name = await rl.question('Enter your name: ');
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(Buffer.from(`%$%NAME-%$%|${name}`));
  }

  async function ask() {
    const message = await rl.question('Enter your message > ');
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(Buffer.from(message, 'utf-8'));
  }

  await askName();
  await ask();

  socket.on('data', async chunk => {
    const textData = chunk.toString('utf-8');

    if (textData.startsWith('%$%ID-%$%|')) {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      userId = textData.split('|')[1];
      console.log(`Your ID: ${userId}\n`);
      return ask();
    }

    if (textData.startsWith('%$%NEWUSER-%$%|')) {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      const [id, name] = textData.split('|')[1].split('--');
      console.log(color(`! New user (id: ${id}) ${name} joined the chatroom !`, 32));
      return ask();
    }

    if (textData.startsWith('%$%LEFTUSER-%$%|')) {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      const [id, name] = textData.split('|')[1].split('--');
      console.log(color(`! User (id: ${id}) ${name} left the chatroom !`, 31));
      return ask();
    }

    const [id, name, message] = textData.split('--');
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const fullTime = color(`<${day}/${month}/${year} ${hours}:${minutes}>`, 90);
    let fullMessage = ` (id: ${id}) ${name} : ${message}`;
    if (id === userId) fullMessage = color(fullMessage, 34);
    console.log(fullTime + fullMessage);
    return ask();
  });
});

socket.on('close', hadError => {
  if (hadError)
    return console.log('an Error occured!');
  console.log('connection closed!')
});

socket.on('error', err => {
  console.log('ERRROR!!! ', err);
});