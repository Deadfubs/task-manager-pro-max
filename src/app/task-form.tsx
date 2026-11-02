
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-5">
      <h2 className="text-xl font-semibold">
        Nova tarefa
      </h2>

      <div className="space-y-1">
        <label htmlFor="titulo" className="block text-sm font-medium">
          Título *
        </label>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="Ex.: Estudar Next.js"
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="descricao" className="block text-sm font-medium">
          Descrição
        </label>

        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Descreva sua tarefa..."
          rows={3}
          className="w-full rounded-md border p-2"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {createTask.isSuccess && (
        <p className="text-sm text-green-600">
          Tarefa criada com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={createTask.isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {createTask.isPending ? "Salvando..." : "Criar tarefa"}
      </button>
    </form>
  );
}
