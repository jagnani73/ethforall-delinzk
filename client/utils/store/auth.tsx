import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  JWE: string | null;
  setJWE: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [JWE, setJWE] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ JWE, setJWE }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
