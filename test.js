import net from "net";

const ports = new Set();
const ChatRooms = {};
// const ChatRooms={3001:{admin:{},members:{},blockedMembers:{},guidlines:'string'}}

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
      AskthePortNumberToCreateServer(clientSocket, name);
     } else if (ChatRooms[portNumber]) {
       clientSocket.write(`A chat room already exists on port ${portNumber}.\nPlease select any other port number :`);
       AskthePortNumberToCreateServer(clientSocket, name);
     } else {
      // Create the chat room and set the admin
      ChatRooms[portNumber] = {
        admin: clientSocket,
        members: {},
        blockedMembers: {},
        guidelines: ''
      };
      clientSocket.write(`Chat room created on port ${portNumber}. ${name}, You are the admin.\n`);
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
       AskthePortNumberToJoinServer(clientSocket, name);
     } else if (ChatRooms[portNumber]) {
       clientSocket.write(`A chat room already exists on port ${portNumber}.\nPlease select any other port number.\n`);
       AskthePortNumberToJoinServer(clientSocket, name);
     } else {
    //  join the member to the chat room
       ChatRooms[portNumber].members[clientSocket.remoteAddress] = clientSocket;
       clientSocket.write(`${name}, You have successfully joined the chatRoom on port ${portNumber}.\n`);
    }
   });
}
const server = net.createServer((clientSocket) => {
  let name;
  let selectedPort;
  let choiceSelected=false;
  clientSocket.write("Enter your name: ");

  clientSocket.on("data", (data) => {

    if (!name) {
      name = data.toString().trim();
      clientSocket.write(`${name}, Welcome to the server! \n`);
      clientSocket.write("1. Create a chat room\n2. Join a chat room\n");
    } else if (name && !selectedPort) {
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
    } else {
      // const message = `${name}: ${data}`;
      // broadcast(message, clientSocket.remoteAddress);
      }
  
  });

  clientSocket.on("end", () => {
    if (name) {
      delete clients[clientSocket.remoteAddress];
      broadcast(`${name} has left the chat.\n`, clientSocket.remoteAddress);
    }
  });

  clientSocket.on("error", (err) => {
    console.error(`Client error: ${err}`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
