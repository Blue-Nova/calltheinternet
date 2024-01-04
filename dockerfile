# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
#install nodemon
RUN npm install -g nodemon
# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Node.js app
CMD [ "node", "server.js" ]