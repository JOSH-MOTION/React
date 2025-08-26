// src/store/authStore.js
import { create } from "zustand";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
   onAuthStateChanged,
} from "firebase/auth";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  signup: async (email, password, extraData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // create user profile in Firestore under "users"
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      ...extraData,
      createdAt: new Date(),
    });

    set({ user });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  
}));
// 👇 This function sets up a listener to keep Zustand store in sync
export const initAuth = () => {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.setState({ user, loading: false });
  });
};




export default useAuthStore;