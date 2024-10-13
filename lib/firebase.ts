import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAl7wTv7QkXkQWskdXnCu8f-YrDRbAn-zs",
  authDomain: "matrimony-45d7f.firebaseapp.com",
  projectId: "matrimony-45d7f",
  storageBucket: "matrimony-45d7f.appspot.com",
  messagingSenderId: "436275756252",
  appId: "1:436275756252:web:1d633330485f066d8fc819",
  measurementId: "G-DQQK1BRQX7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
