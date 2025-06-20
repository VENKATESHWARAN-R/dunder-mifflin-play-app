#!/bin/sh
# Replace API_BASE_URL placeholder with the actual environment variable value
sed -i "s|%%API_BASE_URL%%|${API_BASE_URL}|g" /usr/share/nginx/html/script.js

# Start nginx
exec nginx -g 'daemon off;'