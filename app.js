let tasks = JSON.parse(localStorage.getItem('plantracker_tasks')) || [];
let currentUser = {};
let filterStatus = 'all';

function fakeGoogleLogin() {
  const name = prompt("Enter your Google name:");
  if (name) {
    currentUser = { name };
    switchToAppPage();
  }
}

function fakeGitHubLogin() {
  const name = prompt("Enter your GitHub username:");
  if (name) {
    currentUser = { name };
    switchToAppPage();
  }
}

function login() {
  const name = document.getElementById('username').value.trim();
  if (name === '') return alert("Please enter your name!");
  currentUser = { name };
  switchToAppPage();
}

function switchToAppPage() {
  document.getElementById('userName').innerText = currentUser.name;
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appPage').style.display = 'block';
  renderTasks();
}

function logout() {
  currentUser = {};
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('appPage').style.display = 'none';
}

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  if (text === '') return;

  const newTask = { id: Date.now(), text, completed: false, owner: currentUser.name };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  document.getElementById('taskInput').value = '';
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const userTasks = tasks.filter(t => t.owner === currentUser.name);
  const filteredTasks = filterStatus === 'all' ? userTasks :
                        filterStatus === 'completed' ? userTasks.filter(t => t.completed) :
                        userTasks.filter(t => !t.completed);

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${task.id})">✔️</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(status) {
  filterStatus = status;
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('plantracker_tasks', JSON.stringify(tasks));
}
