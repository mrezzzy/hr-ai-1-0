FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Create necessary directories
RUN mkdir -p src/config src/middleware src/routes src/services logs

COPY . .

EXPOSE 3000

CMD ["npm", "start"]