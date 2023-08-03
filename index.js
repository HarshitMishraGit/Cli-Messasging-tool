import net from 'net';

const clients = {};

function broadcast(message, senderAddress) {
  for (const address in clients) {
    if (address !== senderAddress) {
      clients[address].write(message);
    }
  }
}

const server = net.createServer(clientSocket => {
  let name;

  clientSocket.write('Enter your name: ');

  clientSocket.on('data', data => {
    if (!name) {
      name = data.toString().trim();
      clients[clientSocket.remoteAddress] = clientSocket;
      clientSocket.write(`${name}, Welcome to the server! \n`);
    //   broadcast(`${name} has joined the chat!\n`, clientSocket.remoteAddress);
        for (const address in clients) {
            if (address !== clientSocket.remoteAddress) {
              clients[address].write(`${name} has joined the chat!\n`);
            }
        }
    } else {
      const message = `${name}: ${data}`;
      broadcast(message, clientSocket.remoteAddress);
    }
    
  });

  clientSocket.on('end', () => {
    if (name) {
      delete clients[clientSocket.remoteAddress];
      broadcast(`${name} has left the chat.\n`, clientSocket.remoteAddress);
    }
  });

  clientSocket.on('error', err => {
    console.error(`Client error: ${err}`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
