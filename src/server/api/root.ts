import { createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;