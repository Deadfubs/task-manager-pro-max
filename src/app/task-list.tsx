
"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TaskEditForm } from "./task-edit-form";

export function TaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [editingTaskId, setEditingTaskId] = useState<number | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(trpc.task.list.queryOptions());

  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        setFeedback("Tarefa excluída com sucesso!");

        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );
      },
      onError: (error) => {
        setFeedback(`Erro ao excluir tarefa: ${error.message}`);
      },
    }),
  );

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir esta tarefa?",
    );

    if (!confirmed) return;

    setFeedback("");
    deleteTask.mutate({ id });
  }

  if (isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Erro ao carregar tarefas: {error.message}
      </p>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <section className="space-y-3">
        {feedback && (
          <p role="status" className="text-sm text-green-600">
            {feedback}
          </p>
        )}

        <p>Nenhuma tarefa cadastrada.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Minhas tarefas ({tasks.length})
      </h2>

      {feedback && (
        <p
          role="status"
          className={`text-sm ${
            feedback.startsWith("Erro")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {feedback}
        </p>
      )}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-lg border p-4"
          >
            {editingTaskId === task.id ? (
              <TaskEditForm
                task={task}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              <>
                <h3 className="font-semibold">
                  {task.titulo}
                </h3>

                {task.descricao && (
                  <p className="mt-1 text-gray-600">
                    {task.descricao}
                  </p>
                )}

                <small className="mt-2 block text-gray-500">
                  Criada em:{" "}
                  {new Date(task.dataCriacao).toLocaleString("pt-BR")}
                </small>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTaskId(task.id)}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    disabled={deleteTask.isPending}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteTask.isPending
                      ? "Excluindo..."
                      : "Excluir"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
