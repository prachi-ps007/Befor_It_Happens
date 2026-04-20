# 🚀 Befor It Happens
A Predictive Safety Simulation System
## 🧠 Problem Statement

Hazardous environments such as mines, factories, and construction sites often rely on systems that react to danger after it occurs. However, in many real-world incidents, accidents happen not because systems fail, but because human response is delayed.

There is a lack of accessible tools that:

Help visualize how danger builds over time
Predict risks before they become critical
Demonstrate how delayed human reactions impact safety outcomes

Before It Happens addresses this gap by creating a simulation system that models environmental changes, predicts future risks, and analyzes user response in critical situations.

✨ Features
🎥 Predictive Simulation Engine
Simulates environmental conditions (Methane, Oxygen, Temperature)
Gradual and realistic change over time
Scenario-based simulation (e.g., gas leak)
🔮 Risk Prediction System
Calculates real-time risk score (0–100)
Detects trends and predicts future danger
Displays alerts like:
“Risk rising”
“Danger likely in X seconds”

🚨 Real-Time Alert System
Visual alert triggers when risk crosses threshold
Animated warning UI for high-risk situations

⏱️ Human Reaction Tracker (Unique Feature)
Tracks when warning appears vs when user reacts
Calculates reaction delay
Shows impact of delay on overall risk

📊 Final Safety Report
Displays:
Reaction time
Ideal response time
Risk increase due to delay
Provides clear outcome analysis

🧭 Command Center Dashboard
Centralized monitoring interface
Metric tiles (personnel, alerts, air quality)
Visual mine map with zone-based risk levels

🧪 Predictive Simulator (“What-If” Lab)
Interactive sliders to simulate conditions
Real-time risk updates
Future risk projection graphs

👤 Personnel Monitoring
Miner directory with health vitals
Heart rate and temperature tracking (simulated)
Individual detail view

📈 Environmental Logs
Historical data visualization
Sensor-based filtering
Report generation

📘 Emergency Protocol System
Searchable SOPs (Standard Operating Procedures)
Interactive checklist for emergency handling

🛠️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
React Router
State Management
React Hooks (useState, useEffect)
Context API
Animations
Framer Motion
Backend / Database
Firebase Authentication
Firebase Firestore (CRUD operations)

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/prachi-ps007/Befor_It_Happens.git
cd Befor_It_Happens
2. Install Dependencies
npm install
3. Set Up Firebase
Create a Firebase project
Enable:
Authentication (Email/Password)
Firestore Database
Add your Firebase config in:
/src/services/firebase.js
4. Run the App
npm run dev
5. Open in Browser
   https://befor-it-happens.vercel.app/
   
## 🎯 Project Goal

To demonstrate how predictive systems can improve safety by identifying risks early and highlighting the importance of timely human response.

## 💡 Future Improvements
Real IoT sensor integration
AI-based predictive modeling
Mobile app version
Multi-user collaborative monitoring
🎬 Demo

(Add your demo video link here after recording)
