#!/bin/sh
set -e  # exit immediately if a command exits with a non-zero status

echo "Installing dependencies..."
npm install


echo "Starting application..."
exec npm run start:dev