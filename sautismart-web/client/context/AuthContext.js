import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:5000/api');

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize token and user state on component mount
  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedToken = localStorage.getItem('sautismart_token');
        const storedUser = localStorage.getItem('sautismart_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Verify token validity with backend /api/auth/me
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('sautismart_user', JSON.stringify(data.user));
          } else {
            // Token expired or invalid
            logout();
          }
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadStoredUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please check credentials.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sautismart_token', data.token);
    localStorage.setItem('sautismart_user', JSON.stringify(data.user));

    return data.user;
  };

  // Signup handler
  const signup = async ({ name, email, password, role }) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sautismart_token', data.token);
    localStorage.setItem('sautismart_user', JSON.stringify(data.user));

    return data.user;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sautismart_token');
    localStorage.removeItem('sautismart_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
