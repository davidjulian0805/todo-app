// src/ui/ModalUI.js
import AppState from '../AppState.js';
import { getCurrentProjectId } from './ProjectUI.js';
import { renderTodos } from './TodoUI.js';

let editingTodoId = null; // tracks if we're editing or adding

const openModal = (mode = 'add', todo = null) => {
  const overlay = document.querySelector('#modal-overlay');
  const modalTitle = document.querySelector('#modal-title');
  const confirmBtn = document.querySelector('#modal-confirm-btn');

  editingTodoId = null;

  if (mode === 'edit' && todo) {
    // Pre-fill the form with the todo's existing data
    editingTodoId = todo.id;
    modalTitle.textContent = 'Edit Todo';
    confirmBtn.textContent = 'Save Changes';

    document.querySelector('#input-title').value = todo.title;
    document.querySelector('#input-description').value = todo.description || '';
    document.querySelector('#input-due-date').value = todo.dueDate || '';
    document.querySelector('#input-priority').value = todo.priority;
    document.querySelector('#input-notes').value = todo.notes || '';
  } else {
    // Clear the form for a new todo
    modalTitle.textContent = 'Add Todo';
    confirmBtn.textContent = 'Add Todo';

    document.querySelector('#input-title').value = '';
    document.querySelector('#input-description').value = '';
    document.querySelector('#input-due-date').value = '';
    document.querySelector('#input-priority').value = 'low';
    document.querySelector('#input-notes').value = '';
  }

  overlay.classList.remove('hidden');
  document.querySelector('#input-title').focus();
};

const closeModal = () => {
  document.querySelector('#modal-overlay').classList.add('hidden');
  editingTodoId = null;
};

const collectFormData = () => ({
  title: document.querySelector('#input-title').value.trim(),
  description: document.querySelector('#input-description').value.trim(),
  dueDate: document.querySelector('#input-due-date').value,
  priority: document.querySelector('#input-priority').value,
  notes: document.querySelector('#input-notes').value.trim(),
  projectId: getCurrentProjectId(),
});

const initModalUI = () => {
  // Open modal for adding a new todo
  document.querySelector('#add-todo-btn').addEventListener('click', () => {
    openModal('add');
  });

  // Open modal for editing when a todo card is clicked
  document.addEventListener('openTodo', (e) => {
    const todo = AppState.getTodoById(e.detail.todoId);
    if (todo) openModal('edit', todo);
  });

  // Cancel button closes the modal
  document.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

  // Clicking the dark overlay also closes the modal
  document.querySelector('#modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.querySelector('#modal-overlay')) closeModal();
  });

  // Confirm button saves the todo
  document.querySelector('#modal-confirm-btn').addEventListener('click', () => {
    const fields = collectFormData();
      console.log('fields collected:', fields);  

    // Don't save if title is empty
    if (!fields.title) {
      alert('Please enter a title!');
      return;
    }

    if (editingTodoId) {
      // Edit mode — update existing todo
      AppState.updateTodo(editingTodoId, fields);
    } else {
      // Add mode — create new todo
      AppState.addTodo(fields);
    }

    console.log('todo added, re-rendering...');
    closeModal();
    renderTodos(getCurrentProjectId());
  });

  // Allow pressing Escape to close the modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
};

export { initModalUI };