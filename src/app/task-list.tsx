"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function TaskList() {
  const trpc = useTRPC();

  const { data: tasks, isLoading, error } = useQuery(
    trpc.task.list.queryOptions(),
  );

  if (isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar tarefas: {error.message}</p>;
  }

  if (!tasks || tasks.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-lg border p-4"
        >
          <h2 className="font-semibold">{task.titulo}</h2>

          {task.descricao && (
            <p className="text-gray-600">{task.descricao}</p>
          )}

          <small className="text-gray-500">
            Criada em: {new Date(task.dataCriacao).toLocaleString("pt-BR")}
          </small>
        </li>
      ))}
    </ul>
  );
}