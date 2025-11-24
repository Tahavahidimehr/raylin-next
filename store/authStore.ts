import { create } from "zustand";
import {User} from "@/types/types";

interface AuthState {
    mobile: string | null;
    otpExpiresAt: number | null;
    role: "user" | "admin";
    authenticated: boolean;
    userData: User | null;

    setMobile: (mobile: string) => void;
    setOtpExpiresAt: (timestamp: number) => void;
    setRole: (role: "user" | "admin") => void;
    setAuthenticated: (value: boolean) => void;
    setUserData: (userData: User | null) => void;
    clearOtp: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    mobile: null,
    otpExpiresAt: null,
    role: "user",
    authenticated: false,
    userData: null,

    setMobile: (mobile) => set({ mobile }),
    setOtpExpiresAt: (otpExpiresAt) => set({ otpExpiresAt }),
    setRole: (role) => set({ role }),
    setAuthenticated: (authenticated) => set({ authenticated }),
    setUserData: (userData) => set({ userData }),
    clearOtp: () => set({ otpExpiresAt: null }),

    logout: () =>
        set({
            userData: null,
            authenticated: false,
            mobile: null,
            otpExpiresAt: null,
            role: "user",
        }),
}));

export const getAuthStore = () => useAuthStore.getState();