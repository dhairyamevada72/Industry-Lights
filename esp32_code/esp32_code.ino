/**
 * IndustryLights Industrial Automation
 * Device: ESP-WROOM-32D
 * Controls: 8-Channel Industrial Lights
 */

#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info.
#include "addons/RTDBHelper.h"

#include "secrets.h"

// 1. Define WiFi credentials
// (Already defined in secrets.h)

// 2. Define Firebase API Key and RTDB URL
// (Already defined in secrets.h)

// Define Pins for 8 Lights
const int lightPins[8] = {2, 4, 5, 18, 19, 21, 22, 23};
int lastStates[8] = {-1, -1, -1, -1, -1, -1, -1, -1}; // To track changes

// Firebase Data objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  
  // Initialize all light pins as outputs
  for(int i = 0; i < 8; i++) {
    pinMode(lightPins[i], OUTPUT);
    digitalWrite(lightPins[i], LOW);
  }

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConnected!");

  // Use Database Secret for authentication to fix the 'INVALID_EMAIL' error
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  Serial.println("Firebase Initialized with Database Secret");
}

void loop() {
  if (Firebase.ready()) {
    
    // Check all 8 lights
    for (int i = 0; i < 8; i++) {
      char path[35];
      sprintf(path, "/lights/light_%d", i + 1);
      
      if (Firebase.RTDB.getInt(&fbdo, path)) {
        if (fbdo.dataType() == "int") {
            int currentStatus = fbdo.intData();
            
            // Apply status to physical pin
            digitalWrite(lightPins[i], currentStatus == 1 ? HIGH : LOW);
            
            // Print to Serial ONLY if the status changed
            if (currentStatus != lastStates[i]) {
                Serial.print("Light ");
                Serial.print(i + 1);
                Serial.print(" Changed to: ");
                Serial.println(currentStatus == 1 ? "ON" : "OFF");
                lastStates[i] = currentStatus;
            }
        }
      }
    }
    
    // Sync telemetry to database (Optional: helps confirm connectivity)
    // Firebase.RTDB.setFloat(&fbdo, "/stats/esp_connected_ms", millis());
    
    // Delay to prevent hammering the DB (100ms is OK for lights)
    delay(100);
  }
}
