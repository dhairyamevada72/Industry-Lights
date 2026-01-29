# AUM CONTROLS & EQUIPMENTS - Industrial Dashboard

Professional 8-channel light automation dashboard for ESP32-WROOM-32D.

## 🚀 Deployment Instructions for Netlify

Since this is a **Vite + TypeScript** project, you cannot simply drag and drop the folder. You must follow these steps to see the styles and logic correctly:

### 1. Link to GitHub (Recommended)
1. Go to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize.
4. Choose the `Industry-Lights` repository.
5. **Set Build Settings**:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. **Set Environment Variables**:
   - Go to **Site Settings** > **Environment variables**.
   - Add all variables from your `.env` file (e.g., `VITE_FIREBASE_API_KEY`, etc.).
7. Click **Deploy site**.

### 2. Manual Build (Drag and Drop)
If you prefer dragging and dropping:
1. Run `npm install` in your local terminal.
2. Run `npm run build`.
3. This will create a folder named **`dist`**.
4. Drag and drop **ONLY the `dist` folder** into Netlify.

## 🛠️ Tech Stack
- **Frontend**: Vite, TypeScript, Vanilla CSS
- **Database**: Firebase Realtime Database
- **Hardware**: ESP32 WROOM 32D

## 🔌 ESP32 Pin Mapping
- Lights 1-8: GPIO `2, 4, 5, 18, 19, 21, 22, 23`

## 🔐 Security
Your API keys and WiFi secrets are stored in `.env` and `esp32_code/secrets.h`. These files are ignored by Git to keep your data safe.
