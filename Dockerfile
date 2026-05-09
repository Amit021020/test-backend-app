# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose app port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]