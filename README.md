# Zero-to-Deploy  
### IEEE Hackathon – Arcane  

🌱 **EcoTrack – Carbon Footprint Tracking & Reduction Platform**

EcoTrack is a full-stack web application designed to help users **track, understand, and reduce their carbon footprint**.  
It enables users to calculate emissions from daily activities, set reduction goals, visualize progress, and receive guidance through an AI-powered eco assistant.

---

## 🚀 Key Features

- 🔐 **Authentication** – Secure Sign Up & Login using JWT  
- 📊 **Carbon Calculator** – Calculate carbon emissions from daily activities  
- 🎯 **Goals & Progress** – Set carbon reduction goals and track progress visually  
- 📈 **Reports** – Generate monthly carbon footprint reports  
- 🤖 **Eco Assistant** – Ask sustainability-related questions  
- 📬 **Feedback System** – Users can send feedback via email  
- ⚙️ **Settings** – Manage profile and user preferences  

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript  
- Vite  
- Tailwind CSS  
- React Router  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JWT Authentication  

---

## 📁 Project Structure


Zero-to-Deploy/
│
├── frontend/        # React frontend
│   ├── src/
│   └── package.json
│
├── backend/         # Express backend
│   ├── src/
│   │   └── server.ts
│   └── package.json
│
└── README.md

---

## ▶️ How to Run This Project

### 1. Clone the Repository
```bash
git clone https://github.com/Pradnya-2006/Zero-to-Deploy.git
cd Zero-to-Deploy

2️. Setup Backend
cd backend
npm install

Create .env file inside backend/
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start Backend Server
npm run dev

Backend will run at:
http://localhost:5000

3️. Setup Frontend
cd ../frontend
npm install
npm run dev

Frontend will run at:
http://localhost:8080
