import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { schema } from '@repo/database';
import { DATABASE_TENANT } from '@repo/shared';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject(DATABASE_TENANT)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(employeeId: string, createTodoDto: CreateTodoDto) {
    const { dueDate, ...rest } = createTodoDto;
    const [todo] = await this.db
      .insert(schema.personalTodos)
      .values({
        employeeId,
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      })
      .returning();
    return todo;
  }

  async findAll(employeeId: string) {
    return this.db
      .select()
      .from(schema.personalTodos)
      .where(eq(schema.personalTodos.employeeId, employeeId));
  }

  async findOne(employeeId: string, id: string) {
    const [todo] = await this.db
      .select()
      .from(schema.personalTodos)
      .where(
        and(
          eq(schema.personalTodos.id, id),
          eq(schema.personalTodos.employeeId, employeeId),
        ),
      );

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(employeeId: string, id: string, updateTodoDto: UpdateTodoDto) {
    const { dueDate, ...rest } = updateTodoDto;
    const [todo] = await this.db
      .update(schema.personalTodos)
      .set({
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.personalTodos.id, id),
          eq(schema.personalTodos.employeeId, employeeId),
        ),
      )
      .returning();

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async remove(employeeId: string, id: string) {
    const [todo] = await this.db
      .delete(schema.personalTodos)
      .where(
        and(
          eq(schema.personalTodos.id, id),
          eq(schema.personalTodos.employeeId, employeeId),
        ),
      )
      .returning();

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
