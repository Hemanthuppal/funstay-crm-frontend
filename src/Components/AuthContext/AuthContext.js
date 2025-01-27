import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const login = (token, role, id) => {
    setAuthToken(token);
    setUserRole(role);
    setUserId(id);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id);
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setUserRole(localStorage.getItem('userRole'));
    setUserId(localStorage.getItem('userId'));
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
