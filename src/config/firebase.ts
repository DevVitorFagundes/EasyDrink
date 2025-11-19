import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAg15Q-IomwVY6DJpMeIwB4in1Rk1oe2QE",
  authDomain: "easy-drink-98593.firebaseapp.com",
  projectId: "easy-drink-98593",
  storageBucket: "easy-drink-98593.firebasestorage.app",
  messagingSenderId: "186296010174",
  appId: "1:186296010174:web:bf564e5207a533d31165ef",
  measurementId: "G-5F0RXEPK4X"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
