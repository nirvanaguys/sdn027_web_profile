import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseServices, isAdmin, isFirebaseConfigured } from './firebase';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({ loading: isFirebaseConfigured(), user: null, isAdmin: false }));

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return undefined;
    }
    const { auth } = getFirebaseServices();
    return onAuthStateChanged(auth, (user) => {
      const admin = isAdmin(user);
      if (user && !admin) signOut(auth);
      setState({ loading: false, user: admin ? user : null, isAdmin: admin });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
