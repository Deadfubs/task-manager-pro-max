
"use client";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TaskEditForm } from "./task-edit-form";
import { ConfirmDialog } from "./confirm-dialog";
import { Toast } from "./toast";

export function TaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(trpc.task.list.queryOptions());

  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Controla o fechamento automático das notificações.
  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [toast]);

  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        setToast({
          message: "Tarefa excluída com sucesso!",
          type: "success",
        });

        setTaskToDelete(null);

        await queryClient.invalidateQueries(
          trpc.task.list.queryFilter(),
        );
      },
      onError: (error) => {
        setToast({
          message: `Erro ao excluir tarefa: ${error.message}`,
          type: "error",
        });
      },
    }),
  );

  function handleDelete() {
    if (taskToDelete === null) return;

    deleteTask.mutate({ id: taskToDelete });
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        Carregando tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
        Erro ao carregar tarefas: {error.message}
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Minhas tarefas
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {tasks?.length ?? 0} tarefas
        </span>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {!tasks || tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Nenhuma tarefa cadastrada
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Utilize o formulário acima para criar sua primeira tarefa.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900"
            >
              {editingTaskId === task.id ? (
                <TaskEditForm
                  task={task}
                  onCancel={() => setEditingTaskId(null)}
                  onNotify={(message, type) => {
                    setToast({ message, type });
                  }}
                />
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {task.titulo}
                    </h3>

                    {task.descricao && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {task.descricao}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                      Criada em:{" "}
                      {new Date(task.dataCriacao).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(task.id)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task.id)}
                      disabled={deleteTask.isPending}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
      )}

      {taskToDelete !== null && (
        <ConfirmDialog
          title="Excluir tarefa?"
          description="Essa ação é permanente e não poderá ser desfeita. Tem certeza de que deseja excluir esta tarefa?"
          confirmLabel="Sim, excluir"
          isLoading={deleteTask.isPending}
          onConfirm={handleDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </section>
  );
}
