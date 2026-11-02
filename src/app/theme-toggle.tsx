
"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800"
      aria-label="Selecionar tema"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Tema claro"
        aria-pressed={theme === "light"}
        className={`rounded-md px-3 py-2 text-sm ${
          theme === "light"
            ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        Claro
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Tema escuro"
        aria-pressed={theme === "dark"}
        className={`rounded-md px-3 py-2 text-sm ${
          theme === "dark"
            ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        Escuro
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="Tema do sistema"
        aria-pressed={theme === "system"}
        className={`rounded-md px-3 py-2 text-sm ${
          theme === "system"
            ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        Sistema
      </button>
    </div>
  );
}
