# Step 1: Install Nginx
sudo apt update && sudo apt install nginx -y

echo "Configuring nginx..."

# Step 2: Create the Nginx configuration for devcamper.symonmuchemi.com
sudo tee /etc/nginx/sites-available/devcamper <<EOF
server {
    listen 80;
    server_name devcamper.symonmuchemi.com www.devcamper.symonmuchemi.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
}
EOF

# Step 3: Enable the configuration
sudo ln -s /etc/nginx/sites-available/devcamper /etc/nginx/sites-enabled/

# Step 4: Test the Nginx configuration
sudo nginx -t

# Step 5: Restart Nginx
sudo systemctl restart nginx

# Step 6: Install Certbot and obtain an SSL certificate
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx -d devcamper.symonmuchemi.com --agree-tos --redirect --non-interactive -m muchemi.developer.com

# Step 7: Ensure Certbot auto-renews the certificate
sudo systemctl enable certbot.timer
