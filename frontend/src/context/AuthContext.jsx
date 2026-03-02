import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            // Check expiry
            if (decoded.exp * 1000 < Date.now()) {
                return null;
            }

            const storedRole = localStorage.getItem('role');
            const storedEmail = localStorage.getItem('email');
            const storedName = localStorage.getItem('name');

            console.log('🔍 getUserFromToken - Stored role:', storedRole);
            console.log('🔍 getUserFromToken - JWT roles:', decoded.roles);
            console.log('🔍 getUserFromToken - JWT role:', decoded.role);

            // Robust role extraction
            // Priority: JWT 'roles' > JWT 'role' > LocalStorage > Default
            let userRole = decoded.roles || decoded.role;

            if (!userRole && storedRole) {
                userRole = storedRole;
                console.log('🔍 Using role from localStorage:', userRole);
            }

            if (!userRole) {
                userRole = 'USER';
            }

            // If it's an array, take the first element
            if (Array.isArray(userRole)) {
                userRole = userRole[0];
            }

            // CRITICAL: Normalize role - remove ROLE_ prefix and handle EVENT_ORGANIZER
            if (typeof userRole === 'string') {
                if (userRole.startsWith('ROLE_')) {
                    userRole = userRole.substring(5);
                }

                // Map EVENT_ORGANIZER to ORGANIZER for internal consistency
                if (userRole === 'EVENT_ORGANIZER') {
                    userRole = 'ORGANIZER';
                }

                // Ensure uppercase for comparison consistency
                userRole = userRole.toUpperCase();
            }

            console.log('🔍 Final normalized role (STRING):', userRole);

            return {
                sub: decoded.sub || storedEmail,
                email: storedEmail || decoded.sub,
                name: storedName || 'User',
                role: userRole,  // Now a single STRING
                organizerStatus: decoded.organizerStatus,
                profileImage: decoded.profileImage
            };
        } catch (error) {
            console.error("Token processing error", error);
            return null;
        }
    };

    useEffect(() => {
        console.log('🔄 AuthContext initializing...');
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            console.log('🔍 Token exists:', !!token);

            if (token) {
                const userData = getUserFromToken(token);
                console.log('🔍 getUserFromToken result:', userData);

                if (userData) {
                    console.log('✅ Setting user with role:', userData.role);
                    console.log('✅ Role is array:', Array.isArray(userData.role));
                    console.log('✅ Role contents:', JSON.stringify(userData.role));
                    setUser(userData);
                } else {
                    console.warn("⚠️ Invalid or expired token on load - clearing auth data");
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('email');
                    localStorage.removeItem('name');
                }
            } else {
                console.log('ℹ️ No token found in localStorage');
            }

            // CRITICAL: Set loading false AFTER all user state logic completes
            console.log('✅ Auth initialization complete, setting loading = false');
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, name, email: userEmail } = response.data;

            console.log('🔐 Login response:', { role, name, userEmail });
            console.log('🔐 Raw role from backend:', role);
            console.log('🔐 Role type:', typeof role);

            // Store token and user details
            localStorage.setItem('token', token);
            localStorage.setItem('role', role); // Backend sends single role string usually
            localStorage.setItem('email', userEmail);
            localStorage.setItem('name', name);

            // Set user state using the consistent helper or direct construction
            // We use the same logic to ensure consistency between login and reload
            const userData = getUserFromToken(token);

            // CRITICAL: Ensure userData.role is ALWAYS a normalized STRING
            if (userData) {
                // If token parsing didn't give us role, use API response as fallback
                if (!userData.role) {
                    console.warn('⚠️ Token had no role claim, using API response role:', role);

                    // Normalize the role from API (remove ROLE_ prefix if present)
                    let normalizedRole = role;
                    if (Array.isArray(normalizedRole)) {
                        normalizedRole = normalizedRole[0]; // Take first if array
                    }
                    if (typeof normalizedRole === 'string' && normalizedRole.startsWith('ROLE_')) {
                        normalizedRole = normalizedRole.substring(5);
                    }

                    // Set as single string
                    userData.role = normalizedRole;
                }

                console.log('👤 User object after login:', JSON.stringify(userData, null, 2));
                console.log('👤 User.role (STRING):', userData.role);
                console.log('👤 User.role type:', typeof userData.role);
            }

            setUser(userData);
            return userData;
        } catch (error) {
            console.error("❌ Login Error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return true;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        setUser(null);
        // We do NOT redirect here to avoid circular loops during initial load check.
        // The UI will redirect based on user state being null.
    };

    const refreshUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const value = {
        user,
        login,
        register,
        logout,
        refreshUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
