# 🔧 Fix: Account Creation Issue

## ✅ What I Fixed

1. **Installed Missing Dependencies**: All required packages are now installed
2. **Created .env File**: Environment variables are set up
3. **Fixed Bcrypt Initialization**: Authentication should work now

## 🚀 Next Steps

### 1. Make Sure MongoDB is Running

**Option A: Local MongoDB**
```powershell
# Check if MongoDB service is running
net start MongoDB

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud - Recommended for Hackathon)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hemoscan_ai
   ```

### 2. Restart Backend

```powershell
cd backend
python app.py
```

**You should see:**
```
MongoDB connected successfully!
Database initialized!
Model loaded successfully!
 * Running on http://127.0.0.1:5000
```

### 3. Test Signup

1. Go to http://localhost:3000/signup
2. Fill in the form:
   - Username: (at least 3 characters)
   - Email: (valid email format)
   - Password: (at least 6 characters)
   - Confirm Password: (must match)
3. Click "Sign Up"

## 🐛 If Still Not Working

### Check Backend Terminal
Look for error messages when you try to sign up.

### Check Browser Console (F12)
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Try signup again
6. Click on the `/auth/signup` request
7. Check the Response tab for error messages

### Common Errors:

**"Error connecting to MongoDB"**
- MongoDB is not running
- Connection string is wrong
- Network/firewall issue

**"Email already registered"**
- Try a different email
- Or the account was created successfully!

**"Invalid email format"**
- Make sure email has @ and . (e.g., user@example.com)

**"Password must be at least 6 characters"**
- Use a longer password

### Test Backend Directly

Open a new terminal and test:
```powershell
curl -X POST http://localhost:5000/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"password123\"}"
```

Or use PowerShell:
```powershell
$body = @{
    username = "testuser"
    email = "test@test.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

## ✅ Success Indicators

When signup works, you should:
1. See "User created successfully" message
2. Be automatically redirected to `/predict`
3. See your username in the navbar
4. Be able to make predictions

## 📝 Quick Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` file exists in `backend/` directory
- [ ] Backend is running (`python app.py`)
- [ ] Frontend is running (`npm run dev`)
- [ ] No errors in backend terminal
- [ ] No errors in browser console
- [ ] Can access http://localhost:3000/signup

---

**Try signing up now!** If you still have issues, check the backend terminal for specific error messages.


