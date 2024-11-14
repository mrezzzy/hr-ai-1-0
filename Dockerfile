FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create necessary directories
RUN mkdir -p src/config src/middleware src/routes src/services src/public logs

# Copy source code
COPY . .

# Set proper permissions
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "start"]