import { create } from 'zustand';
import { Session } from 'next-auth';

interface UserSessionStoreProps {
    session: Session | null;
    isLoading: boolean;
    setSession: (data: Session | null) => void;
    setLoading: (loading: boolean) => void
}

export const useUserSessionStore = create<UserSessionStoreProps>((set) => ({
    session: null,
    isLoading: true,
    setSession: (data: Session | null) => set({ session: data, isLoading: false}),
    setLoading: (loading: boolean) => set({ isLoading: loading})
}))