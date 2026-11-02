
"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

type TaskEditFormProps = {
  task: {
    id: number;
    titulo: string;
    descricao: string | null;
  };
  onCancel: () => void;
  onNotify: (
    message: string,
    type: "success" | "error",
  ) => void;
};

export function TaskEditForm({
  task,
  onCancel,
  onNotify,
}: TaskEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState(task.titulo);
  const [descricao, setDescricao] = useState(
    task.descricao ?? "",
  );
  const [titleError, setTitleError] = useState("");

  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );

        onNotify(
          "Tarefa atualizada com sucesso!",
          "success",
        );

        onCancel();
      },
      onError: (error) => {
        onNotify(
          `Erro ao atualizar tarefa: ${error.message}`,
          "error",
        );
      },
    }),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = titulo.trim();

    if (!trimmedTitle) {
      setTitleError("O título é obrigatório.");
      onNotify(
        "Informe um título válido para a tarefa.",
        "error",
      );
      return;
    }

    setTitleError("");

    updateTask.mutate({
      id: task.id,
      titulo: trimmedTitle,
      descricao: descricao.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={`titulo-${task.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Título *
          </label>

          <span className="text-xs text-gray-400">
            {titulo.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>

        <input
          id={`titulo-${task.id}`}
          type="text"
          value={titulo}
          onChange={(event) => {
            setTitulo(event.target.value);

            if (event.target.value.trim()) {
              setTitleError("");
            }
          }}
          placeholder="Título"
          maxLength={TITLE_MAX_LENGTH}
          required
          aria-invalid={!!titleError}
          aria-describedby={
            titleError ? `titulo-error-${task.id}` : undefined
          }
          className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-900 dark:text-gray-100 ${
            titleError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-700"
          }`}
        />

        {titleError && (
          <p
            id={`titulo-error-${task.id}`}
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
            htmlFor={`descricao-${task.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descrição
          </label>

          <span className="text-xs text-gray-400">
            {descricao.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>

        <textarea
          id={`descricao-${task.id}`}
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Descrição"
          rows={3}
          maxLength={DESCRIPTION_MAX_LENGTH}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={updateTask.isPending}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={updateTask.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateTask.isPending
            ? "Salvando..."
            : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
