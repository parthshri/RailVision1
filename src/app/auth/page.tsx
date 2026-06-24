"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "signup" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword, loginWithGoogle } = useAuth();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");

    try {
      if (mode === "signup") {
        await signup(name, email, password);
        toast.success("Welcome to RailVision.");
        router.push("/profile");
      } else if (mode === "reset") {
        await resetPassword(email);
        toast.success("Password reset email sent.");
        setMode("login");
      } else {
        await login(email, password);
        toast.success("Logged in.");
        router.push("/profile");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-panel">
        <span className="eyebrow">RailVision account</span>
        <h1>{mode === "signup" ? "Create your account." : mode === "reset" ? "Reset password." : "Welcome back."}</h1>
        <form className="form-grid single" onSubmit={submit}>
          {mode === "signup" ? (
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
          ) : null}
          <label>
            Email
            <input required type="email" name="email" placeholder="you@example.com" />
          </label>
          {mode !== "reset" ? (
            <label>
              Password
              <input required type="password" name="password" placeholder="Minimum 6 characters" minLength={6} />
            </label>
          ) : null}
          <button className="button primary" disabled={loading}>
            {mode === "signup" ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Sign Up"
              : mode === "reset"
              ? "Send Reset Email"
              : "Login"}
          </button>

          {mode !== "reset" && (
            <button
              type="button"
              className="button secondary"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  await loginWithGoogle();
                  toast.success("Logged in with Google.");
                  router.push("/profile");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Google sign in failed."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              Continue with Google
            </button>
          )}
        </form>
        <div className="auth-switcher">
          <button onClick={() => setMode("login")}>Login</button>
          <button onClick={() => setMode("signup")}>Sign up</button>
          <button onClick={() => setMode("reset")}>Password reset</button>
        </div>
      </div>
    </section>
  );
}
