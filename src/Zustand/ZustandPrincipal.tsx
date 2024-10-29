import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ZustandPrincipal = create(
  persist(
    (set) => ({
      user: {},
      setUser: (userData) => set({ user: userData }),

      token: "",
      setToken: (tokenTemp) => set({ token: tokenTemp }),
    }),
    {
      name: 'zustand-storage', 
      partialize: (state) => ({ user: state.user, token: state.token }), 
    }
  )
);

export default ZustandPrincipal;
