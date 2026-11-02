import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  // List all tasks, newest first.
  list: publicProcedure.query(async () => {
    return db.task.findMany({
      orderBy: {
        dataCriacao: "desc",
      },
    });
  }),

  // Create a new task.
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().trim().min(1, "O título é obrigatório"),
        descricao: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.task.create({
        data: {
          titulo: input.titulo,
          descricao: input.descricao?.trim() || null,
        },
      });
    }),

  // Update an existing task.
  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        titulo: z.string().trim().min(1).optional(),
        descricao: z.string().optional(),
      }).refine(
        (data) =>
          data.titulo !== undefined ||
          data.descricao !== undefined,
        "Informe pelo menos um campo para atualizar",
      ),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      try {
        return await db.task.update({
          where: { id },
          data: {
            ...(data.titulo !== undefined && {
              titulo: data.titulo,
            }),
            ...(data.descricao !== undefined && {
              descricao: data.descricao.trim() || null,
            }),
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Tarefa com ID ${id} não encontrada.`,
          });
        }

        throw error;
      }
    }),

  // Delete an existing task.
  delete: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await db.task.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Tarefa com ID ${input.id} não encontrada.`,
          });
        }

        throw error;
      }
    }),
});