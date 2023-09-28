# Use the official Node.js image for Node.js 18.x
FROM node:lts-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY . /usr/src/app

# Install application dependencies
RUN npm install
RUN npm install -g pm2

# Expose multiple ports
EXPOSE 3000-3001
EXPOSE 4000-4050

# Define the command to start your Node.js application
CMD [ "npm", "start" ]
