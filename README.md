# Fuelnomic Project

This repository contains the source code for **Fuelnomic**, a comprehensive fuel subsidy management system developed as a Final Year Project (FYP).

The project is structured as a **Monorepo**, containing the Mobile App, Web Dashboard, and Backend API in a single repository.

## 📂 Project Structure

```text
fuelnomic/
├── mobile/      # User-side Mobile App (React Native + Expo)
├── web/         # Company-side Admin Dashboard (React + Vite)
└── backend/      # Shared Backend API (Node.js + Express)
```
## 🛠 Tech Stack
- **Mobile:** React Native (Expo)
- **Web:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Supabase / PostgreSQL

## Installation

Since this is a monorepo, you must install dependencies for each folder separately.

### Backend Setup

```bash
cd backend
npm install
cd ..
```

### Web Dashboard Setup

```bash
cd web-app
npm install
cd ..
```

### Mobile app Setup

```bash
cd mobile
npm install
cd ..
```

## How to Run

You will likely need three separate terminal windows open to run the full stack.

### Terminal 1: Backend (Server)

```bash
cd backend
node index.js
# Server usually runs on http://localhost:5000
```

### Terminal 2: Web Dashboard

```bash
cd web-app
npm run dev
# Opens the admin panel in your browser
```

### Terminal 3: Mobile App

```bash
cd mobile
npx expo start
# Scan the QR code with your phone (Expo Go)
```

