import type { PrismaClient } from "@prisma/client";

import type { CommentRepository } from "@/core/domain/repositories/commentRepository";

import { commentInclude } from "../mappers/selects";

export class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: commentInclude,
      orderBy: { createdAt: "asc" },
    });
  }

  findById(commentId: string) {
    return this.prisma.comment.findUnique({ where: { id: commentId }, include: commentInclude });
  }

  create(taskId: string, authorId: string, body: string) {
    return this.prisma.comment.create({
      data: { taskId, authorId, body },
      include: commentInclude,
    });
  }

  updateBody(commentId: string, body: string) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { body, editedAt: new Date() },
      include: commentInclude,
    });
  }

  async delete(commentId: string) {
    await this.prisma.comment.delete({ where: { id: commentId } });
  }
}
