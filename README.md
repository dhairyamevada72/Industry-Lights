# IndustryLights Industrial Automation

This project implements a smart industrial control dashboard for ESP32 (WROOM 32D) using Firebase Realtime Database.

## 🚀 Features
- **Premium UI**: Glassmorphism design with industrial aesthetics.
- **Bi-directional Control**: Toggle LED and Fan from the web and see real-time updates.
- **Telemetry**: Simulated real-time sensors (Temperature, Humidity, Power).
- **Responsive**: Works on mobile and desktop.

## 🛠️ Setup Instructions

### 1. Firebase Configuration
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project **industrylights**.
3. Go to **Realtime Database** > **Rules**.
4. Copy the content of `Firebase_Rules.json` and publish.
   ```json
   {
     "rules": {
       ".read": "true",
       ".write": "true"
     }
   }
   ```
5. Note: For production, use more restrictive rules.

### 2. ESP32 (WROOM 32D)
1. Open `esp32_code/esp32_code.ino` in Arduino IDE.
2. Install the **Firebase ESP Client** library by Mobizt.
3. Update `WIFI_SSID` and `WIFI_PASSWORD` in the code.
4. Select board **DOIT ESP32 DEVKIT V1** or similar.
5. Upload the code.

### 3. Web Dashboard
1. Open `index.html` in your browser.
2. Use the toggles to control your ESP32.
3. Watch the fan rotate and the LED status update in real-time.

---
Developed for Dhairya Industrial Code.
