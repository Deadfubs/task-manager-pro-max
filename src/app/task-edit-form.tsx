
"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

type TaskEditFormProps = {
  task: {
    id: number;
    titulo: string;
    descricao: string | null;
  };
  onCancel: () => void;
};

export function TaskEditForm({
  task,
  onCancel,
}: TaskEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState(task.titulo);
  const [descricao, setDescricao] = useState(
    task.descricao ?? "",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );

        onCancel();
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

    updateTask.mutate({
      id: task.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <input
        type="text"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        placeholder="Título"
        className="w-full rounded-md border p-2"
        required
      />

      <textarea
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
        placeholder="Descrição"
        rows={3}
        className="w-full rounded-md border p-2"
      />

      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={updateTask.isPending}
          className="rounded-md bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
        >
          {updateTask.isPending ? "Salvando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-3 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
