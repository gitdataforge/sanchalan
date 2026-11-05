import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Superadmin" | "Admin" | "Employee";
  isFirstLogin: boolean;
  canUseGoogle: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithPassword: (username: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveSession();
  }, []);

  async function checkActiveSession() {
    try {
      // Real offline logic: Asking the Windows computer if someone is already logged in
      const sessionUser: User | null = await invoke("get_active_session");
      if (sessionUser) {
        setCurrentUser(sessionUser);
      }
    } catch (error) {
      // Safe fallback if the computer cannot read the session file
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithPassword(username: string, pass: string) {
    try {
      // Real offline logic: Verifying the username and password against the secure local database
      const user: User = await invoke("authenticate_user", { username: username, pass: pass });
      setCurrentUser(user);
    } catch (error) {
      throw new Error("Invalid username or password. Please try again.");
    }
  }

  async function loginWithGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Strict enforcement: Only Arun and Palak can use Google Sign-in over the internet
      if (email !== "testcodecfg@gmail.com" && email !== "palakbhsl@outlook.com") {
        await signOut(auth);
        throw new Error("Google login is strictly restricted to company founders. Staff members must use their assigned username and password.");
      }

      // Real offline logic: Telling the Windows computer that the founder has verified their identity online
      const user: User = await invoke("authenticate_google_founder", { email: email });
      setCurrentUser(user);

    } catch (error: any) {
      throw new Error(error.message || "Google internet login failed. Please check your connection.");
    }
  }

  async function logout() {
    try {
      // Real offline logic: Destroying the secure session on the Windows computer
      await invoke("clear_active_session");
      
      const auth = getAuth();
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      setCurrentUser(null);
    } catch (error) {
      throw new Error("Failed to sign out securely. Please restart the application.");
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginWithPassword, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Application security error: Identity check failed. Please restart.");
  }
  return context;
}