import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  identifier: string | null;
  setIdentifier: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ sessionId, setSessionId, identifier, setIdentifier }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
