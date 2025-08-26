import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useUsersStore = create((set, get) => ({
  users: [],

  // Fetch all users
  fetchUsers: async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const usersData = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    set({ users: usersData });
  },

  // Add new user
  addNewUser: async (newUser) => {
    const docRef = await addDoc(collection(db, "users"), newUser);
    set({
      users: [...get().users, { id: docRef.id, ...newUser }],
    });
  },

  // Edit user
  editUser: async (userId, newDetails) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, newDetails);

    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...newDetails } : user
      ),
    }));
  },

  // Delete user
  deleteUser: async (userId) => {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    }));
  },
}));

export default useUsersStore;
