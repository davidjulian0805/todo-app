// src/index.js
import './styles.css';
import AppState from './AppState.js';
import { initProjectUI } from './ui/ProjectUI.js';
import { initTodoUI } from './ui/TodoUI.js';
import { initModalUI } from './ui/ModalUI.js';

AppState.init();
initProjectUI();
initTodoUI();
initModalUI();