# Use node:18 as runtime image
FROM node:18-alpine

# set the working directory in the container
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the port the application will be running on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD [ "node", "-r", "dotenv/config", "server.js" ]
