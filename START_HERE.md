# 🚀 START HERE: MongoDB Compass Setup

## ✅ Everything is Configured!

Your `.env` file is already set up correctly for MongoDB Compass:
```
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
```

## 📋 Quick Start (3 Steps)

### 1️⃣ Start MongoDB

Open PowerShell and run:
```powershell
net start MongoDB
```

**Expected output:**
- ✅ "The requested service has already been started" → MongoDB is running!
- ❌ "The service name is invalid" → Install MongoDB first

### 2️⃣ Open MongoDB Compass

1. Open **MongoDB Compass** application
2. Click **"Fill in connection fields individually"**
3. Enter:
   - **Hostname**: `localhost`
   - **Port**: `27017`
4. Click **"Connect"**

**✅ Success**: You should see databases: `admin`, `config`, `local`

### 3️⃣ Start Backend

```powershell
cd backend
python app.py
```

**✅ Success**: You should see:
```
MongoDB connected successfully!
Database: hemoscan_ai
Database initialized!
Model loaded successfully!
 * Running on http://127.0.0.1:5000
```

## 🎯 Test It!

1. Go to: **http://localhost:3000/signup**
2. Create an account
3. **Check MongoDB Compass**:
   - Refresh (click refresh button)
   - Open `hemoscan_ai` database
   - Open `users` collection
   - **See your user!** 🎉

## ❌ Troubleshooting

### "Error connecting to MongoDB"

**Fix:**
1. Make sure MongoDB is running: `net start MongoDB`
2. Try connecting in Compass first
3. If Compass can't connect → MongoDB isn't running

### "Database not found"

**This is normal!** MongoDB creates databases automatically when you insert data. Just try signing up - it will create everything.

### Backend won't start

**Check:**
- MongoDB service is running
- `.env` file exists in `backend/` folder
- All packages installed: `pip install -r requirements.txt`

## 📚 More Help

- **Detailed guide**: See `MONGODB_COMPASS_SETUP.md`
- **Quick guide**: See `QUICK_START_COMPASS.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`

---

**Ready?** Start MongoDB → Open Compass → Start Backend → Sign Up! 🚀

