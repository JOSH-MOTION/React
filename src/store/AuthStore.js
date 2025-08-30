import { create } from 'zustand';
import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Cloudinary configuration
// Note: Replace 'your-actual-cloud-name' with your real Cloudinary cloud name (not API key)
const CLOUDINARY_CLOUD_NAME = 'dlng6dqtl'; // This should be your cloud name, not the API key
const CLOUDINARY_UPLOAD_PRESET = 'foodshare_uploads'; // Your upload preset

const useAuth = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initializing: true,
  uploadingImage: false, // New state for image upload

  // Cloudinary image upload function
  uploadImageToCloudinary: async (file) => {
    console.log('🔄 Starting Cloudinary upload...');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('📡 Cloudinary response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Cloudinary upload successful:', data);
      
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update user profile picture
  updateProfilePicture: async (imageFile) => {
    const { user } = get();
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    console.log('🔄 Updating profile picture for user:', user.id);
    set({ uploadingImage: true, error: null });

    try {
      // Upload image to Cloudinary
      const uploadResult = await get().uploadImageToCloudinary(imageFile);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      console.log('✅ Image uploaded to Cloudinary:', uploadResult.url);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        photoURL: uploadResult.url
      });
      console.log('✅ Firebase Auth profile updated');

      // Update Firestore document
      await updateDoc(doc(db, "people", user.id), {
        photoURL: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Firestore document updated');

      // Update local state
      set(state => ({
        user: {
          ...state.user,
          photoURL: uploadResult.url
        },
        uploadingImage: false
      }));

      return { 
        success: true, 
        url: uploadResult.url,
        publicId: uploadResult.publicId 
      };

    } catch (error) {
      console.error('❌ Profile picture update failed:', error);
      set({ 
        error: error.message, 
        uploadingImage: false 
      });
      
      return { success: false, error: error.message };
    }
  },

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

    return unsubscribe;
  },

  // Login with Firebase
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      set({ isLoading: false });
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Login failed';
      
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
      
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Signup with Firebase and optional profile picture
  signup: async (name, email, password, confirmPassword, profileImage = null) => {
    set({ isLoading: true, error: null });
    console.log('🔄 Starting signup process...');

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
      console.log('🔄 Creating Firebase Auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase Auth user created:', user.uid);

      let photoURL = null;
      let cloudinaryPublicId = null;

      // Upload profile image if provided
      if (profileImage) {
        console.log('🔄 Uploading profile image...');
        set({ uploadingImage: true });
        
        const uploadResult = await get().uploadImageToCloudinary(profileImage);
        
        if (uploadResult.success) {
          photoURL = uploadResult.url;
          cloudinaryPublicId = uploadResult.publicId;
          console.log('✅ Profile image uploaded:', photoURL);
        } else {
          console.warn('⚠️ Profile image upload failed:', uploadResult.error);
          // Continue with signup even if image upload fails
        }
        set({ uploadingImage: false });
      }

      // Update the user's display name and photo
      console.log('🔄 Updating Firebase Auth profile...');
      await updateProfile(user, { 
        displayName: name,
        photoURL: photoURL 
      });
      console.log('✅ Firebase Auth profile updated');

      // Save user to Firestore "people" collection
      console.log('🔄 Saving user to Firestore...');
      await setDoc(doc(db, "people", user.uid), {
        id: user.uid,
        name,
        email,
        photoURL,
        cloudinaryPublicId,
        createdAt: serverTimestamp()
      });
      console.log('✅ User saved to Firestore');

      set({ isLoading: false });
      return { success: true, user };

    } catch (error) {
      console.error('❌ Signup failed:', error);
      let errorMessage = 'Signup failed';

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

      set({ error: errorMessage, isLoading: false, uploadingImage: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout with Firebase
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await signOut(auth);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset auth state
  reset: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false, 
    error: null,
    initializing: true,
    uploadingImage: false
  })
}));

export default useAuth;