#!/bin/bash

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "Setup complete! Please configure your .env files."
