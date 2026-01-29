// Firebase Compat (v9) script loading for local file environments
import "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js";

const firebase = window.firebase;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMRmn-8d_Ippfte47ENlGUF9ZWyDkVeOo",
    authDomain: "industrylights.firebaseapp.com",
    databaseURL: "https://industrylights-default-rtdb.firebaseio.com",
    projectId: "industrylights",
    storageBucket: "industrylights.firebasestorage.app",
    messagingSenderId: "1043305180918",
    appId: "1:1043305180918:web:85c7aa288ef13c733746d7"
};

// Initialize Firebase using the Compat mode
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ref = (db, path) => db.ref(path);
const onValue = (ref, callback) => ref.on('value', (snapshot) => callback(snapshot));
const set = (ref, value) => ref.set(value);
const update = (ref, value) => ref.update(value);

// DOM Elements
const ledToggle = document.getElementById('led-toggle');
const ledText = document.getElementById('led-text');
const ledTime = document.getElementById('led-time');
const ledCard = document.getElementById('led-card');

const fanToggle = document.getElementById('fan-toggle');
const fanText = document.getElementById('fan-text');
const fanTime = document.getElementById('fan-time');
const fanCard = document.getElementById('fan-card');
const fanSpeed = document.getElementById('fan-speed');
const speedValue = document.getElementById('speed-value');

const espStatus = document.getElementById('esp-status');
const dbConnStatus = document.getElementById('db-conn');

// Firebase Database References
const ledRef = ref(db, 'light_status');
const fanRef = ref(db, 'devices/fan');
const statsRef = ref(db, 'stats');

// Update UI on Database Changes
onValue(ledRef, (snapshot) => {
    const val = snapshot.val();
    if (val !== null) {
        const isOn = val === 1;
        ledToggle.checked = isOn;
        ledText.innerText = isOn ? "ON" : "OFF";
        ledTime.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isOn) {
            ledCard.classList.add('active');
        } else {
            ledCard.classList.remove('active');
        }
    }
});

onValue(fanRef, (snapshot) => {
    const data = snapshot.val();
    if (data !== null) {
        fanToggle.checked = data.status === "ON";
        fanText.innerText = data.status;
        fanTime.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        fanSpeed.value = data.speed || 0;
        speedValue.innerText = `${data.speed || 0}%`;

        if (data.status === "ON") {
            fanCard.classList.add('fan-active');
        } else {
            fanCard.classList.remove('fan-active');
        }
    }
});

onValue(statsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('temp-val').innerText = `${data.temp || '--'}°C`;
        document.getElementById('hum-val').innerText = `${data.humidity || '--'}%`;
        document.getElementById('pwr-val').innerText = `${data.power || '--'}W`;

        // If stats are being updated, ESP is likely online
        espStatus.innerText = "Online";
        espStatus.className = "value online";
        dbConnStatus.innerText = "DB: Connected";
    }
});

// Event Listeners for Controls
ledToggle.addEventListener('change', (e) => {
    const status = e.target.checked ? 1 : 0;
    console.log("Updating light_status to:", status);

    // Using the helper function defined at the top
    const statusRef = ref(db, '/light_status');
    set(statusRef, status);
});

fanToggle.addEventListener('change', (e) => {
    const status = e.target.checked ? "ON" : "OFF";
    update(fanRef, { status: status, last_changed: Date.now() });
});

fanSpeed.addEventListener('input', (e) => {
    const speed = e.target.value;
    speedValue.innerText = `${speed}%`;
});

fanSpeed.addEventListener('change', (e) => {
    const speed = parseInt(e.target.value);
    update(fanRef, { speed: speed });
});

// Initial Database check
dbConnStatus.innerText = "DB: Connected";
