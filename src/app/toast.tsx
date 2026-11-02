
"use client";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export function Toast({ message, type, onClose }: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${
        isSuccess
          ? "border-green-200 bg-white text-green-800 dark:border-green-900 dark:bg-gray-900 dark:text-green-400"
          : "border-red-200 bg-white text-red-800 dark:border-red-900 dark:bg-gray-900 dark:text-red-400"
      }`}
    >
      <span className="text-lg" aria-hidden="true">
        {isSuccess ? "✓" : "!"}
      </span>

      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        title="Fechar notificação"
        className="text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
}
