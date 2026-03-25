// src/ui/ProjectUI.js
import AppState from '../AppState.js';

let currentProjectId = null;

const getCurrentProjectId = () => currentProjectId;

const renderProjects = () => {
  const list = document.querySelector('#project-list');
  const projects = AppState.getProjects();

  list.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.classList.add('project-item');
    li.dataset.id = project.id;

    if (project.id === currentProjectId) {
      li.classList.add('active');
    }

    const name = document.createElement('span');
    name.textContent = project.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('project-item__delete');

    name.addEventListener('click', () => {
      currentProjectId = project.id;
      document.querySelector('#project-title').textContent = project.name;
      renderProjects();
      document.dispatchEvent(new CustomEvent('projectChanged', {
        detail: { projectId: project.id }
      }));
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      if (projects.length === 1) {
        alert("You can't delete your last project!");
        return;
      }



      AppState.deleteProject(project.id);

      if (currentProjectId === project.id) {
        const remaining = AppState.getProjects();
        currentProjectId = remaining[0].id;
        document.querySelector('#project-title').textContent = remaining[0].name;
        document.dispatchEvent(new CustomEvent('projectChanged', {
          detail: { projectId: currentProjectId }
        }));
      }

      renderProjects();
    });

    li.appendChild(name);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
};

const initProjectUI = () => {
  const projects = AppState.getProjects();
  currentProjectId = projects[0].id;
  document.querySelector('#project-title').textContent = projects[0].name;

  renderProjects();

  const addBtn = document.querySelector('#add-project-btn');
  const inputArea = document.querySelector('#add-project-input');
  const nameInput = document.querySelector('#project-name-input');
  const confirmBtn = document.querySelector('#project-confirm-btn');
  const cancelBtn = document.querySelector('#project-cancel-btn');

  // Show the input when clicking "+ New Project"
  addBtn.addEventListener('click', () => {
    addBtn.classList.add('hidden');
    inputArea.classList.remove('hidden');
    nameInput.focus();
  });

  // Confirm adds the project
  confirmBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;

    AppState.addProject(name);
    renderProjects();

    // Reset the form
    nameInput.value = '';
    inputArea.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  // Cancel hides the input
  cancelBtn.addEventListener('click', () => {
    nameInput.value = '';
    inputArea.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  // Also confirm on Enter key
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmBtn.click();
    if (e.key === 'Escape') cancelBtn.click();
  });
};

export { initProjectUI, renderProjects, getCurrentProjectId };