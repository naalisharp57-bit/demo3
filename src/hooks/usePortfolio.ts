import { useCallback, useEffect, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";
import { DEFAULT_PORTFOLIO, STORAGE_KEY } from "@/constants/defaultData";

function readStorage(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO;
    const parsed = JSON.parse(raw) as PortfolioData;
    return { ...DEFAULT_PORTFOLIO, ...parsed };
  } catch (error) {
    console.error("Failed to read portfolio data", error);
    return DEFAULT_PORTFOLIO;
  }
}

/**
 * Local-first portfolio store (mocked backend via localStorage).
 * Syncs across tabs and components using a storage event.
 */
export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO);

  useEffect(() => {
    setData(readStorage());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setData(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: PortfolioData) => {
    console.log("Saving portfolio", next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setData(next);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_PORTFOLIO);
  }, []);

  return { data, save, reset };
}
