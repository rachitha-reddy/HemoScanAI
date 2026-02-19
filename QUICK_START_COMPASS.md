# 🚀 Quick Start: MongoDB Compass Setup

## ✅ Your Setup is Ready!

Your `.env` file is already configured correctly:
```
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
```

## 📋 Step-by-Step Instructions

### Step 1: Start MongoDB

**Check if MongoDB is running:**
```powershell
net start MongoDB
```

If it says "The requested service has already been started" → ✅ MongoDB is running!

If it says "The service name is invalid" → MongoDB is not installed as a service. Install MongoDB first.

### Step 2: Open MongoDB Compass

1. Open **MongoDB Compass** application
2. You'll see the connection screen

### Step 3: Connect to MongoDB

**Option A: Quick Connect (Recommended)**
- Click **"Fill in connection fields individually"**
- **Hostname**: `localhost`
- **Port**: `27017`
- Click **"Connect"**

**Option B: Connection String**
- Use: `mongodb://localhost:27017`
- Click **"Connect"**

### Step 4: Verify Connection

After connecting, you should see:
- Default databases: `admin`, `config`, `local`
- If you see these, ✅ MongoDB is working!

### Step 5: Create Database (Optional but Recommended)

**MongoDB will create the database automatically**, but you can create it manually:

1. Click **"CREATE DATABASE"** button (top left)
2. **Database Name**: `hemoscan_ai`
3. **Collection Name**: `users`
4. Click **"Create Database"**

5. Then create the second collection:
   - Click on `hemoscan_ai` database
   - Click **"CREATE COLLECTION"**
   - Name: `screenings`
   - Click **"Create Collection"**

**Note**: The app will create these automatically when you sign up, so this step is optional!

### Step 6: Start Your Backend

```powershell
cd backend
python app.py
```

**Look for this message:**
```
MongoDB connected successfully!
Database initialized!
Model loaded successfully!
 * Running on http://127.0.0.1:5000
```

If you see this, ✅ Everything is working!

### Step 7: Test Signup

1. Go to: **http://localhost:3000/signup**
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Sign Up"**

### Step 8: Verify in MongoDB Compass

1. **Refresh** MongoDB Compass (click refresh button)
2. Open `hemoscan_ai` database
3. Open `users` collection
4. **You should see your new user!** 🎉

The user document will look like:
```json
{
  "_id": ObjectId("..."),
  "username": "testuser",
  "email": "test@example.com",
  "password_hash": "$2b$12$...",
  "role": "user",
  "created_at": "2024-..."
}
```

## 🔧 Troubleshooting

### Problem: "Error connecting to MongoDB"

**Solution:**
1. Check MongoDB is running: `net start MongoDB`
2. Try connecting in Compass first
3. If Compass can't connect, MongoDB isn't running
4. Restart MongoDB service

### Problem: "Database not found"

**Solution:**
- This is normal! MongoDB creates databases automatically
- Just try signing up - it will create everything
- Or create manually in Compass (Step 5)

### Problem: Backend starts but signup fails

**Check:**
1. Backend terminal for error messages
2. Browser console (F12) for errors
3. MongoDB Compass - can you see the database?

### Problem: MongoDB service won't start

**Solution:**
1. Open Services: Win + R → type `services.msc`
2. Find "MongoDB" service
3. Right-click → Start
4. If it fails, check MongoDB installation

## ✅ Success Checklist

- [ ] MongoDB service is running
- [ ] MongoDB Compass can connect
- [ ] Backend starts without errors
- [ ] Can access http://localhost:3000/signup
- [ ] Can create an account
- [ ] User appears in MongoDB Compass

## 🎯 What Happens Next

After signing up:
1. **User is saved** to MongoDB `users` collection
2. **You're logged in** automatically
3. **You can make predictions**
4. **Predictions are saved** to `screenings` collection
5. **You can see everything** in MongoDB Compass!

## 📊 Viewing Data in Compass

**Users Collection:**
- Shows all registered users
- See usernames, emails, roles
- Password hashes (encrypted, can't see actual passwords)

**Screenings Collection:**
- Shows all predictions made
- Linked to users via `user_id`
- See risk levels, probabilities, timestamps

---

**You're all set!** Start MongoDB, open Compass, start your backend, and try signing up! 🚀

