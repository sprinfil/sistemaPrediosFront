import { create } from 'zustand';

const ZustandPrincipal = create((set) => ({
  user: {},
  setUser: (userData) => set({ user: userData }),

  token:"",
  setToken: (tokenTemp) => set({token: tokenTemp})
}));

export default ZustandPrincipal;