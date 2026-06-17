// Configuración de Firebase para Luminom IA
// Firebase Firestore permite sincronización multi-dispositivo SIN backend

const firebaseConfig = {
  // INSTRUCCIONES: Reemplaza estos valores con tu proyecto de Firebase
  // 1. Ve a https://console.firebase.google.com/
  // 2. Crea un nuevo proyecto llamado "luminom-ia"
  // 3. Agrega una app web
  // 4. Copia la configuración aquí
  
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "luminom-ia.firebaseapp.com",
  projectId: "luminom-ia",
  storageBucket: "luminom-ia.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase (se hace automáticamente al cargar)
let db = null;
let auth = null;

async function initFirebase() {
  try {
    // Importar Firebase desde CDN
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    console.log('✅ Firebase inicializado correctamente');
    return { db, auth, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    // Fallback a localStorage si Firebase falla
    return null;
  }
}

// Sistema de fallback: si Firebase no está configurado, usa localStorage
const USE_FIREBASE = firebaseConfig.apiKey !== "TU_API_KEY_AQUI";

export { initFirebase, USE_FIREBASE };
