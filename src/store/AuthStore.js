import { create } from 'zustand';
import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp}from "firebase/firestore"
import { db } from "../firebaseConfig";

const useAuth = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initializing: true, // For Firebase auth state initialization

  // Initialize Firebase auth listener
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userData = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0],
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime
        };
        
        set({ 
          user: userData, 
          isAuthenticated: true, 
          initializing: false,
          error: null 
        });
      } else {
        // User is signed out
        set({ 
          user: null, 
          isAuthenticated: false, 
          initializing: false,
          error: null 
        });
      }
    });

    // Return unsubscribe function
    return unsubscribe;
  },

  // Login with Firebase
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // User data will be set by onAuthStateChanged listener
      set({ isLoading: false });
      
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      return { success: false, error: errorMessage };
    }
  },

 // Signup with Firebase
signup: async (name, email, password, confirmPassword) => {
  set({ isLoading: true, error: null });

  try {
    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // ✅ Save user to Firestore "users" collection
    // (make sure you imported db, doc, setDoc, serverTimestamp from firebase/firestore)
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
      createdAt: serverTimestamp()
    });

    set({ isLoading: false });

    return { success: true, user };
  } catch (error) {
    let errorMessage = 'Signup failed';

    // Handle specific Firebase auth errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      default:
        errorMessage = error.message;
    }

    set({ error: errorMessage, isLoading: false });

    return { success: false, error: errorMessage };
  }
},

// Signup with Firebase
signup: async (name, email, password, confirmPassword) => {
  set({ isLoading: true, error: null });

  try {
    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // ✅ Save user to Firestore "users" collection
    // (make sure you imported db, doc, setDoc, serverTimestamp from firebase/firestore)
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
      createdAt: serverTimestamp()
    });

    set({ isLoading: false });

    return { success: true, user };
  } catch (error) {
    let errorMessage = 'Signup failed';

    // Handle specific Firebase auth errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      default:
        errorMessage = error.message;
    }

    set({ error: errorMessage, isLoading: false });

    return { success: false, error: errorMessage };
  }
},


  // Logout with Firebase
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await signOut(auth);
      // User state will be cleared by onAuthStateChanged listener
      set({ isLoading: false });
      
      return { success: true };
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset auth state (useful for cleanup)
  reset: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false, 
    error: null,
    initializing: true
  })
}));

export default useAuth;