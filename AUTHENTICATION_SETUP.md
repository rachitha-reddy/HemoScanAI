# 🔐 Authentication & MongoDB Setup Guide

## ✅ What Was Added

This upgrade adds MongoDB integration and JWT-based authentication to HemoScan AI **without modifying any existing functionality**.

### New Backend Files:
- `backend/config.py` - Configuration management
- `backend/database.py` - MongoDB connection
- `backend/auth_routes.py` - Authentication endpoints
- `backend/env_template.txt` - Environment variables template

### New Frontend Files:
- `frontend/src/auth/AuthContext.jsx` - Authentication context
- `frontend/src/auth/Login.jsx` - Login page
- `frontend/src/auth/Signup.jsx` - Signup page
- `frontend/src/api.js` - Axios configuration with JWT
- `frontend/src/components/ProtectedRoute.jsx` - Route protection

### Modified Files:
- `backend/app.py` - Added JWT protection to routes
- `backend/requirements.txt` - Added new packages
- `frontend/src/App.jsx` - Added auth routes and protection
- `frontend/src/components/Navbar.jsx` - Added login/logout
- `frontend/src/pages/PredictionPage.jsx` - Uses api.js
- `frontend/src/pages/AdminDashboard.jsx` - Uses api.js

## 🚀 Quick Setup

### 1. Install New Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
# Connection string: mongodb://localhost:27017/hemoscan_ai
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/hemoscan_ai`

### 3. Create .env File

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-secret-key-here
```

Generate secure keys:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Restart Backend

```bash
python app.py
```

You should see:
```
MongoDB connected successfully!
Database initialized!
Model loaded successfully!
```

### 5. Frontend (No Changes Needed)

Frontend dependencies are already in package.json. Just restart:
```bash
cd frontend
npm install  # If you haven't already
npm run dev
```

## 🧪 Testing Authentication

### 1. Sign Up
- Go to http://localhost:3000/signup
- Create an account
- You'll be redirected to `/predict`

### 2. Login
- Go to http://localhost:3000/login
- Sign in with your credentials
- Token is stored in localStorage

### 3. Make Prediction
- Go to `/predict` (protected route)
- Fill form and submit
- Prediction is saved to MongoDB with your user_id

### 4. Admin Dashboard
- Only accessible if user role is "admin"
- To make a user admin, update MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "admin@example.com" },
    { $set: { role: "admin" } }
  )
  ```

## 📋 API Endpoints

### Public Endpoints
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /health` - Health check

### Protected Endpoints (Require JWT)
- `GET /auth/me` - Get current user
- `POST /predict` - Make prediction
- `GET /stats` - Admin stats (requires admin role)

## 🔒 Route Protection

### Frontend
- `/predict` - Requires authentication
- `/results` - Requires authentication
- `/admin` - Requires authentication + admin role

### Backend
- All prediction endpoints require JWT token
- Admin endpoints check for admin role

## 🗄️ Database Structure

### MongoDB Collections

**users**
```json
{
  "_id": ObjectId("..."),
  "username": "johndoe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "role": "user",
  "created_at": "2024-01-01T00:00:00"
}
```

**screenings**
```json
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "age": 35,
  "gender": "Female",
  "hemoglobin": 11.5,
  "diet": "moderate",
  "symptoms": ["fatigue", "dizziness"],
  "risk_level": "Moderate",
  "probability": 0.452,
  "timestamp": "2024-01-01T00:00:00"
}
```

### SQLite (Still Works)
- Existing SQLite database continues to work
- Predictions are saved to both MongoDB and SQLite
- SQLite is kept for backward compatibility

## ⚠️ Important Notes

1. **Existing Functionality Preserved**: All original features work exactly as before
2. **Dual Database**: Predictions saved to both MongoDB (with user) and SQLite (legacy)
3. **JWT Tokens**: Stored in localStorage (for hackathon simplicity)
4. **Default Role**: New users get "user" role by default
5. **Admin Access**: Manually update role in MongoDB to grant admin access

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify MONGO_URI in .env
- Check firewall/network settings

### JWT Token Errors
- Clear localStorage and login again
- Check JWT_SECRET_KEY in .env
- Verify token is being sent in Authorization header

### 401 Unauthorized
- Make sure you're logged in
- Check token in localStorage
- Verify backend is running

### 403 Forbidden (Admin)
- User role must be "admin"
- Update in MongoDB: `db.users.updateOne({email: "..."}, {$set: {role: "admin"}})`

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] .env file created with correct values
- [ ] Backend starts without errors
- [ ] Can sign up new user
- [ ] Can login
- [ ] Can make prediction (protected route)
- [ ] Prediction saved to MongoDB
- [ ] Admin dashboard accessible (if admin role)
- [ ] All existing features still work

---

**All existing functionality is preserved. This is a pure extension!** 🎉


