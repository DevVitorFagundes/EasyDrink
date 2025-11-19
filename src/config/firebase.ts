import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAg15Q-IomwVY6DJpMeIwB4in1Rk1oe2QE",
  authDomain: "easy-drink-98593.firebaseapp.com",
  projectId: "easy-drink-98593",
  storageBucket: "easy-drink-98593.firebasestorage.app",
  messagingSenderId: "186296010174",
  appId: "1:186296010174:web:bf564e5207a533d31165ef",
  measurementId: "G-5F0RXEPK4X",
};

const app = initializeApp(firebaseConfig);

let auth: Auth;
try {
  const {getReactNativePersistence} = require("firebase/auth/react-native");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };

export default app;
