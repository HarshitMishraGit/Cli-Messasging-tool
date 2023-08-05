
import net from "net";
import art from "ascii-art";
import AsciiTable from 'ascii-table';
import Image from 'ascii-art-image';
import fs from 'fs';
const ChatRooms = {};
// const ChatRooms={3001:{admin:{},members:{},blockedMembers:{},guidlines:'string'}}

function broadcast(message, senderAddress,members) {
  for (const address in members) {
    if (address !== senderAddress) {
      members[address].write(message);
    }
  }
}

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
        admin: {address:clientSocket.address().address,name:name},
        members: {},
        blockedMembers: {},
        guidelines: ''
       };
      //  console.log("Admin is created =>", clientSocket.address().address);
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

const sendImage = (clientSocket, port,path) => { 
  // check for the extension of the image
  const ext = path.split('.')[1].trim();
  // const ImageSize=fs.statSync(path).size;
  if (ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
    var image = new Image({
      filepath: path,
      alphabet:'variant4'
  });
  
  image.write(function(err, rendered){
    if (err) {
          clientSocket.write("Something went wrong");
        } else {
          // send to all the members
          broadcast(rendered, clientSocket.remoteAddress, ChatRooms[port].members);
          clientSocket.write(rendered);
          // console.log(rendered)
        }
  })
  } else {
    clientSocket.write("Invalid file type. Please send a valid image file.\n");
  }

}

