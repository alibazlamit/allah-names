FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install build dependencies for sqlite3, build npm packages, then clean up
RUN apk add --no-cache python3 make g++ && \
    npm install && \
    apk del python3 make g++

# Copy application files and change ownership to 'node' user
COPY --chown=node:node . .

# Set up the data directory with correct permissions in case it doesn't exist yet
RUN mkdir -p data && chown -R node:node data

# Switch to the non-root 'node' user
USER node

# Expose the API port
EXPOSE 3005

# Start the server
CMD ["node", "server.js"]
