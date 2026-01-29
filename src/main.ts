import './style.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const lightsGrid = document.getElementById('lights-grid') as HTMLElement;
const activeLightsText = document.getElementById('active-lights') as HTMLElement;
const statsCard = document.getElementById('stats-card') as HTMLElement;
const dbStatus = document.getElementById('db-status') as HTMLElement;

// Light States Tracking
const lightStates = new Array(8).fill(false);

// Generate 8 Light Cards
function createLightCards() {
    lightsGrid.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const card = document.createElement('div');
        card.className = 'control-card glass';
        card.id = `light-card-${i}`;
        card.innerHTML = `
            <div class="card-header">
                <div class="icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 10.5a3 3 0 0 0-6 0v2.5h6v-2.5Z"></path>
                        <path d="M12 13V2m-3 4h6l-3 4Z"></path>
                        <path d="M8 15.5h8v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2Z"></path>
                    </svg>
                </div>
                <h3>Light Unit ${i}</h3>
            </div>
            <div class="card-body">
                <p class="description">Stationary LED control for zone ${i}.</p>
                <div class="switch-container">
                    <span class="status-text" id="light-text-${i}">OFF</span>
                    <label class="switch">
                        <input type="checkbox" id="light-toggle-${i}">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        `;
        lightsGrid.appendChild(card);

        // Add Listeners
        const toggle = document.getElementById(`light-toggle-${i}`) as HTMLInputElement;
        toggle.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const status = target.checked ? 1 : 0;
            set(ref(db, `lights/light_${i}`), status);
        });

        // Setup Realtime Sync for each light
        onValue(ref(db, `lights/light_${i}`), (snapshot) => {
            const val = snapshot.val();
            const isOn = val === 1;
            const text = document.getElementById(`light-text-${i}`) as HTMLElement;
            const toggle = document.getElementById(`light-toggle-${i}`) as HTMLInputElement;
            const lightCard = document.getElementById(`light-card-${i}`) as HTMLElement;

            toggle.checked = isOn;
            text.innerText = isOn ? "ON" : "OFF";
            lightStates[i - 1] = isOn;

            if (isOn) {
                lightCard.classList.add('active');
            } else {
                lightCard.classList.remove('active');
            }
            updateTelemetry();
        });
    }
}

function updateTelemetry() {
    const activeCount = lightStates.filter(state => state).length;
    activeLightsText.innerText = activeCount.toString();

    // Animate telemetry icon if any light is on
    if (activeCount > 0) {
        statsCard.classList.add('active-pulse');
    } else {
        statsCard.classList.remove('active-pulse');
    }

}

// Initial Setup
createLightCards();

const allOnBtn = document.getElementById('all-on') as HTMLButtonElement;
const allOffBtn = document.getElementById('all-off') as HTMLButtonElement;

allOnBtn.addEventListener('click', () => {
    for (let i = 1; i <= 8; i++) {
        set(ref(db, `lights/light_${i}`), 1);
    }
});

allOffBtn.addEventListener('click', () => {
    for (let i = 1; i <= 8; i++) {
        set(ref(db, `lights/light_${i}`), 0);
    }
});

onValue(ref(db, '.info/connected'), (snapshot) => {
    if (snapshot.val() === true) {
        dbStatus.innerText = "Online";
        dbStatus.style.color = "var(--success)"; // Green
    } else {
        dbStatus.innerText = "Offline";
        dbStatus.style.color = "var(--danger)"; // Red
    }
});
