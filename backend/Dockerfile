FROM node:20-alpine

# Create a non-root user
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

RUN mkdir -p /app/uploads

RUN mkdir -p /app/tmp

# Copy application files
COPY . .

# Set permissions for the non-root user
RUN chown -R app:app /app /app/uploads /app/tmp

# Switch to the non-root user
USER app

# Expose port and start the app
EXPOSE 4000
CMD ["npm", "start"]