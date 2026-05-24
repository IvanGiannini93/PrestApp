import { createContext, useState, useCallback } from 'react';

/**
 * Contexto de autenticación.
 * Provee estado de autenticación y funciones de login/logout
 * a toda la aplicación.
 */
export const AuthContext = createContext(null);

/**
 * Proveedor del contexto de autenticación.
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const login = useCallback((tokenValue, userData) => {
    sessionStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
