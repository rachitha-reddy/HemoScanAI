# Quick Setup Guide

## 🚀 Quick Start (Windows)

### Backend Setup (Terminal 1)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Train the model (run this first time only)
python train_model.py

# Start the server
python app.py
```

Backend will run on: `http://localhost:5000`

### Frontend Setup (Terminal 2)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## ✅ Verification

1. Open browser to `http://localhost:3000`
2. You should see the HemoScan AI landing page
3. Click "Start Risk Assessment" to test the prediction form
4. Visit `/admin` to see the admin dashboard

## 🐛 Troubleshooting

### Backend Issues

- **Model not found**: Run `python train_model.py` first
- **Port 5000 already in use**: Change port in `app.py` (last line)
- **Module not found**: Make sure virtual environment is activated and dependencies are installed

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically use the next available port
- **Cannot connect to backend**: Make sure backend is running on port 5000
- **Icons not showing**: Run `npm install` to ensure all dependencies are installed

## 📝 Notes

- First time setup: Train the model before starting the server
- Database is created automatically on first run
- All predictions are stored in `hemoscan.db`


