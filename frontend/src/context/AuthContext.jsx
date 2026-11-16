import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tm_user') || 'null'); } catch { return null; }
  });
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    let active = true;
    if (!token) { setChecking(false); return; }
    apiRequest('/auth/me', { token })
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        localStorage.setItem('tm_user', JSON.stringify(data.user));
      })
      .catch(() => {
        if (!active) return;
        setToken(null); setUser(null);
        localStorage.removeItem('tm_token'); localStorage.removeItem('tm_user');
      })
      .finally(() => active && setChecking(false));
    return () => { active = false; };
  }, []);

  const authenticate = (data) => {
    setToken(data.token); setUser(data.user);
    localStorage.setItem('tm_token', data.token);
    localStorage.setItem('tm_user', JSON.stringify(data.user));
  };
  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('tm_token'); localStorage.removeItem('tm_user');
  };
  return <AuthContext.Provider value={{ token, user, checking, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
