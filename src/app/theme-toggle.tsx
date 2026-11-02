
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Evita hydration mismatch sem precisar de useEffect + setState.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const options = [
    { value: "light", label: "Claro", icon: "☀" },
    { value: "dark", label: "Escuro", icon: "☾" },
    { value: "system", label: "Sistema", icon: "💻" },
  ] as const;

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          ◐ Tema
        </span>

        <div className="h-10 w-36 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        <span aria-hidden="true">◐</span> Tema
      </span>

      <div
        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        role="group"
        aria-label="Selecionar tema"
      >
        {options.map((option) => {
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-label={`Tema ${option.label}`}
              aria-pressed={isActive}
              title={`Ativar tema ${option.label}`}
              className={`flex items-center justify-center rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-base">
                {option.icon}
              </span>

              <span className="ml-2 hidden sm:inline">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
