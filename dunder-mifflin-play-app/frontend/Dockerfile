# Use an official Nginx runtime as a parent image
FROM nginx:1.21-alpine

# Copy the frontend static files
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 8080 (Cloud Run default port)
EXPOSE 8080

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]