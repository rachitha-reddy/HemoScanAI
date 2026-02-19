# 🗄️ MongoDB Compass Setup Guide

## Step-by-Step Instructions for MongoDB Compass

### Step 1: Install MongoDB (if not already installed)

1. Download MongoDB Community Server:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Install with default settings
   - **Important**: During installation, check "Install MongoDB as a Service"

2. Download MongoDB Compass:
   - Go to: https://www.mongodb.com/try/download/compass
   - Download and install MongoDB Compass

### Step 2: Start MongoDB Service

**Option A: Automatic (Recommended)**
- MongoDB should start automatically as a Windows service
- Check if it's running:
  ```powershell
  net start MongoDB
  ```
- If it says "The requested service has already been started", you're good!

**Option B: Manual Start**
```powershell
# Open Services (Win + R, type: services.msc)
# Find "MongoDB" service
# Right-click → Start
```

### Step 3: Connect with MongoDB Compass

1. **Open MongoDB Compass**

2. **Connection String**:
   - Default connection string: `mongodb://localhost:27017`
   - Click "Connect" (or "Fill in connection fields individually")
   - Host: `localhost`
   - Port: `27017`
   - Click "Connect"

3. **Verify Connection**:
   - You should see default databases: `admin`, `config`, `local`
   - If you see these, MongoDB is running correctly!

### Step 4: Create Database for HemoScan AI

1. In MongoDB Compass, click **"CREATE DATABASE"** button (top left)

2. Fill in:
   - **Database Name**: `hemoscan_ai`
   - **Collection Name**: `users` (we'll create `screenings` later)
   - Click **"Create Database"**

3. Create second collection:
   - Click **"CREATE COLLECTION"** button
   - Collection Name: `screenings`
   - Click **"Create Collection"**

4. **Verify**:
   - You should now see:
     - Database: `hemoscan_ai`
       - Collection: `users`
       - Collection: `screenings`

### Step 5: Update .env File

Make sure your `backend/.env` file has:

```env
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-secret-key-here
```

**To update .env:**
1. Go to `backend` folder
2. Open `.env` file in a text editor
3. Make sure `MONGO_URI` is exactly: `mongodb://localhost:27017/hemoscan_ai`
4. Save the file

### Step 6: Test the Connection

1. **Start Backend**:
   ```powershell
   cd backend
   python app.py
   ```

2. **Look for this message**:
   ```
   MongoDB connected successfully!
   Database initialized!
   ```

3. **If you see errors**:
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Check MongoDB Compass can connect

### Step 7: Test Signup

1. Go to: http://localhost:3000/signup
2. Create an account
3. **Check MongoDB Compass**:
   - Refresh the `users` collection
   - You should see your new user document!

### Step 8: Verify Data in Compass

After signing up and making predictions:

1. **Users Collection**:
   - Open `hemoscan_ai` → `users`
   - You'll see user documents with:
     - `_id`
     - `username`
     - `email`
     - `password_hash` (encrypted)
     - `role`
     - `created_at`

2. **Screenings Collection**:
   - Open `hemoscan_ai` → `screenings`
   - After making predictions, you'll see:
     - `_id`
     - `user_id` (links to user)
     - `age`, `gender`, `hemoglobin`
     - `risk_level`, `probability`
     - `timestamp`

## 🔧 Troubleshooting

### MongoDB Won't Start

**Error**: "MongoDB service failed to start"

**Solution**:
1. Open Services (Win + R → `services.msc`)
2. Find "MongoDB"
3. Right-click → Properties
4. Check "Startup type" is "Automatic"
5. Click "Start"

### Can't Connect in Compass

**Error**: "Connection refused" or "Cannot connect"

**Solutions**:
1. Check MongoDB service is running:
   ```powershell
   net start MongoDB
   ```
2. Try connection string: `mongodb://127.0.0.1:27017`
3. Check Windows Firewall isn't blocking port 27017
4. Restart MongoDB service

### Backend Can't Connect

**Error**: "Error connecting to MongoDB"

**Solutions**:
1. Verify MongoDB is running (check in Compass)
2. Check `.env` file has correct URI:
   ```
   MONGO_URI=mongodb://localhost:27017/hemoscan_ai
   ```
3. Make sure database `hemoscan_ai` exists (create in Compass)
4. Restart backend after changing `.env`

### Database/Collection Not Found

**Error**: "Database not found" or "Collection not found"

**Solution**:
- MongoDB creates databases/collections automatically when you insert data
- But you can create them manually in Compass first
- Or just try signing up - it will create them automatically!

## ✅ Quick Checklist

- [ ] MongoDB installed
- [ ] MongoDB service is running
- [ ] MongoDB Compass installed and can connect
- [ ] Database `hemoscan_ai` created in Compass
- [ ] Collections `users` and `screenings` created
- [ ] `.env` file has correct `MONGO_URI`
- [ ] Backend starts without MongoDB errors
- [ ] Can sign up and see user in Compass

## 📝 Connection String Formats

**Local MongoDB (Default)**:
```
mongodb://localhost:27017/hemoscan_ai
```

**With Authentication** (if you set up auth):
```
mongodb://username:password@localhost:27017/hemoscan_ai
```

**Custom Port**:
```
mongodb://localhost:27018/hemoscan_ai
```

## 🎯 Next Steps

1. **Start MongoDB** (if not running)
2. **Open MongoDB Compass** and connect
3. **Create database** `hemoscan_ai` in Compass
4. **Verify `.env`** has correct connection string
5. **Start backend**: `python app.py`
6. **Test signup** at http://localhost:3000/signup
7. **Check Compass** to see your data!

---

**You're all set!** MongoDB Compass will let you visually see all your users and predictions! 🎉