const createServer = (port, clientSocket) => {
  const server = net.createServer((socket) => {
    const room = ChatRooms[port];
    

    socket.write(`===================Welcome to the server at port ${port}================================\n\n\n`);
    socket.on('data', data => {
      if (socket.name && !data.toString().trim().startsWith('/') && !data.toString().trim().startsWith('\\')) {
        
    
        if (socket.address().address != ChatRooms[port].admin.address) {
          // a member
          const message = `${socket.name}: ${data}`;
          broadcast(message, socket.remoteAddress, ChatRooms[port].members);
          
        } else if (socket.address().address == ChatRooms[port].admin.address) {
          // admin
          const message = `${art.style('[ADMIN] ' + socket.name, 'green', true)}: ${data}`;
          broadcast(message, socket.remoteAddress, ChatRooms[port].members);
        }

      }
     
      else if (socket.name && data.toString().trim().startsWith('/')) {
        // write all the commands here

        if (data.toString().trim() === '/exit') {
          socket.write(`You have left the chat`);
          socket.end();
        } else if (data.toString().trim() === '/list') {
          var table = new AsciiTable('Group Info.');
          table.setHeading('S.No', 'Name', 'Address', 'designation');
          let i = 1;
          table.addRow(i++, ChatRooms[port].admin.name, '-Admin-')
          for (const address in ChatRooms[port].members) {
            if (address != ChatRooms[port].admin.address) {
              
              table.addRow(i++, ChatRooms[port].members[address].name, address);
            }
          }
          socket.write(table.toString() + "\n");
        
        } else if (data.toString().trim().startsWith('/sendImage')) { 
          try {
            let path = data.toString().trim().split('"')[1].trim();
            if (path) {
              console.log("path is =>", path);
              sendImage(socket, port, path);
            }
          } catch (error) {
            socket.write("Something went wrong\n");   
          }
         
          
        }

        // =============================== Admin Previllages =================================
        if (socket.address().address == ChatRooms[port].admin.address && data.toString().trim().startsWith('/')) {
          
          // 1. Kick a user
          if (data.toString().trim().startsWith('/kick')) {
            let user = data.toString().trim().split(' ')[1].trim();
            let members = ChatRooms[port].members;
            if (user) {
              for (const address in members) {
                if (members[address].name == user) {
                  members[address].write(`You have been kicked from the chat room on port ${port}.\n`);
                  members[address].end();
                  delete members[address];
                  socket.write(`${user} has been kicked from the chat room on port ${port}.\n`);
                  break;
                }
              }
            }
          }
          // 2. Block a user
          else if (data.toString().trim().startsWith('/block')) {
            let user = data.toString().trim().split(' ')[1].trim();
            let members = ChatRooms[port].members;
            if (user) {
              for (const address in members) {
                if (members[address].name == user) {
                  ChatRooms[port].blockedMembers[address] = { address: address, name: members[address].name };
                  members[address].write(`You have been kicked from the chat room on port ${port}.\n`);
                  members[address].end();
                  delete members[address];
                  socket.write(`${user} has been blocked from the chat room on port ${port}.\n`);
                  break;
                }
              }
            }
          }
          // 3. List blocked users
          else if (data.toString().trim().startsWith('/list-blocked')) {
            var table = new AsciiTable('Blocked Users');
            table.setHeading('S.No', 'Name', 'Address');
            let i = 1;
            for (const address in ChatRooms[port].blockedMembers) {
              table.addRow(i++, ChatRooms[port].blockedMembers[address].name, ChatRooms[port].blockedMembers[address].address);
            }
            socket.write(table.toString() + "\n");
          }
          // 4. Unblock a user
          else if (data.toString().trim().startsWith('/unblock')) {
            let user = data.toString().trim().split(' ')[1].trim();
            let members = ChatRooms[port].blockedMembers;
            if (user) {
              for (const address in members) {
                if (members[address].name == user) {
                  // delete from the blocked members
                  delete ChatRooms[port].blockedMembers[address];
                  socket.write(`${user} has been unblocked from the chat room on port ${port}.\n`);
                  break;
                }
              }
            }
          }
          // 5. Stop the server 
          else if (data.toString().trim().startsWith('/stop')) {
          //  ask for the confirmation
            socket.write("Are you sure you want to stop the server? (y/n)\n");
            socket.once('data', data => {
              if (data.toString().trim() == 'y') {
                socket.write("Server is stopping...\n");
                broadcast("Server is Closed by Admin..\n", socket.remoteAddress, ChatRooms[port].members);
                for (const address in ChatRooms[port].members) {
                  ChatRooms[port].members[address].end();
                }
                // delete ChatRooms[port];
                server.close();
              } else {
                socket.write("Server is not stopped\n");
              }
            });
          }
        }
      }
    });
    // check the address if admin or not
    if (ChatRooms[port].admin.address == socket.address().address) {
      socket.write(`Hello ${ChatRooms[port].admin.name}, You are the admin of the chat room on port ${port}.\n`);
      socket.name = ChatRooms[port].admin.name;
      ChatRooms[port].members[socket.remoteAddress] = socket;
      // add it to the member 
    }
    // check if the address is blocked or not
    else if (ChatRooms[port].blockedMembers[socket.remoteAddress]) {
      socket.write(`You are blocked from the chat room on port ${port}.\n`);
      socket.end();
    }
    // check if the address is a member or not
    else if (ChatRooms[port].members[socket.remoteAddress]) {
      socket.write(`Hello ${socket.name}, You are a member of the chat room on port ${port}.\n`);
      ChatRooms[port].members[socket.remoteAddress] = socket;
    }
    // check if the address is a guest or not
    else {
      socket.write(`Hello guest, You are a guest of the chat room on port ${port}.\n`);
      socket.write("Enter your name: ");
      socket.once('data', data => {
        const name = data.toString().trim();
        socket.name = name;
        socket.write(`${name}, Welcome to the server! \n`);
        socket.write(`Guidelines for the chat room on port ${port}:\n${ChatRooms[port].guidelines}\n`);
        ChatRooms[port].members[socket.remoteAddress] = socket;

        // console.log("New member joined =>", socket._peername.address);
        // console.log("New member joined =>", socket.address().address);
      });
    }
    

    socket.on('end', () => {
      delete ChatRooms[port].members[socket.remoteAddress];
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
let choiceSelected = false;
  clientSocket.write("Enter your name: ");
  // console.log("Someone is ping the server =>", clientSocket.address().address);
  clientSocket.on("data", (data) => {

    if (!name && !data.toString().trim().startsWith('/')) {
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
      let table = new AsciiTable('Chat Rooms');
      table.setHeading('Port', 'Admin', 'Members');
      for (const port in ChatRooms) {
        table.addRow(port, ChatRooms[port].admin.name, Object.keys(ChatRooms[port].members).length);
      }
      clientSocket.write(table.toString() + "\n");
    }
    else if (data.toString().trim() === "/admins") { 
      let table = new AsciiTable('Chat Room Admins');
      table.setHeading('Port', 'Admin', 'Address');
      for (const port in ChatRooms) {
        // table.addRow(port, ChatRooms[port].admin.name,JSON.stringify( ChatRooms[port].admin));
      console.log("adminName=> ",ChatRooms[port].admin.name," Address=> ",ChatRooms[port].admin);
      }
      clientSocket.write(table.toString() + "\n");
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
