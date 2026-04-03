import { useEffect, useState } from 'react';

const STORAGE_KEY = 'social-dark-mode';

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}
