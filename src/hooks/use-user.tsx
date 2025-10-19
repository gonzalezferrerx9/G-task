// =================================================================================================================================================================
// HOOK: USE-USER (CONTEXTO DE AUTENTICACIÓN)
// =================================================================================================================================================================
'use client';

// =================================================================================================================================================================
// IMPORTACIONES
// =================================================================================================================================================================
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';

// =================================================================================================================================================================
// DEFINICIÓN DEL CONTEXTO
// =================================================================================================================================================================
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

// =================================================================================================================================================================
// COMPONENTE PROVEEDOR DE AUTENTICACIÓN
// =================================================================================================================================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// =================================================================================================================================================================
// EXPORTACIÓN DEL HOOK
// =================================================================================================================================================================
export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un AuthProvider');
  }
  return context;
};
