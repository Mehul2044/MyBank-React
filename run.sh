#!/bin/bash

# Navigate to the backend directory and start it in a new tab
gnome-terminal --tab -- bash -c "cd mybank-backend && npm start"

# Navigate to the frontend directory and start it in a new tab
gnome-terminal --tab -- bash -c "cd mybank-frontend && npm start"