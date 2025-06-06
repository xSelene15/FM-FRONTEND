import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginCliente = (data) => setUser({ tipo: 'cliente', ...data });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginCliente, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}