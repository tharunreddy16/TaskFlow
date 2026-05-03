FROM node:20-slim

WORKDIR /app

# Copy root package.json which contains the scripts
COPY package.json ./

# Copy package.json files for both workspaces
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies for both frontend and backend
RUN npm run install:all

# Copy all source code
COPY . .

# Build the React frontend
RUN npm run build

# Start the backend server
CMD ["npm", "start"]
