# 🚀 Quick Start - Next Steps

## Step 1: Set Up Backend (Terminal/PowerShell Window 1)

### 1.1 Navigate to backend directory
```powershell
cd backend
```

### 1.2 Create Python virtual environment
```powershell
python -m venv venv
```

### 1.3 Activate virtual environment
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run this first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 1.4 Install Python dependencies
```powershell
pip install -r requirements.txt
```

### 1.5 Train the ML model (IMPORTANT - Do this first!)
```powershell
python train_model.py
```

**Expected output:**
```
Generating synthetic dataset...
Training Logistic Regression model...
Training Accuracy: 0.xxxx
Test Accuracy: 0.xxxx
Model saved successfully!
```

This creates:
- `models/model.pkl` - The trained model
- `models/scaler.pkl` - Feature scaler
- `models/feature_names.pkl` - Feature names

### 1.6 Start the Flask server
```powershell
python app.py
```

**Expected output:**
```
Database initialized!
Model loaded successfully!
 * Running on http://127.0.0.1:5000
```

✅ **Backend is now running on http://localhost:5000**

---

## Step 2: Set Up Frontend (Terminal/PowerShell Window 2)

### 2.1 Open a NEW terminal window and navigate to frontend
```powershell
cd frontend
```

### 2.2 Install Node.js dependencies
```powershell
npm install
```

This will install:
- React, React Router
- TailwindCSS
- Framer Motion
- Recharts
- Axios
- Lucide React (icons)

### 2.3 Start the development server
```powershell
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running on http://localhost:3000**

---

## Step 3: Test the Application

### 3.1 Open your browser
Navigate to: **http://localhost:3000**

### 3.2 Test the flow:

1. **Landing Page** (`/`)
   - You should see the HemoScan AI hero section
   - Click "Start Risk Assessment"

2. **Prediction Form** (`/predict`)
   - Fill in the form:
     - Age: 35
     - Gender: Female
     - Hemoglobin: 11.5
     - Diet: Moderate
     - Select symptoms: Fatigue, Dizziness
   - Click "Get Risk Assessment"
   - Wait for the AI analysis (loading animation)

3. **Results Page** (`/results`)
   - See your risk score with animated meter
   - View top contributing factors chart
   - Read personalized recommendations
   - Try "Download Report" button

4. **Admin Dashboard** (`/admin`)
   - View statistics
   - See risk distribution pie chart
   - Check age distribution bar chart
   - Review recent predictions table

---

## Step 4: Verify Everything Works

### ✅ Checklist:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can access landing page
- [ ] Can submit prediction form
- [ ] Results page displays correctly
- [ ] Admin dashboard shows statistics
- [ ] Charts are rendering
- [ ] Animations are smooth
- [ ] No console errors in browser

---

## 🐛 Troubleshooting

### Backend Issues:

**Problem: "Model not found"**
- **Solution:** Run `python train_model.py` first

**Problem: "Port 5000 already in use"**
- **Solution:** Change port in `app.py` last line: `app.run(debug=True, port=5001)`

**Problem: "Module not found"**
- **Solution:** Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Problem: PowerShell execution policy error**
- **Solution:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Frontend Issues:

**Problem: "Cannot connect to backend"**
- **Solution:** Make sure backend is running on port 5000
- Check browser console for CORS errors

**Problem: "Icons not showing"**
- **Solution:** Run `npm install` again to ensure lucide-react is installed

**Problem: "Port 3000 already in use"**
- **Solution:** Vite will automatically use next available port (check terminal output)

---

## 🎯 What to Do Next

1. **Test Different Scenarios:**
   - Try different age ranges
   - Test with/without symptoms
   - Enable "Rural Mode" (no hemoglobin input)
   - Submit multiple predictions to populate admin dashboard

2. **Customize (Optional):**
   - Modify colors in `tailwind.config.js`
   - Adjust ML model parameters in `train_model.py`
   - Add more features to the prediction form

3. **Prepare for Hackathon:**
   - Take screenshots of the application
   - Prepare a demo script
   - Document any customizations you made

---

## 📊 Expected First Prediction

When you submit your first prediction, you should see:
- Risk level (Low/Moderate/High)
- Risk score percentage
- Top 5 contributing factors
- Personalized recommendations
- Animated charts

The prediction will also be saved to the database and appear in the admin dashboard!

---

## 🎉 You're All Set!

Your HemoScan AI application is now running and ready to use!

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:3000

Happy coding! 🚀


