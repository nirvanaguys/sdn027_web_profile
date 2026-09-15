import { createContext } from 'react';

export const AuthContext = createContext({ loading: true, user: null, isAdmin: false });
