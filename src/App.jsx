// App.jsx
import React, { useEffect } from "react";
import useAuthStore, { initAuth } from "./store/useAuthStore"; // ✅ default + named import
import SignupForm from "./components/auth-folder/SignupForm";
import LoginForm from "./components/auth-folder/LoginForm";
import Form from "./components/form";
import List from "./components/userList";

export default function App() {
  const { user, loading, logout } = useAuthStore();

  useEffect(() => {
    initAuth(); // ✅ runs once
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {user ? (
        <>
          <h1 className="text-xl font-bold">Welcome {user.email}</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          >
            Logout
          </button>

          {/* Protected components */}
          <Form />
          <List />
        </>
      ) : (
        <>
          <SignupForm />
          <LoginForm />
        </>
      )}
    </div>
  );
}
