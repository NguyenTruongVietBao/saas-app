'use client';

import { useCallback, useEffect, useState } from 'react';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted: string;
  createdAt: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Use the seeded user ID
  const MOCK_USER_ID = 'ed0bc52f-d808-4696-b261-65914636c4f0';

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/todos?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, MOCK_USER_ID]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos?userId=${MOCK_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTodoTitle,
          description: 'Created from web UI',
          priority: 'MEDIUM',
        }),
      });
      if (res.ok) {
        setNewTodoTitle('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const res = await fetch(
        `${API_URL}/todos/${todo.id}?userId=${MOCK_USER_ID}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: todo.status === 'DONE' ? 'TODO' : 'DONE',
            isCompleted: todo.status === 'DONE' ? 'false' : 'true',
          }),
        },
      );
      if (res.ok) fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}?userId=${MOCK_USER_ID}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-slate-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400">
            Personal Workspace
          </h1>
          <p className="text-slate-400 text-lg">
            Quản lý các tác vụ cá nhân với trải nghiệm cao cấp.
          </p>
        </header>

        {/* Input Card */}
        <div className="mb-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all duration-300">
          <form onSubmit={addTodo} className="flex gap-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Bạn đang nghĩ gì cần làm?..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 outline-hidden focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="submit"
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              Thêm Task
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20 opacity-50 space-y-4">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-white/10 rounded-full animate-spin mx-auto"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-md bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500">
                Danh sách trống. Hãy thêm task đầu tiên của bạn!
              </p>
            </div>
          ) : (
            todos.map((todo, idx) => (
              <div
                key={todo.id}
                className="group relative flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => toggleTodo(todo)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.status === 'DONE'
                        ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'border-white/20 hover:border-emerald-500/50'
                    }`}
                  >
                    {todo.status === 'DONE' && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3
                      className={`text-lg font-medium transition-all ${todo.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-100'}`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-slate-500 mt-1">
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      todo.priority === 'HIGH'
                        ? 'bg-red-500/20 text-red-400'
                        : todo.priority === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {todo.priority}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
