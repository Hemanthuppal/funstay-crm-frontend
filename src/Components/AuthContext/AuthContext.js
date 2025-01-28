import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);

  const login = (token, role, id, name) => {
    setAuthToken(token);
    setUserRole(role);
    setUserId(id);
    setUserName(name);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id);
    localStorage.setItem('userName', name);
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    setUserId(null);
    setUserName(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  };

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setUserRole(localStorage.getItem('userRole'));
    setUserId(localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, userRole, userId, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
