# Use an official Node.js runtime as the base image
#FROM 192.168.100.40:8082/node:18
FROM harbor.pnr.ir/global/node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
#RUN npm install
#RUN npm install --legacy-peer-deps
RUN npm install --force

#RUN npm audit fix --force
# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 (the default port for React applications)
EXPOSE 8000
RUN  npm run build
# Start the React application
#CMD ["npm", "start"]
CMD ["npm", "run", "preview"]

