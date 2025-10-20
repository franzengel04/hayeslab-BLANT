#! /bin/bash
# place this bash script in the root directory of the blant project

cd frontend
echo "Building static production files..."
npm run build
echo "Copying build files into /var/www/BLANT_Website/..."
sudo cp -r dist/* /var/www/BLANT_Website/
echo "Adding read permissions..."
sudo chmod -R 755 /var/www/BLANT_Website
sudo nginx -t
echo "Restarting nginx server..."
sudo systemctl reload nginx
sudo systemctl restart nginx
echo "Nginx status:"
sudo systemctl status nginx