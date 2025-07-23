import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "../Context/AuthContext";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "../components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training website",
  description: "Web app for register your workouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Theme accentColor="teal" radius="large">
            <HeroUIProvider>{children}</HeroUIProvider>
          </Theme>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
