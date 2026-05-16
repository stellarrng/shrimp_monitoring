# Shrimp Monitoring

A real-time shrimp tank monitoring dashboard that uses acoustic sensors to track shrimp health, with environmental data pulled from AWS DynamoDB.

## Prerequisites

- Node.js 18+
- npm
- An AWS account with DynamoDB access

## Project structure

```
shrimp_monitoring/
├── backend/    # Express API server (Node.js)
└── frontend/   # React + Vite dashboard
```

## Backend setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:

   ```env
PORT=8000
AWS_REGION=us-east-1
DYNAMODB_TABLE=ShrimpSensorData
AWS_ACCESS_KEY_ID=AKIAU22NXNUV4EKIUOFA
AWS_SECRET_ACCESS_KEY=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
   ```

4. Start the server:

   ```bash
   # Development (auto-reloads on file changes)
   npm run dev

   # Production
   npm start
   ```

   The backend runs at `http://localhost:8000`.

## Frontend setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173` by default.

## API endpoints

| Method | Path               | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/`                | Health check                       |
| GET    | `/api/sensor-data` | Fetch all sensor readings from DynamoDB |
