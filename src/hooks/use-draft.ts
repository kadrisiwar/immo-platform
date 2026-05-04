import { useCallback, useEffect, useState } from "react";

export function useDraft<T>(key: string, initial: T) {
  const storageKey = `draft_${key}`;

  const [data, setData]           = useState<T>(initial);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loaded, setLoaded]       = useState(false);

  // Load من localStorage بعد mount فقط
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setData(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  // Auto-save كل 10 ثواني
  useEffect(() => {
    if (!loaded) return;
    const timer = setInterval(() => {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setLastSaved(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, [data, storageKey, loaded]);

  const save = useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setLastSaved(new Date());
  }, [data, storageKey]);

  const clear = useCallback(() => {
    localStorage.removeItem(storageKey);
    setData(initial);
    setLastSaved(null);
  }, [storageKey]);

  const hasDraft = useCallback(() => {
    try {
      return !!localStorage.getItem(storageKey);
    } catch {
      return false;
    }
  }, [storageKey]);

  return { data, setData, save, clear, lastSaved, loaded, hasDraft };
}