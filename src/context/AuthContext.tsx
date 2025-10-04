import { createContext, useContext } from "react";

export interface User {
  id: string;
  _id: string; // Add _id property for MongoDB compatibility
  username: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { throw new Error("login function not implemented"); },
  logout: () => { },
  register: async () => { },
});

export const useAuth = () => useContext(AuthContext);
