import { create } from 'zustand';

const useStore = create((set) => ({
    currency: localStorage.getItem('currency') || 'usd',
    setCurrency: (currency) => set({ currency }),
}));

export default useStore;
