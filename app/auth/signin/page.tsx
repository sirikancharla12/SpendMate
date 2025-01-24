"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize router

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/users",
    });

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      setError("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>Sign In</h1>
      <form
        onSubmit={handleCredentialsSignIn}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          marginBottom: "20px",
        }}
      >
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}
        <label htmlFor="email" style={{ marginBottom: "5px" }}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          style={{
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          required
        />
        <label htmlFor="password" style={{ marginBottom: "5px" }}>
          Password:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign in with Email
        </button>
      </form>
      <p>Or sign in with:</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => signIn("google", { callbackUrl: "/users" })}
          style={{
            padding: "10px",
            backgroundColor: "#db4437",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Google
        </button>
      </div>
    </div>
  );
}
