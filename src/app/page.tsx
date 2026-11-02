import { TaskList } from "./task-list";
import { HydrateClient, getQueryClient, trpc } from "@/trpc/server";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.task.list.queryOptions(),
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <p className="text-gray-600">
          Gerencie suas tarefas.
        </p>
      </header>

      <HydrateClient>
        <TaskList />
      </HydrateClient>
    </main>
  );
}