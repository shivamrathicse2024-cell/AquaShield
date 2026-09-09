# AquaShield — Smart Water Monitoring

A hackathon-ready React dashboard with a Node/Express + MongoDB backend. The UI can run in demo mode without the backend, and automatically saves simulated readings when the API/database is available.

## Frontend
```powershell
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

## Backend + MongoDB
Open a second PowerShell in the project root:

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

Set `MONGODB_URI` in `server/.env` to either a local MongoDB instance or a MongoDB Atlas connection string.

Backend API: `http://localhost:5000`
Health: `http://localhost:5000/api/health`

The frontend defaults to `http://localhost:5000/api`. To change it, create a root `.env` with:
```env
VITE_API_URL=http://localhost:5000/api
```

## Data flow
pH/TDS/temperature sensor → ESP32/controller → REST API → MongoDB → AquaShield React dashboard.

The current simulator generates readings until real hardware is connected.
