# AquaShield Backend

## 1. Install
From the project root:

```powershell
cd server
npm install
```

## 2. Configure MongoDB
Copy `.env.example` to `.env` and set `MONGODB_URI`.

Local MongoDB:
`mongodb://127.0.0.1:27017/aquashield`

MongoDB Atlas: paste your Atlas connection string into `MONGODB_URI`.

## 3. Run
```powershell
npm run dev
```

API: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## API
- `GET /api/readings?station=Monitoring%20Station%2001&limit=100`
- `GET /api/readings/latest?station=Monitoring%20Station%2001`
- `POST /api/readings`
- `DELETE /api/readings?station=Monitoring%20Station%2001`

POST example:
```json
{"station":"Monitoring Station 01","ph":7.2,"tds":268,"temperature":25.8,"source":"simulation"}
```
