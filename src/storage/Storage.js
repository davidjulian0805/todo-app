// src/storage/Storage.js
import Todo from '../models/Todo.js';
import Project from '../models/Project.js';

const STORAGE_KEY = 'todo-app-data';

const Storage = {
  save({ projects, todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, todos }));
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { projects: [], todos: [] };

      const { projects: rawProjects, todos: rawTodos } = JSON.parse(raw);

      // Rehydrate: restore class instances so methods work
      const projects = rawProjects.map(p => Object.assign(new Project(p.name), p));
      const todos = rawTodos.map(t => Object.assign(new Todo(t), t));

      return { projects, todos };
    } catch (e) {
      console.warn('Failed to load from localStorage, starting fresh.', e);
      return { projects: [], todos: [] };
    }
  }
};

export default Storage;