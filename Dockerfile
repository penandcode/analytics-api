# Use official Node.js image as a base
FROM node:16-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app into the container
COPY . .

# Expose the app port (change 3000 to the port your app uses)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
