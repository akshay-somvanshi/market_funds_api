# Dockerfile
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

RUN npm install

# Copy from current location files to app folder
COPY . .

# Start the application
CMD ["npm", "start"]