"use client";

import * as React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  forcedTheme?: string;
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  forcedTheme,
}: ThemeProviderProps) {
  // Since we're forcing a dark theme only, we just render the children
  // with a className that ensures dark mode
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
} 