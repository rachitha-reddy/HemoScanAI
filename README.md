# HemoScan AI - Anemia Risk Prediction Platform

A complete, production-quality full-stack web application for AI-powered anemia risk prediction, designed for early detection in both urban and rural healthcare environments.

## 🎯 Features

- **AI-Powered Risk Prediction**: Machine learning-based anemia risk assessment
- **Explainable AI**: Understand which factors contribute most to risk
- **Beautiful Modern UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Rural Mode**: Predictions without hemoglobin test requirements
- **Admin Dashboard**: Comprehensive statistics and analytics
- **Real-time Charts**: Visual representation of risk distribution and trends
- **User Authentication**: JWT-based signup and login system
- **MongoDB Integration**: User accounts and user-linked predictions
- **Role-Based Access**: Admin and user roles with protected routes

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- TailwindCSS
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (API calls)

### Backend
- Python Flask (REST API)
- Scikit-learn (Machine Learning)
- SQLite (Database - legacy)
- MongoDB (User accounts and user-linked screenings)
- Flask-JWT-Extended (Authentication)
- Flask-Bcrypt (Password hashing)
- PyMongo (MongoDB driver)
- Pandas, NumPy

## 📁 Project Structure

```
hemoscan-ai/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── train_model.py        # ML model training script
│   ├── config.py             # Configuration (MongoDB, JWT)
│   ├── database.py           # MongoDB connection
│   ├── auth_routes.py        # Authentication endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (create this)
│   ├── models/               # Trained ML models (generated)
│   └── hemoscan.db          # SQLite database (generated)
├── frontend/
│   ├── src/
│   │   ├── auth/             # Authentication
│   │   │   ├── AuthContext.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── PredictionPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── api.js           # Axios configuration
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm installed
- MongoDB installed and running (or MongoDB Atlas account)

### MongoDB Setup

**Option 1: Local MongoDB**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/hemoscan_ai`

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/hemoscan_ai`)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
JWT_SECRET_KEY=your-secret-key-change-in-production
SECRET_KEY=your-secret-key-change-in-production
```

**Generate secure keys:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

6. Train the ML model:
```bash
python train_model.py
```

This will generate:
- `models/model.pkl` - Trained logistic regression model
- `models/scaler.pkl` - Feature scaler
- `models/feature_names.pkl` - Feature names

7. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📖 Usage

1. **Landing Page**: Visit the homepage to learn about HemoScan AI
2. **Sign Up/Login**: Create an account or sign in to access predictions
3. **Predict Risk**: Click "Start Risk Assessment" or navigate to `/predict`
4. **Fill Form**: Enter your information:
   - Age (18-100)
   - Gender
   - Hemoglobin level (or enable Rural Mode)
   - Diet type
   - Symptoms (checkboxes)
5. **View Results**: See your risk assessment with:
   - Risk score and level
   - Top contributing factors
   - Personalized recommendations
   - Feature importance chart
6. **Admin Dashboard**: View statistics at `/admin` (admin role required)

## 🎨 Design Features

- **Color Palette**:
  - Primary: #2563EB (Professional Blue)
  - Secondary: #10B981 (Health Green)
  - Accent: #F59E0B (Warning Amber)
  - Danger: #EF4444 (Risk Red)

- **UI Elements**:
  - Glassmorphism cards
  - Smooth Framer Motion animations
  - Gradient buttons
  - Animated risk meters
  - Interactive charts

## 🔬 Machine Learning

The model uses **Logistic Regression** trained on synthetic data with features:
- Age
- Gender
- Hemoglobin level
- Diet quality
- Symptoms (fatigue, dizziness, pale skin, weakness, shortness of breath)

**Risk Classification**:
- Low Risk: Probability < 0.3
- Moderate Risk: 0.3 ≤ Probability < 0.6
- High Risk: Probability ≥ 0.6

## 📊 API Endpoints

### Authentication Endpoints

#### POST `/auth/signup`
Create a new user account.

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### GET `/auth/me`
Get current authenticated user (requires JWT token).

### Prediction Endpoints

#### POST `/predict` (Protected - requires JWT)
Predict anemia risk from user inputs.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "age": 35,
  "gender": "Female",
  "hemoglobin": 11.5,
  "diet": "moderate",
  "symptoms": ["fatigue", "dizziness"],
  "rural_mode": false
}
```

**Response**:
```json
{
  "risk_level": "Moderate",
  "risk_score": 45.2,
  "probability": 0.452,
  "top_factors": [...],
  "recommendations": [...]
}
```

### Admin Endpoints

#### GET `/stats` (Protected - requires Admin role)
Get statistics for admin dashboard.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "total_screenings": 150,
  "risk_distribution": {...},
  "age_distribution": {...},
  "recent_predictions": [...]
}
```

## 🗄️ Database

### MongoDB Collections

**users** collection:
- `_id` (ObjectId)
- `username` (string, unique)
- `email` (string, unique)
- `password_hash` (string, bcrypt)
- `role` (string: "user" | "admin")
- `created_at` (ISO timestamp)

**screenings** collection:
- `_id` (ObjectId)
- `user_id` (ObjectId, reference to users)
- `age` (integer)
- `gender` (string)
- `hemoglobin` (float)
- `diet` (string)
- `symptoms` (array)
- `risk_level` (string)
- `probability` (float)
- `timestamp` (ISO timestamp)

### SQLite (Legacy)

SQLite database with `screenings` table (kept for backward compatibility):
- id (primary key)
- age
- gender
- hemoglobin
- diet
- symptoms
- risk_level
- probability
- timestamp

**Note**: Predictions are saved to both MongoDB (with user association) and SQLite (for compatibility).

## 🎯 Hackathon Ready

This application is fully functional and ready for hackathon submission with:
- ✅ Complete frontend and backend
- ✅ Working ML model
- ✅ Beautiful, responsive UI
- ✅ Animations and charts
- ✅ Error handling
- ✅ Form validation
- ✅ Admin dashboard
- ✅ User authentication (JWT)
- ✅ MongoDB integration
- ✅ Role-based access control
- ✅ Protected routes

## 📝 Notes

- The ML model uses synthetic data for demonstration
- For production, train with real clinical data
- Rural mode estimates hemoglobin when test unavailable
- All predictions are stored in both MongoDB (with user association) and SQLite (for compatibility)
- JWT tokens are stored in localStorage (for hackathon simplicity)
- Default user role is "user". To create an admin user, manually update the role in MongoDB
- MongoDB connection string can be local or cloud (MongoDB Atlas)

## 🤝 Contributing

This is a hackathon project. Feel free to extend and improve!

## 📄 License

MIT License - Feel free to use for your projects!

---

**Built with ❤️ for healthcare innovation**

