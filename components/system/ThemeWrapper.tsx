"use client";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import {CacheProvider} from "@emotion/react";
import createEmotionCache from "@/lib/createEmotionCache";

const cacheRtl = createEmotionCache(true);

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}