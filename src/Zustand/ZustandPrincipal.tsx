import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ZustandPrincipal = create(
  persist(
    (set) => ({
      user: {},
      setUser: (userData) => set({ user: userData }),

      token: "",
      setToken: (tokenTemp) => set({ token: tokenTemp }),

      modulo: "",
      setModulo: (moduloTemp) => set({ modulo: moduloTemp }),
    }),
    {
      name: 'zustand-storage',
      partialize: (state) => ({ user: state.user, token: state.token, modulo: state.modulo }),
    }
  )
);

export default ZustandPrincipal;
