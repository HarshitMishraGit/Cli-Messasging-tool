## Welcome to CLI Chat APP

This is a very simple application where we are going to see a little use of websockets.This can be deployed to a cloud server and can be also modified accroding 
to your needs.
    
dependencies-
    
    1. npm install net

## Connection 
To connect to a chatroom you have to enter the ip:port of that purticular chat room. For now it is only be operating on port 3000. But it can be modified to use
multiple chat room at a time.We are using **netcat** to connect to the server =>
    
    nc <ip_of_server> <port>

## Result of v1.0

Person 1 =>  John 

![ezgif-1-75fdb47b5d](https://github.com/HarshitMishraGit/Cli-Messasging-tool/assets/93585405/6b1056a1-243a-4941-b88c-3a82cb28cb90)


Person 2 => Harshit

![WhatsApp Image 2023-08-03 at 03 45 32](https://github.com/HarshitMishraGit/Cli-Messasging-tool/assets/93585405/2e03a6fa-98e1-4659-a618-05c0b0a28d4a)

# Send Image as stickers In Terminal
You can directly send the image in the terminal with `/sendImage path-of-image` command.
But First you need to upload the image that can be done with http://< serverUrl >:3001 and it will give you a link back .


send it within the chatRoom with command `/sendImage  Copied-Link-of-uploaded-Image'`

# Send The CDN URL of the file
The server at http://< serverUrl >:3001 gives you two type of links in after uploading the file. If the file is image you can either send it in chat(as Sticker) or You can send the original file url to anyone in the chatRoom. File can be Pdf,video,audio,image ...etc. 

