#EV Charging Station Management System
This is a full-stack web application designed to manage electric vehicle (EV) charging stations. It includes user authentication and an admin panel for managing charging station data.

Features
User Authentication: Secure user registration and login.
Admin Panel:
View Stations: See all listed charging stations.
Add Stations: Create new charging station entries with details.
Update Stations: Modify existing charging station information.
Delete Stations: Remove charging station entries.
Public View: Users can view a list of available charging stations.
Technologies Used
Frontend (Vue.js)
Vue.js: Frontend framework.
Vue Router: For navigation within the app.
Axios: For API calls.
Backend (Node.js/Express)
Node.js & Express.js: Server-side runtime and web framework.
MongoDB & Mongoose: Database and ODM.
Bcrypt.js & jsonwebtoken: For authentication and security.
Deployment
Vercel: Hosts the frontend.
Render: Hosts the backend API.
Getting Started
Follow these steps to set up the project locally.

Prerequisites
Make sure you have these installed:

Node.js (LTS recommended)
npm (comes with Node.js) or Yarn
Git
You'll also need a MongoDB Atlas account (or a local MongoDB instance).

Local Setup
Clone the Repository:

Bash

git clone <your-repository-url>
cd <your-project-directory>
Backend Setup:

Navigate into the backend folder:
Bash

cd backend
Install backend dependencies:
Bash

npm install
# or
yarn install
Create a .env file in the backend directory and add your environment variables:
Code snippet

MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_super_secret_key_for_jwt
ADMIN_EMAIL=admin@example.com
PORT=5000
Replace placeholder values with your actual MongoDB connection string, a strong random secret, and your designated admin email.
Start the backend server:
Bash

npm run dev
# or
yarn dev
The backend API will run on http://localhost:5000.
Frontend Setup:

Open a new terminal and navigate into the frontend folder from your project root:
Bash

cd frontend
Install frontend dependencies:
Bash

npm install
# or
yarn install
Create a .env file in the frontend directory and set your backend API URL:
Code snippet

VITE_APP_BACKEND_API_URL=http://localhost:5000
(Note: If you're using Vite, VITE_APP_ prefix is common. Adjust if your project uses a different bundler like Vue CLI with VUE_APP_)
Start the frontend development server:
Bash

npm run dev
# or
yarn dev
The frontend application will run on http://localhost:5173 (or similar).
Admin Credentials
To use the admin panel, you'll need to register an account with the ADMIN_EMAIL you set in your backend's .env file via the registration endpoint. Once registered, log in to access admin features.

