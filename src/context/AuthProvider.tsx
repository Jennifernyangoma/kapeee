import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type User } from "./AuthContext";

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages user state, login, logout, and registration functionality.
 * Automatically redirects users after logout to the homepage.
 */

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    
    // Initialize user state from localStorage on app start
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    /**
     * Login function
     * Authenticates user with email and password
     * Stores user data and token in localStorage
     */
    const login = async (email: string, password: string): Promise<User> => {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to login");
        }

        const data = await res.json();

        const loggedInUser: User = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
        };

        // Save user and token
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", data.token);

        return loggedInUser;
    };

    /**
     * Logout function
     * Clears user data and token from localStorage
     * Redirects to homepage after logout
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Redirect to homepage after logout
        navigate('/');
    };

    /**
     * Register function
     * Creates a new user account
     * Automatically logs in the user after successful registration
     */
    const register = async (username: string, email: string, password: string) => {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to register");
        }

        const data = await res.json();

        const newUser: User = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role || "user",
        };

        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", data.token);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
