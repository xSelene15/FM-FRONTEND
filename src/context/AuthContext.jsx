import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Intenta cargar el usuario desde localStorage al iniciar
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const loginCliente = (data) => {
    const userData = { tipo: 'cliente', ...data };
    setUser(userData); 
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginEmpleado = (data) => {
    const userData = { tipo: 'empleado', ...data };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Si quieres sincronizar el estado si cambia localStorage en otra pestaña:
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginCliente, loginEmpleado, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}