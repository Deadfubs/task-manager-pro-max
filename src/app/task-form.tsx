
"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function TaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        setTitulo("");
        setDescricao("");
        setErrorMessage("");

        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );
      },
      onError: (error) => {
        setErrorMessage(error.message);
      },
    }),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!titulo.trim()) {
      setErrorMessage("O título é obrigatório.");
      return;
    }

    setErrorMessage("");

    createTask.mutate({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Nova tarefa
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adicione uma nova atividade à sua lista.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Título *
        </label>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="Ex.: Estudar Next.js"
          maxLength={120}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Descrição
        </label>

        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Descreva sua tarefa..."
          rows={3}
          maxLength={1000}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400"
        >
          {errorMessage}
        </p>
      )}

      {createTask.isSuccess && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400"
        >
          Tarefa criada com sucesso!
        </p>
      )}

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
