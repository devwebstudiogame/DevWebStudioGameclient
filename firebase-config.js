// 🎯 CONFIGURATION CENTRALE FIREBASE (Mise à jour avec vos clés)
const firebaseConfig = {
  apiKey: "AIzaSyAbMfkHNJaUVvIWKX29_fLLGbhG33uFjGg",
  authDomain: "flappy-emoji-467f6.firebaseapp.com",
  databaseURL: "https://flappy-emoji-467f6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flappy-emoji-467f6",
  storageBucket: "flappy-emoji-467f6.firebasestorage.app",
  messagingSenderId: "875937271617",
  appId: "1:875937271617:web:ab7d4bea2c29a48f8e5bc0",
  measurementId: "G-9PS28GCN5C"
};

// Initialisation (Version Compat pour HTML direct)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Fonction utilitaire pour synchroniser les données utilisateur
async function syncUserData(username, pin) {
    const userRef = db.ref('users/' + username);
    const snapshot = await userRef.once('value');
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.pin === pin) {
            // Synchroniser le local avec le serveur
            localStorage.setItem("bestScore", data.bestScore || 0);
            localStorage.setItem("selectedEmoji", data.selectedEmoji || "😁");
            localStorage.setItem("ownedItems", JSON.stringify(data.ownedItems || []));
            localStorage.setItem("selectedPipeSkin", data.selectedPipeSkin || 0);
            localStorage.setItem("selectedGroundSkin", data.selectedGroundSkin || 0);
            localStorage.setItem("seenUnlocks", JSON.stringify(data.seenUnlocks || []));
            return { success: true, status: 'returning', data: data };
        } else {
            return { success: false, status: 'wrong_pin' };
        }
    } else {
        // Nouveau compte
        const newData = {
            pin: pin,
            bestScore: 0,
            selectedEmoji: "😁",
            ownedItems: [],
            selectedPipeSkin: 0,
            selectedGroundSkin: 0,
            seenUnlocks: [],
            createdAt: Date.now()
        };
        await userRef.set(newData);
        return { success: true, status: 'new', data: newData };
    }
}

// Fonction pour sauvegarder n'importe quelle donnée
function cloudSave(key, value) {
    const username = sessionStorage.getItem("currentUsername");
    const pin = sessionStorage.getItem("currentPin");
    if (username && pin) {
        db.ref('users/' + username).update({
            [key]: value,
            lastUpdate: Date.now()
        });
    }
}
