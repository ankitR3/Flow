import { create } from 'zustand';
import { Session } from 'next-auth';

interface UserSessionStoreProps {
    session: Session | null;
    setSession: (data: Session | null) => void;
}

export const useUserSessionStore = create<UserSessionStoreProps>((set) => ({
    session: null,
    setSession: (data: Session | null) => set({ session: data})
}))