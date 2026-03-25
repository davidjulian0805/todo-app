// src/AppState.js
import Todo from './models/Todo.js';
import Project from './models/Project.js';
import Storage from './storage/Storage.js';

const AppState = (() => {
  let projects = [];
  let todos = [];

  const init = () => {
    const saved = Storage.load();
    projects = saved.projects;
    todos = saved.todos;

    // Ensure a default project always exists
    if (!projects.length) {
      const defaultProject = new Project('Inbox');
      projects.push(defaultProject);
      Storage.save({ projects, todos });
    }
  };

  // -- Projects --
  const getProjects = () => projects;

  const addProject = (name) => {
    const project = new Project(name);
    projects.push(project);
    Storage.save({ projects, todos });
    return project;
  };

  const deleteProject = (projectId) => {
    projects = projects.filter(p => p.id !== projectId);
    todos = todos.filter(t => t.projectId !== projectId); // cascade delete
    Storage.save({ projects, todos });
  };

  // -- Todos --
  const getTodosForProject = (projectId) =>{
    console.log('looking for projectId:', projectId);        // ← add this
  console.log('all todos:', todos);
  
  return todos.filter(t => t.projectId === projectId);
  };
    

  const getTodoById = (id) => todos.find(t => t.id === id);

  const addTodo = (fields) => {
    const todo = new Todo(fields);
     console.log('todo created:', todo);       
  console.log('all todos after add:', todos); 
    todos.push(todo);
    Storage.save({ projects, todos });
    return todo;
  };

  const updateTodo = (id, fields) => {
    const todo = getTodoById(id);
    if (todo) {
      todo.update(fields);
      Storage.save({ projects, todos });
    }
  };

  const deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    Storage.save({ projects, todos });
  };

  const toggleComplete = (id) => {
    const todo = getTodoById(id);
    if (todo) {
      todo.toggleComplete();
      Storage.save({ projects, todos });
    }
  };

  return { 
     init, getProjects, addProject, deleteProject, getTodosForProject,
      getTodoById, addTodo, updateTodo, deleteTodo,
       toggleComplete };
})();

export default AppState;