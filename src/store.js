import { create } from 'zustand';

const useStore = create((set) => ({
    currency: 'usd',
    setCurrency: (currency) => set({ currency: currency }),
}));

export default useStore;
