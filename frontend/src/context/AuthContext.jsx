import { createContext, useState, useCallback } from 'react';

/**
 * Contexto de autenticación.
 * Provee estado de autenticación y funciones de login/logout
 * a toda la aplicación. Persiste token y datos del usuario en sessionStorage.
 */
export const AuthContext = createContext(null);

/**
 * Proveedor del contexto de autenticación.
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const login = useCallback((tokenValue, userData) => {
    sessionStorage.setItem('token', tokenValue);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
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
