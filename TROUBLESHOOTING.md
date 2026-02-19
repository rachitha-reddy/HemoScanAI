# 🔧 Troubleshooting: Account Creation Issues

## Common Issues and Solutions

### 1. **Dependencies Not Installed**

**Error**: `ModuleNotFoundError: No module named 'pymongo'`

**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

This will install:
- pymongo
- flask-bcrypt
- flask-jwt-extended
- python-dotenv

### 2. **MongoDB Not Running**

**Error**: `Error connecting to MongoDB` or connection timeout

**Solution**:

**For Local MongoDB:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Or check if it's running
# MongoDB should be running on localhost:27017
```

**For MongoDB Atlas:**
- Make sure your connection string is correct
- Check network access in Atlas dashboard
- Verify IP whitelist includes your IP

### 3. **Missing .env File**

**Error**: Using default values, MongoDB connection fails

**Solution**:
Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/hemoscan_ai
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-secret-key-here
```

Generate secure keys:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. **Backend Not Running**

**Error**: Frontend can't connect to backend

**Solution**:
1. Make sure backend is running:
   ```bash
   cd backend
   python app.py
   ```
2. Check backend is on `http://localhost:5000`
3. Verify you see:
   ```
   MongoDB connected successfully!
   Database initialized!
   Model loaded successfully!
   ```

### 5. **CORS Errors**

**Error**: CORS policy blocking requests

**Solution**:
- Make sure `CORS(app)` is in `app.py` (it should be)
- Check backend is running on port 5000
- Verify frontend is calling correct URL

### 6. **Browser Console Errors**

**Check Browser Console (F12)**:
- Look for network errors
- Check if requests are being made
- Verify response status codes

### 7. **Test Backend Directly**

Test the signup endpoint directly:

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Expected Response**:
```json
{
  "message": "User created successfully",
  "access_token": "...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 8. **Check MongoDB Connection**

Test MongoDB connection:
```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/hemoscan_ai')
db = client['hemoscan_ai']
print("Connected!")
print("Collections:", db.list_collection_names())
```

## Step-by-Step Debugging

1. **Check Backend Logs**:
   - Look at terminal where `python app.py` is running
   - Check for error messages
   - Verify MongoDB connection message

2. **Check Frontend Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors
   - Go to Network tab
   - Try signup and check the request/response

3. **Verify Environment**:
   ```bash
   # Check Python packages
   pip list | grep -E "pymongo|flask-bcrypt|flask-jwt"
   
   # Check MongoDB
   # Windows
   net start MongoDB
   
   # Check if .env exists
   ls backend/.env  # Linux/Mac
   dir backend\.env  # Windows
   ```

4. **Test Each Component**:
   - Test MongoDB: Can you connect?
   - Test Backend: Is Flask running?
   - Test Endpoint: Does `/auth/signup` respond?
   - Test Frontend: Is React app running?

## Quick Fix Checklist

- [ ] Installed new dependencies: `pip install -r requirements.txt`
- [ ] MongoDB is running (local or Atlas)
- [ ] Created `.env` file in `backend/` directory
- [ ] Backend server is running (`python app.py`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] No errors in backend terminal
- [ ] No errors in browser console
- [ ] Network tab shows request to `/auth/signup`

## Still Not Working?

1. **Restart Everything**:
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Restart backend
   - Restart frontend

2. **Clear Browser Cache**:
   - Clear localStorage
   - Hard refresh (Ctrl+Shift+R)

3. **Check File Permissions**:
   - Make sure `.env` file is readable
   - Check MongoDB has write permissions

4. **Verify Code**:
   - Make sure all files were saved
   - Check for syntax errors
   - Verify imports are correct

## Get Help

If still having issues, provide:
1. Backend terminal output
2. Browser console errors
3. Network tab request/response
4. MongoDB connection status
5. Python version: `python --version`
6. Node version: `node --version`


