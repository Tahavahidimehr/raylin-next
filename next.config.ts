import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["api.raylin.ir", "shop.test"],
  },
};

const withPWAFunc = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === "development",
});

export default withPWAFunc(nextConfig);