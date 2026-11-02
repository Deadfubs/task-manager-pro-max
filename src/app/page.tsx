
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";
import { ThemeToggle } from "./theme-toggle";

import {
  HydrateClient,
  getQueryClient,
  trpc,
} from "@/trpc/server";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.task.list.queryOptions(),
  );

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Task Manager
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas tarefas.
          </p>
        </div>

        <ThemeToggle />
      </header>
      <TaskForm />

      <HydrateClient>
        <TaskList />
      </HydrateClient>
    </main>
  );
}
