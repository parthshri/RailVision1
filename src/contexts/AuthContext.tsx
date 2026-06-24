"use client";

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth, db, googleProvider } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function adminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && db) {
        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error(
            "Failed to save user to Firestore:",
            error
          );
        }
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,

      isAdmin: Boolean(
        user?.email &&
          adminEmails().includes(user.email.toLowerCase())
      ),

      async signup(name, email, password) {
        if (!auth || !db) {
          throw new Error(
            "Firebase is not configured yet."
          );
        }

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        await updateProfile(credential.user, {
          displayName: name,
        });

        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            uid: credential.user.uid,
            name,
            email,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      },

      async login(email, password) {
        if (!auth) {
          throw new Error(
            "Firebase is not configured yet."
          );
        }

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      },

      async loginWithGoogle() {
        if (!auth || !db || !googleProvider) {
          throw new Error(
            "Google authentication is not configured."
          );
        }

        const result = await signInWithPopup(
          auth,
          googleProvider
        );

        await setDoc(
          doc(db, "users", result.user.uid),
          {
            uid: result.user.uid,
            email: result.user.email || "",
            displayName:
              result.user.displayName || "",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      },

      async resetPassword(email) {
        if (!auth) {
          throw new Error(
            "Firebase is not configured yet."
          );
        }

        await sendPasswordResetEmail(
          auth,
          email
        );
      },

      logout() {
        if (!auth) {
          return Promise.resolve();
        }

        return signOut(auth);
      },
    }),
    [loading, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}