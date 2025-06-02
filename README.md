# ECCharger – EV Charging Station Management System

**ECCharger** is a full-stack web application designed to manage electric vehicle (EV) charging stations. It includes secure user authentication and an admin panel for managing charging station data.

---

## 🚀 Features

- **User Authentication**
  - Secure user registration and login using JWT and bcrypt.

- **Admin Panel**
  - **View Stations**: See all listed charging stations.
  - **Add Stations**: Create new charging station entries with details.
  - **Update Stations**: Modify existing charging station information.
  - **Delete Stations**: Remove charging station entries.

- **Public View**
  - Users can view a list of available charging stations without logging in.

---

## 🛠️ Technologies Used

### **Frontend (Vue.js)**
- Vue.js – Frontend framework
- Vue Router – For routing/navigation
- Axios – For making HTTP requests

### **Backend (Node.js + Express)**
- Node.js & Express.js – Server-side runtime and framework
- MongoDB & Mongoose – Database and ODM
- bcrypt.js – Password hashing
- jsonwebtoken – Authentication via JWT

---

## 🌐 Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com/)
- **Backend API**: Hosted on [Render](https://render.com/)

---

## 🧩 Getting Started

Follow these steps to set up the project locally.

### ✅ Prerequisites

Make sure the following are installed:

- [Node.js (LTS)](https://nodejs.org/)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account or a local MongoDB instance

---

## ⚙️ Local Setup

### 1. Clone the Repository

git clone https://github.com/sahilfulmali2/EV-Chargers
cd EV-Chargers
### 2. Backend Setup

cd backend
npm install

Create a .env file inside the backend folder and add:

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=a_super_secret_key_for_jwt

ADMIN_EMAIL=admin@example.com

PORT=5000

Start the backend server:

npm run dev
API will run at: http://localhost:5000

###3. Frontend Setup
Open a new terminal:

cd frontend
npm install
# or
yarn install
Create a .env file inside the frontend folder and add:

VITE_APP_BACKEND_API_URL=http://localhost:5000
Start the frontend development server:

npm run dev

App will run at: http://localhost:5173

🔐 Admin Credentials
To access the Admin Panel:

Register a new account using the email you defined in ADMIN_EMAIL inside your backend .env file.

Log in with that account to access admin features like adding, editing, or deleting stations.


## 📍 User Map View

To view EV charging stations on the map, follow these steps:

1. **Register an Account**  
   Users must first sign up to the platform by providing necessary details in the registration form.

2. **Login**  
   After registration, users can log in using their credentials to access their dashboard.

3. **View EV Stations on the Map**  
   Once logged in, users will have access to a map displaying the locations of available EV charging stations.

