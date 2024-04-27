# MyBank Project

This project is a banking application built with JavaScript, React, and Node.js.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node.js and npm.
- You have a Linux machine. This guide is tailored for Linux users.

## Setting Up and Running the Project

### Backend

1. Navigate to the `mybank-backend` directory:

    ```bash
    cd mybank-backend
    ```

2. Install the necessary npm packages:

    ```bash
    npm install
    ```

3. Import Firebase and MongoDB credentials:

    - Make a new Firebase project and a new MongoDB project.
    - Make an `.env` file.
    - Ensure that the `mybank-react-firebase-adminsdk-3ctvu-0629e6443c.json` file is present in the `config` folder inside the backend folder. This file is generated by setting up the Firebase Admin SDK for Node.js.
    - In the `.env` file, add a variable named `DB_URL` and add your MongoDB connection URL.

4. Start the server:

    ```bash
    npm start
    ```

The server should now be running on `http://localhost:3001` or the port specified in your `.env` file.

### Frontend

1. Navigate to the `mybank-frontend` directory:

    ```bash
    cd mybank-frontend
    ```

2. Install the necessary npm packages:

    ```bash
    npm install
    ```
3. Import Firebase credentials:

    - Make a new Firebase project.
    - Make an `.env` file.
    - In the `.env` file, add the Firebase credentials for connecting to the Web Client by appending `REACT_APP_` to each variable. For example, `REACT_APP_API_KEY="shdgf93827fh9328"`.

4. Start the React application:

    ```bash
    npm start
    ```

The application should now be running on `http://localhost:3000` or the port specified in your `.env` file.