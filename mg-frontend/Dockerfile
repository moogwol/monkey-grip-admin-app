# Use Node.js base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --include=dev

# Copy source code
COPY . .

# Expose dev server port
EXPOSE 5173

# Enable polling for file changes (useful in Docker)
ENV CHOKIDAR_USEPOLLING=true

# Start the dev server
CMD ["npm", "run", "dev"]
CMD ["npm", "run", "dev"]
