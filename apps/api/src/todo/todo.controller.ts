import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Query('userId') userIdQuery?: string,
  ) {
    const userId = userIdQuery || 'ed0bc52f-d808-4696-b261-65914636c4f0'; // Use newly generated ID as default
    return this.todoService.create(userId, createTodoDto);
  }

  @Get()
  findAll(@Query('userId') userIdQuery?: string) {
    const userId = userIdQuery || 'ed0bc52f-d808-4696-b261-65914636c4f0';
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userIdQuery?: string) {
    const userId = userIdQuery || 'ed0bc52f-d808-4696-b261-65914636c4f0';
    return this.todoService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Query('userId') userIdQuery?: string,
  ) {
    const userId = userIdQuery || 'ed0bc52f-d808-4696-b261-65914636c4f0';
    return this.todoService.update(userId, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userIdQuery?: string) {
    const userId = userIdQuery || 'ed0bc52f-d808-4696-b261-65914636c4f0';
    return this.todoService.remove(userId, id);
  }
}
