// src/ui/TodoUI.js
import AppState from '../AppState.js';
import { getCurrentProjectId } from './ProjectUI.js';
import { format, isPast, isToday } from 'date-fns';

const renderTodos = (projectId) => {
   console.log('renderTodos called with:', projectId); 
  const list = document.querySelector('#todo-list');
  const todos = AppState.getTodosForProject(projectId);
    console.log('todos found:', todos);  

  list.innerHTML = ''; // clear before re-rendering

  if (todos.length === 0) {
    list.innerHTML = '<p style="color:#9ca3af">No todos yet. Add one!</p>';
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add('todo-item', `todo-item--${todo.priority}`);
    if (todo.complete) li.classList.add('complete');

    // --- Checkbox ---
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.complete;
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      AppState.toggleComplete(todo.id);
      renderTodos(projectId);
    });

    // --- Title ---
    const title = document.createElement('span');
    title.classList.add('todo-item__title');
    title.textContent = todo.title;

    // --- Due Date (formatted with date-fns) ---
    const due = document.createElement('span');
    due.classList.add('todo-item__due');

    if (todo.dueDate) {
      const dateObj = new Date(todo.dueDate + 'T00:00:00'); // avoid timezone shift
      const formatted = isToday(dateObj)
        ? 'Today'
        : format(dateObj, 'MMM d, yyyy');

      due.textContent = formatted;

      // Turn red if overdue and not complete
      if (isPast(dateObj) && !isToday(dateObj) && !todo.complete) {
        due.classList.add('todo-item__due--overdue');
      }
    }

    // --- Delete Button ---
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('todo-item__delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AppState.deleteTodo(todo.id);
      renderTodos(projectId);
    });

    // --- Clicking the card opens the detail/edit modal ---
    li.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('openTodo', {
        detail: { todoId: todo.id }
      }));
    });

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(due);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
};

const initTodoUI = () => {
  // Listen for project switches from ProjectUI
  document.addEventListener('projectChanged', (e) => {
    renderTodos(e.detail.projectId);
  });

  // Render todos for the default project on load
  const projectId = getCurrentProjectId();
  renderTodos(projectId);
};

export { initTodoUI, renderTodos };