import React, { useState } from "react";
import { authService } from "../../services/firebase/authService";
import { useAuth } from "../../hooks/useAuth";
import { AppUser } from "../../../types";

const SignupScreen: React.FC = () => {
  const { setAuthState, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await authService.register(email, password, {
        name,
        role: "patient",
      });

      const appUser: AppUser = {
        uid: user.uid,
        email: user.email ?? undefined,
        name: user.displayName ?? name,
        role: "patient",
        xp: 0,
        streak: 0,
        healthScore: 100,
      };

      setUser(appUser);
      setAuthState("authenticated");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </div>
  );
};

export default SignupScreen;
