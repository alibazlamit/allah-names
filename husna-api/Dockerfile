FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the API port
EXPOSE 3005

# Start the server
CMD ["node", "server.js"]
