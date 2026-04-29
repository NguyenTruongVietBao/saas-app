import 'dotenv/config';
import {
  boolean,
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// --- DATABASE SCHEMA DEFINITIONS ---

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').unique().notNull(),
  schemaName: text('schema_name').unique().notNull(),
  plan: text('plan').default('free').notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  role: text('role').default('MEMBER').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});



export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  titleI18n: jsonb('title_i18n').notNull(),
  contentI18n: jsonb('content_i18n').notNull(),
  tags: jsonb('tags'),
  status: text('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogsGlobal = pgTable('audit_logs_global', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  actor: text('actor').default('system').notNull(),
  action: text('action').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tenant schema tables
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  departmentId: uuid('department_id').references(() => departments.id),
  employeeCode: text('employee_code').unique().notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').default('STAFF').notNull(),
  status: text('status').default('ACTIVE').notNull(),
  hireDate: date('hire_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  departmentId: uuid('department_id').references(() => departments.id),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectMembers = pgTable('project_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id)
    .notNull(),
  employeeId: uuid('employee_id')
    .references(() => employees.id)
    .notNull(),
  role: text('role').default('MEMBER').notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id)
    .notNull(),
  assigneeId: uuid('assignee_id').references(() => employees.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('TODO').notNull(),
  priority: text('priority').default('MEDIUM').notNull(),
  labels: jsonb('labels'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .references(() => employees.id)
    .notNull(),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id').notNull(),
  beforeState: jsonb('before_state'),
  afterState: jsonb('after_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const personalTodos = pgTable('personal_todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .references(() => employees.id)
    .notNull(),
  title: text('title').notNull(),
  status: text('status').default('TODO').notNull(),
  priority: text('priority').default('MEDIUM').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const publicSchema = {
  organizations,
  users,
  organizationMembers,
  blogPosts,
  auditLogsGlobal,
};

export const tenantSchema = {
  departments,
  employees,
  projects,
  projectMembers,
  tasks,
  auditLogs,
  personalTodos,
};

export const schema = {
  ...publicSchema,
  ...tenantSchema,
};
