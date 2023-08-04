import net from "net";

const ports = new Set();
const ChatRooms = {};
// const ChatRooms={3001:{admin:{},members:{},blockedMembers:{},guidlines:'string'}}

function broadcast(message, senderAddress,members) {
  for (const address in members) {
    if (address !== senderAddress) {
      clients[address].write(message);
    }
  }
}
const joinServer = (name, port) => {
  const server = net.createServer((clientSocket) => {
    let name;
    let room;
    if (ChatRooms[port].admin) {
      // add the member
      ChatRooms[port].members[clientSocket.remoteAddress] = clientSocket;
    } else {
      ChatRooms[port].admin[clientSocket.remoteAddress] = clientSocket;
    }
    clientSocket.write("Enter your name: ");

    clientSocket.on("data", (data) => {
      if (!name) {
        name = data.toString().trim();
        clients[clientSocket.remoteAddress] = clientSocket;
        clientSocket.write(`${name}, Welcome to the server! \n`);
        clientSocket.write("1. Create a chat room\n2. Join a chat room\n");
      } else {
        const input = data.toString().trim();

        if (!room) {
          if (input === "1") {
            clientSocket.write(
              "Enter a port number between 4000 and 5000 for your chat room: "
            );
            if (Number(input) < 5000 && Number(input) > 4000) {
              room;
            }
          } else if (input === "2") {
            clientSocket.write(
              "Enter the port number of the chat room you want to join: "
            );
          } else {
            clientSocket.write("Invalid option. Please select 1 or 2.\n");
          }
        } else {
          const message = `${name}: ${input}`;
          broadcast(message, clientSocket.remoteAddress, room);
        }
      }
    });

    clientSocket.on("end", () => {
      if (name) {
        if (room) {
          delete room.clients[clientSocket.remoteAddress];
          broadcast(
            `${name} has left the chat room.\n`,
            clientSocket.remoteAddress,
            room
          );
          if (Object.keys(room.clients).length === 0) {
            delete chatRooms[room.port];
          }
        } else {
          delete clients[clientSocket.remoteAddress];
        }
      }
    });

    clientSocket.on("error", (err) => {
      console.error(`Client error: ${err}`);
    });
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};
const NotifyOfJoiningNewMember = (clientSocket) => { }

const AskthePortNumberToCreateServer = (clientSocket, name) => { 
  // Listen for user input
   clientSocket.once('data', userInput => {
     const portInput = userInput.toString().trim();
     const portNumber = parseInt(portInput);

     if (isNaN(portNumber) || portNumber < 4000 || portNumber > 5000) {
       clientSocket.write("Invalid port number. Please enter a valid port between 4000 and 5000.\n");
      //  recursive call to ask the port number again
      return AskthePortNumberToCreateServer(clientSocket, name);
     } else if (ChatRooms[portNumber]) {
       clientSocket.write(`A chat room already exists on port ${portNumber}.\nPlease select any other port number :`);
       return AskthePortNumberToCreateServer(clientSocket, name);
     } else {
      // Create the chat room and set the admin
      ChatRooms[portNumber] = {
        admin: clientSocket,
        members: {},
        blockedMembers: {},
        guidelines: ''
      };
       clientSocket.write(`Chat room created on port ${portNumber}. ${name}, You are the admin.\n`);
       createServer(portNumber, clientSocket);
       clientSocket.write("Now enter your chat room with the port, Byee ;)\n")
       clientSocket.end();
      // Rest of your code
    }
   });
}
const AskthePortNumberToJoinServer = (clientSocket, name) => { 
  // Listen for user input
   clientSocket.once('data', userInput => {
     const portInput = userInput.toString().trim();
     const portNumber = parseInt(portInput);

     if (isNaN(portNumber) || portNumber < 4000 || portNumber > 5000) {
       clientSocket.write("Invalid port number. Please enter a valid port between 4000 and 5000.\n");
       return AskthePortNumberToJoinServer(clientSocket, name);
     } else if (!ChatRooms[portNumber]) {
       clientSocket.write(`No chat room exists on port ${portNumber}.\nPlease select any other port number.\n`);
       return AskthePortNumberToJoinServer(clientSocket, name);
     } else {
    //  join the member to the chat room
       clientSocket.name = name;
       ChatRooms[portNumber].members[clientSocket.remoteAddress] = clientSocket;
       clientSocket.end();
       clientSocket.write(`${name}, You have successfully joined the chatRoom on port ${portNumber}.\n`);
      //  createServer(name, portNumber, clientSocket);

    }
   });
}

// const createServer = (port, clientSocket) => {
//   const server = net.createServer(socket => {
//     const room = ChatRooms[port];
//     // check if the user is already a member of the chat room
//     // if (!room.members[socket.remoteAddress]) {
//     //   // ask for the name 
//     //   socket.write("Enter your name: ");
//     //   // add the member
//     //   socket.once('data', data => {
//     //     const name = data.toString().trim();
//     //     socket.write(`${name}, Welcome to the chat room on port ${port}.\n}`);
//     //     socket.name= name;
//     //   });
//     //   room.members[socket.remoteAddress] = socket;
//     // }
//     //  else {
//     //   socket.on('data', data => {
//     //     if (data.toString().trim() === 'exit') {
//     //       socket.end();
//     //     }
//     //     else if (data.toString().trim() === 'list') {
//     //       socket.write(`Members of the chat room on port ${port}:\n`);
//     //       for (const address in ChatRooms[port].members) {
//     //         socket.write(`${ChatRooms[port].members[address].name}\n`);
//     //       }
//     //     } else if (data.toString().trim() === 'block' && ChatRooms[port].admin === socket) {
//     //       socket.write("Enter the name of the member you want to block: ");
//     //       socket.once('data', data => {
//     //         const name = data.toString().trim();
//     //         const member = ChatRooms[port].members[name];
//     //         if (member) {
//     //           ChatRooms[port].blockedMembers[member.remoteAddress] = member;
//     //           delete ChatRooms[port].members[member.remoteAddress];
//     //           socket.write(`${name} has been blocked.\n`);
//     //         } else {
//     //           socket.write(`${name} is not a member of the chat room.\n`);
//     //         }
//     //       });
//     //     } else if (data.toString().trim() === 'unblock' && ChatRooms[port].admin === socket) {
//     //       socket.write("Enter the name of the member you want to unblock: ");
//     //       socket.once('data', data => {
//     //         const name = data.toString().trim();
//     //         const member = ChatRooms[port].blockedMembers[name];
//     //         if (member) {
//     //           ChatRooms[port].members[member.remoteAddress] = member;
//     //           delete ChatRooms[port].blockedMembers[member.remoteAddress];
//     //           socket.write(`${name} has been unblocked.\n`);
//     //         } else {
//     //           socket.write(`${name} is not a blocked member of the chat room.\n`);
//     //         }
//     //       });
//     //     } else if (data.toString().trim() === '/guidelines' && ChatRooms[port].admin === socket) {
//     //       socket.write("Enter the guidelines for the chat room: ");
//     //       socket.once('data', data => {
//     //         ChatRooms[port].guidelines = data.toString().trim();
//     //         socket.write(`Guidelines for the chat room on port ${port}:\n${ChatRooms[port].guidelines}\n`);
//     //       });
//     //     } else if (data.toString().trim() === '/guidelines') {
//     //       socket.write(`Guidelines for the chat room on port ${port}:\n${ChatRooms[port].guidelines}\n`);
//     //     } else if (socket.name) {
//     //       const message = `${socket.name}: ${data}`;
//     //       broadcast(message, socket.remoteAddress, ChatRooms[port].members);
//     //     }
//     //     // end the chat room
//     //     else if (data.toString().trim() === 'end' && ChatRooms[port].admin === socket) {
//     //       socket.write("Are you sure you want to end the chat room? (y/n): ");
//     //       socket.once('data', data => {
//     //         if (data.toString().trim() === 'y') {
//     //           socket.write(`Chat room on port ${port} has been ended.\n`);
//     //           for (const address in ChatRooms[port].members) {
//     //             ChatRooms[port].members[address].write(`Chat room on port ${port} has been ended.\n`);
//     //             ChatRooms[port].members[address].end();
//     //           }
//     //           delete ChatRooms[port];
//     //         } else {
//     //           socket.write(`Chat room on port ${port} has not been ended.\n`);
//     //         }
//     //       });
//     //     }
  
        
      
//     //   });
//     // }

  

//     socket.on('end', () => {
//       delete room.members[socket.remoteAddress];
//     });

//     socket.on('error', err => {
//       console.error(`Client error: ${err}`);
//     });
//   });

//   server.listen(port, () => {
//     console.log(`Chat room on port ${port} is now active.`);
//   });
// };
const createServer = (port, clientSocket) => {
  const server = net.createServer((socket) => {
    const room = ChatRooms[port];
    room.members[socket.remoteAddress] = socket;
    socket.write(`Welcome to the server at port ${port}`);
    // if (room.admin === socket) {
    //   socket.write(`Admin, Welcome to the chat room on port ${port}.\n`);
    // }
    socket.on('data', data => {
      const message = `${name}: ${data}`;
      broadcast(message, socket.remoteAddress, room.members);
    });

    socket.on('end', () => {
      delete room.members[socket.remoteAddress];
    });

    socket.on('error', err => {
      console.error(`Client error: ${err}`);
    });
  });

  server.listen(port, () => {
    console.log(`Chat room on port ${port} is now active.`);
  });
};

const server = net.createServer((clientSocket) => {
let name;
let selectedPort;
let choiceSelected=false;
  clientSocket.write("Enter your name: ");

  clientSocket.on("data", (data) => {

    if (!name && data.toString().trim()!="/active") {
      name = data.toString().trim();
      clientSocket.name = name;
      clientSocket.write(`${name}, Welcome to the server! \n`);
      console.log(`${name} joined the server.`);
      clientSocket.write("1. Create a chat room\n2. Join a chat room\n");
    } else if (name && !selectedPort) {
      console.log(`${name} has not yet selected the port.`);
      const input = data.toString().trim();
      if (input === "1") {
        clientSocket.write("Enter a port number between 4000 and 5000 to create your chat room: ");
        AskthePortNumberToCreateServer(clientSocket, name);
        choiceSelected=true;
      } else if (input === "2") {
      clientSocket.write("Enter a port number between 4000 and 5000 to create your chat room: ");
        AskthePortNumberToJoinServer(clientSocket, name);
        choiceSelected=true;
      } else if(!choiceSelected) {
        clientSocket.write("Invalid option. Please select 1 or 2.\n");
      }
    } else if (data.toString().trim() === "/active") { 
      for(const port in ChatRooms) {
        clientSocket.write(`Chat room on port ${port} is active.\n`);
      }
    }
    else {
      const message = `${name}: ${data}`;
      broadcast(message, clientSocket.remoteAddress,ChatRooms[selectedPort].members);
      }
  
  });

  // clientSocket.on("end", () => {

    // if (name) {
    //   delete clients[clientSocket.remoteAddress];
    //   broadcast(`${name} has left the chat.\n`, clientSocket.remoteAddress);
    // }
  // });

  clientSocket.on("error", (err) => {
    console.error(`Client error: ${err}`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
