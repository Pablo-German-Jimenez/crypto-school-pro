import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase.js";
import { AuthContext } from "./auth.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setAuthError("");
      },
      () => {
        setLoading(false);
        setAuthError("No se pudo verificar tu sesión. Comprueba tu conexión e inténtalo de nuevo.");
      },
    );
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
