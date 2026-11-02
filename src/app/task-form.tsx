
"use client";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Toast } from "./toast";

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

export function TaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [titleError, setTitleError] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Controla o tempo de exibição da notificação.
  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [toast]);

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        setTitulo("");
        setDescricao("");
        setTitleError("");

        setToast({
          message: "Tarefa criada com sucesso!",
          type: "success",
        });

        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );
      },
      onError: (error) => {
        setToast({
          message: `Erro ao criar tarefa: ${error.message}`,
          type: "error",
        });
      },
    }),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = titulo.trim();

    if (!trimmedTitle) {
      setTitleError("O título é obrigatório.");
      setToast({
        message: "Informe um título válido para a tarefa.",
        type: "error",
      });
      return;
    }

    setTitleError("");
    setToast(null);

    createTask.mutate({
      titulo: trimmedTitle,
      descricao: descricao.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h2 className="text-xl font-semibold">
          Nova tarefa
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adicione uma nova atividade à sua lista.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Título *
          </label>

          <span className="text-xs text-gray-400">
            {titulo.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => {
            setTitulo(event.target.value);

            if (event.target.value.trim()) {
              setTitleError("");
            }
          }}
          placeholder="Ex.: Estudar Next.js"
          maxLength={TITLE_MAX_LENGTH}
          required
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "titulo-error" : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
            titleError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-700"
          }`}
        />

        {titleError && (
          <p
            id="titulo-error"
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {titleError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descrição
          </label>

          <span className="text-xs text-gray-400">
            {descricao.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>

        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Descreva sua tarefa..."
          rows={3}
          maxLength={DESCRIPTION_MAX_LENGTH}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={createTask.isPending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createTask.isPending ? "Salvando..." : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}
