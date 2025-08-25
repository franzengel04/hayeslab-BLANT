FROM node:20-alpine

# Create a non-root user
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Set permissions for the non-root user
RUN chown -R app:app /app

# Switch to the non-root user
USER app

# Expose port and start the app
EXPOSE 4000
CMD ["npm", "start"]