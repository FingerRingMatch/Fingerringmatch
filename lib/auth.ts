// lib/auth.ts
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};

export const sendPasswordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};
export const signOut = async () => {
  return await auth.signOut();
};

export { auth };
