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
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Task Manager
            </h1>

            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Organize suas tarefas e acompanhe seu progresso.
            </p>
          </div>

          <ThemeToggle />
        </header>

        <TaskForm />

        <HydrateClient>
          <TaskList />
        </HydrateClient>
      </div>
    </main>
  );
}