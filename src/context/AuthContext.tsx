import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // =====================================
  // GET USER FROM LOCAL STORAGE
  // =====================================

  const [user, setUser] =
    useState<User | null>(() => {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        return JSON.parse(storedUser);
      }

      return null;
    });

  // =====================================
  // LOGIN
  // =====================================

  const login = (userData: User) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    // Tell CartContext user changed
    window.dispatchEvent(
      new Event("userChanged")
    );
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    // Clear React state
    setUser(null);

    // Remove logged-in user
    localStorage.removeItem("user");

    // Tell CartContext user changed
    window.dispatchEvent(
      new Event("userChanged")
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================
// USE AUTH
// =====================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}