// lib/PrintSettingsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PrintSettings {
  showZero: boolean;
  setShowZero: (v: boolean) => void;
}

const PrintSettingsContext = createContext<PrintSettings>({
  showZero: false,
  setShowZero: () => {},
});

export function PrintSettingsProvider({ children }: { children: ReactNode }) {
  const [showZero, setShowZero] = useState(false);
  return (
    <PrintSettingsContext.Provider value={{ showZero, setShowZero }}>
      {children}
    </PrintSettingsContext.Provider>
  );
}

export function usePrintSettings() {
  return useContext(PrintSettingsContext);
}

/**
 * Zero-aware format: returns "" (blank) for 0 when showZero is false,
 * otherwise delegates to the provided formatter.
 */
export function fmtZ(
  value: number,
  showZero: boolean,
  formatter: (n: number) => string
): string {
  if (!showZero && Math.round(value) === 0) return "";
  return formatter(value);
}
