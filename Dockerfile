FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Create projects directory
RUN mkdir -p /app/projects

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "src/server.js"]
