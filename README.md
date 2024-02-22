# Project Setup Instructions

1. **Ensure Node.js is installed**: Make sure Node.js is installed on your system.

2. **Install project dependencies**:
   ```sh
   npm install
   ```
    - This installs dependencies for the project in the root folder.

3. **Navigate to the backend folder**:
   ```sh
   cd mybank-backend
   ```
    - Move to the backend folder.

4. **Install backend dependencies**:
   ```sh
   npm install
   ```
    - This installs dependencies for the backend.

5. **Set up environment variable**:
    - Ensure that the **mybank-react-firebase-adminsdk-3ctvu-0629e6443c.json** file is added as an environment variable named `GOOGLE_APPLICATION_CREDENTIALS`. For example, in Linux:
      ```sh
      export GOOGLE_APPLICATION_CREDENTIALS="/home/mehul/Desktop/Coding/Web development/Project/MyBank-React/mybank-backend/config/mybank-react-firebase-adminsdk-3ctvu-0629e6443c.json"
      ```
      This sets the environment variable for the current session.

6. **Start the backend server while still in the `mybank-backend` folder**:
   ```sh
   node app.js
   ```
    - This command starts the backend server.

7. **Return to the project root folder**:
   ```sh
   cd ..
   ```
    - Go back to the root folder.

8. **Start the frontend development server**:
   ```sh
   npm start
   ```
    - This command starts the frontend development server.

9. **Access the web application**:
    - Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to access the web application.
