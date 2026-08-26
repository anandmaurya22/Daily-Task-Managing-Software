/**
 * TaskFlow - Productivity Dashboard Application Logic
 */

class TaskFlowApp {
  constructor() {
    // Initial State
    this.tasks = [];
    this.currentFilter = 'all'; // 'all' | 'active' | 'completed'
    this.priorityFilter = 'all'; // 'all' | 'High' | 'Medium' | 'Low'
    this.categoryFilter = 'all'; // 'all' | 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Game (Online)' | 'Game (Physical)'
    this.searchQuery = '';
    this.sortBy = 'newest'; // 'newest' | 'oldest' | 'priority' | 'dueDate'
    this.theme = 'dark';

    // Motivational quotes list
    this.quotes = [
      { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
      { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
      { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
      { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
      { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
    ];

    // Initialize application
    this.init();
  }

  init() {
    this.loadTheme();
    this.loadTasks();
    this.cacheDOMElements();
    this.bindEvents();
    this.startClock();
    this.renderQuotes();
    this.render();
  }

  /* ------------------------------------------------------------------------
     Theme Management & LocalStorage Persistence
     ------------------------------------------------------------------------ */
  loadTheme() {
    const savedTheme = localStorage.getItem('taskflow_theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('taskflow_theme', this.theme);
    this.showToast(`Switched to ${this.theme.toUpperCase()} mode`, 'info');
  }

  /* ------------------------------------------------------------------------
     Task Data Persistence & Sample Data Setup
     ------------------------------------------------------------------------ */
  loadTasks() {
    const saved = localStorage.getItem('taskflow_tasks');
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
        this.tasks = this.getStarterTasks();
      }
    } else {
      this.tasks = this.getStarterTasks();
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
  }

  getStarterTasks() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        id: 'task-1',
        title: 'Design Glassmorphism Dashboard UI',
        description: 'Create responsive layout with dark mode toggle, dynamic clock, and status filters.',
        priority: 'High',
        category: 'Work',
        completed: true,
        createdAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
        dueDate: today.toISOString().split('T')[0]
      },
      {
        id: 'task-2',
        title: 'Review Sprint Planning & Deliverables',
        description: 'Gather metrics for task completion and align team quarterly goals.',
        priority: 'High',
        category: 'Work',
        completed: false,
        createdAt: new Date(today.getTime() - 86400000).toISOString(),
        dueDate: tomorrow.toISOString().split('T')[0]
      },
      {
        id: 'task-3',
        title: '30-Minute Evening Walk & Workout',
        description: 'Stay active and hit daily fitness goal.',
        priority: 'Medium',
        category: 'Health',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: ''
      },
      {
        id: 'task-4',
        title: 'Read 20 pages of "Atomic Habits"',
        description: 'Continuous daily learning habit.',
        priority: 'Low',
        category: 'Study',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: ''
      },
      {
        id: 'task-5',
        title: 'Weekend Valorant / Chess Online Tournament',
        description: 'Online multiplayer gaming match with squad on Discord.',
        priority: 'High',
        category: 'Game (Online)',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: tomorrow.toISOString().split('T')[0]
      },
      {
        id: 'task-6',
        title: '5-on-5 Football / Badminton Match',
        description: 'Physical outdoor game at local sports arena.',
        priority: 'Medium',
        category: 'Game (Physical)',
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: ''
      }
    ];
  }

  /* ------------------------------------------------------------------------
     DOM Elements Caching
     ------------------------------------------------------------------------ */
  cacheDOMElements() {
    // Header & Clock
    this.greetingText = document.getElementById('greetingText');
    this.clockTime = document.getElementById('clockTime');
    this.clockDate = document.getElementById('clockDate');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');

    // Quick Stats
    this.statTotal = document.getElementById('statTotal');
    this.statActive = document.getElementById('statActive');
    this.statCompleted = document.getElementById('statCompleted');
    this.statProgressPct = document.getElementById('statProgressPct');
    this.progressBarFill = document.getElementById('progressBarFill');

    // Task Form
    this.taskForm = document.getElementById('taskForm');
    this.taskTitle = document.getElementById('taskTitle');
    this.taskDesc = document.getElementById('taskDesc');
    this.taskCategory = document.getElementById('taskCategory');
    this.taskDueDate = document.getElementById('taskDueDate');

    // Controls
    this.searchInput = document.getElementById('searchInput');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');
    this.filterTabs = document.querySelectorAll('.tab-btn');
    this.tabBadgeAll = document.getElementById('tabBadgeAll');
    this.tabBadgeActive = document.getElementById('tabBadgeActive');
    this.tabBadgeCompleted = document.getElementById('tabBadgeCompleted');
    this.categoryFilterSelect = document.getElementById('categoryFilterSelect');
    this.priorityFilterSelect = document.getElementById('priorityFilterSelect');
    this.sortBySelect = document.getElementById('sortBySelect');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // Task List & Empty State
    this.taskList = document.getElementById('taskList');
    this.emptyState = document.getElementById('emptyState');
    this.emptyTitle = document.getElementById('emptyTitle');
    this.emptyDesc = document.getElementById('emptyDesc');

    // Edit Modal
    this.editModalOverlay = document.getElementById('editModalOverlay');
    this.editTaskForm = document.getElementById('editTaskForm');
    this.editTaskId = document.getElementById('editTaskId');
    this.editTaskTitle = document.getElementById('editTaskTitle');
    this.editTaskDesc = document.getElementById('editTaskDesc');
    this.editTaskPriority = document.getElementById('editTaskPriority');
    this.editTaskCategory = document.getElementById('editTaskCategory');
    this.editTaskDueDate = document.getElementById('editTaskDueDate');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.cancelEditBtn = document.getElementById('cancelEditBtn');

    // Quotes & Toast
    this.quoteText = document.getElementById('quoteText');
    this.quoteAuthor = document.getElementById('quoteAuthor');
    this.toastContainer = document.getElementById('toastContainer');
  }

  /* ------------------------------------------------------------------------
     Event Listeners
     ------------------------------------------------------------------------ */
  bindEvents() {
    // Theme Toggle
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Task Submission
    this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));

    // Search Input
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (this.searchQuery.length > 0) {
        this.clearSearchBtn.classList.remove('hidden');
      } else {
        this.clearSearchBtn.classList.add('hidden');
      }
      this.render();
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.clearSearchBtn.classList.add('hidden');
      this.render();
    });

    // Filter Tabs
    this.filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Category Dropdown Filter
    if (this.categoryFilterSelect) {
      this.categoryFilterSelect.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.render();
      });
    }

    // Priority Dropdown Filter
    this.priorityFilterSelect.addEventListener('change', (e) => {
      this.priorityFilter = e.target.value;
      this.render();
    });

    // Sort Dropdown
    this.sortBySelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.render();
    });

    // Clear Completed Tasks
    this.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());

    // Modal Events
    this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
    this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
    this.editModalOverlay.addEventListener('click', (e) => {
      if (e.target === this.editModalOverlay) this.closeEditModal();
    });
    this.editTaskForm.addEventListener('submit', (e) => this.handleSaveEdit(e));

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.editModalOverlay.classList.contains('hidden')) {
        this.closeEditModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Clock & Dynamic Time-Based Greeting
     ------------------------------------------------------------------------ */
  startClock() {
    const updateTime = () => {
      const now = new Date();

      // Time format (HH:MM:SS AM/PM)
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Date format (Wednesday, Aug 26, 2026)
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (this.clockTime) this.clockTime.textContent = timeStr;
      if (this.clockDate) this.clockDate.textContent = dateStr;

      // Greeting Logic based on hour
      const hour = now.getHours();
      let greeting = 'Good day! 👋';
      if (hour >= 5 && hour < 12) {
        greeting = 'Good morning! ☀️';
      } else if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon! 🌤️';
      } else if (hour >= 17 && hour < 21) {
        greeting = 'Good evening! 🌆';
      } else {
        greeting = 'Good night! 🌙';
      }

      if (this.greetingText) this.greetingText.textContent = greeting;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  renderQuotes() {
    const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    if (this.quoteText) this.quoteText.textContent = `"${randomQuote.text}"`;
    if (this.quoteAuthor) this.quoteAuthor.textContent = `— ${randomQuote.author}`;
  }

  /* ------------------------------------------------------------------------
     Task CRUD Operations
     ------------------------------------------------------------------------ */
  handleAddTask(e) {
    e.preventDefault();

    const title = this.taskTitle.value.trim();
    if (!title) return;

    const description = this.taskDesc.value.trim();
    const priorityRadio = document.querySelector('input[name="priority"]:checked');
    const priority = priorityRadio ? priorityRadio.value : 'Medium';
    const category = this.taskCategory.value;
    const dueDate = this.taskDueDate.value;

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      description,
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate
    };

    this.tasks.unshift(newTask);
    this.saveTasks();

    // Reset Form
    this.taskForm.reset();
    document.querySelector('input[name="priority"][value="Medium"]').checked = true;

    this.showToast('Task added successfully!', 'success');
    this.render();
  }

  toggleTaskCompletion(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    this.saveTasks();

    const statusMsg = task.completed ? 'Task completed! 🎉' : 'Task marked active';
    this.showToast(statusMsg, task.completed ? 'success' : 'info');
    this.render();
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const deletedTask = this.tasks.splice(taskIndex, 1)[0];
    this.saveTasks();

    this.showToast(`Deleted "${deletedTask.title.substring(0, 20)}..."`, 'danger');
    this.render();
  }

  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.editTaskId.value = task.id;
    this.editTaskTitle.value = task.title;
    this.editTaskDesc.value = task.description || '';
    this.editTaskPriority.value = task.priority;
    this.editTaskCategory.value = task.category || 'Work';
    this.editTaskDueDate.value = task.dueDate || '';

    this.editModalOverlay.classList.remove('hidden');
    this.editTaskTitle.focus();
  }

  closeEditModal() {
    this.editModalOverlay.classList.add('hidden');
    this.editTaskForm.reset();
  }

  handleSaveEdit(e) {
    e.preventDefault();
    const id = this.editTaskId.value;
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.title = this.editTaskTitle.value.trim();
    task.description = this.editTaskDesc.value.trim();
    task.priority = this.editTaskPriority.value;
    task.category = this.editTaskCategory.value;
    task.dueDate = this.editTaskDueDate.value;

    this.saveTasks();
    this.closeEditModal();
    this.showToast('Task updated!', 'success');
    this.render();
  }

  handleClearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      this.showToast('No completed tasks to clear', 'info');
      return;
    }

    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveTasks();
    this.showToast(`Cleared ${completedCount} completed task(s)`, 'info');
    this.render();
  }

  /* ------------------------------------------------------------------------
     Filtering & Sorting Logic
     ------------------------------------------------------------------------ */
  getFilteredTasks() {
    return this.tasks.filter(task => {
      // Filter by Status Tab
      if (this.currentFilter === 'active' && task.completed) return false;
      if (this.currentFilter === 'completed' && !task.completed) return false;

      // Filter by Priority
      if (this.priorityFilter !== 'all' && task.priority !== this.priorityFilter) return false;

      // Filter by Category
      if (this.categoryFilter && this.categoryFilter !== 'all' && task.category !== this.categoryFilter) return false;

      // Filter by Search Query
      if (this.searchQuery) {
        const titleMatch = task.title.toLowerCase().includes(this.searchQuery);
        const descMatch = task.description && task.description.toLowerCase().includes(this.searchQuery);
        const catMatch = task.category && task.category.toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !descMatch && !catMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      if (this.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (this.sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (this.sortBy === 'priority') {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (this.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  }

  /* ------------------------------------------------------------------------
     UI Rendering
     ------------------------------------------------------------------------ */
  render() {
    this.updateStats();
    this.renderTaskList();
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (this.statTotal) this.statTotal.textContent = total;
    if (this.statActive) this.statActive.textContent = active;
    if (this.statCompleted) this.statCompleted.textContent = completed;
    if (this.statProgressPct) this.statProgressPct.textContent = `${percentage}%`;
    if (this.progressBarFill) this.progressBarFill.style.width = `${percentage}%`;

    // Tab badges
    if (this.tabBadgeAll) this.tabBadgeAll.textContent = total;
    if (this.tabBadgeActive) this.tabBadgeActive.textContent = active;
    if (this.tabBadgeCompleted) this.tabBadgeCompleted.textContent = completed;
  }

  renderTaskList() {
    const filteredTasks = this.getFilteredTasks();
    this.taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      this.emptyState.classList.remove('hidden');

      if (this.searchQuery) {
        this.emptyTitle.textContent = 'No matching tasks found';
        this.emptyDesc.textContent = `No tasks match "${this.searchQuery}". Try a different term or clear search.`;
      } else if (this.currentFilter === 'active') {
        this.emptyTitle.textContent = 'No active tasks';
        this.emptyDesc.textContent = 'Awesome job! You have completed all active tasks.';
      } else if (this.currentFilter === 'completed') {
        this.emptyTitle.textContent = 'No completed tasks yet';
        this.emptyDesc.textContent = 'Complete tasks to see your history and achievements listed here!';
      } else {
        this.emptyTitle.textContent = 'Your task list is empty';
        this.emptyDesc.textContent = 'Add your first task on the left sidebar to get started!';
      }
      return;
    }

    this.emptyState.classList.add('hidden');

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.setAttribute('data-id', task.id);

      const categoryIcons = {
        Work: '💼 Work',
        Personal: '🏠 Personal',
        Study: '📚 Study',
        Health: '🧘 Health',
        Finance: '💳 Finance',
        'Game (Online)': '🎮 Game (Online)',
        'Game (Physical)': '⚽ Game (Physical)'
      };

      // Check if task is overdue
      let dueDateHtml = '';
      if (task.dueDate) {
        const todayStr = new Date().toISOString().split('T')[0];
        const isOverdue = !task.completed && task.dueDate < todayStr;
        dueDateHtml = `
          <span class="due-date-tag ${isOverdue ? 'overdue' : ''}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${isOverdue ? 'Overdue: ' : 'Due: '}${task.dueDate}
          </span>
        `;
      }

      li.innerHTML = `
        <div class="task-checkbox-container">
          <button class="custom-checkbox" aria-label="Toggle completion" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>

        <div class="task-content">
          <div class="task-header-row">
            <span class="task-title">${this.escapeHTML(task.title)}</span>
          </div>

          ${task.description ? `<p class="task-desc">${this.escapeHTML(task.description)}</p>` : ''}

          <div class="task-meta">
            <span class="badge badge-priority-${task.priority.toLowerCase()}">
              ${task.priority} Priority
            </span>
            <span class="badge badge-category">
              ${categoryIcons[task.category] || task.category || 'Task'}
            </span>
            ${dueDateHtml}
          </div>
        </div>

        <div class="task-actions">
          <button class="action-btn edit-btn" aria-label="Edit task" title="Edit Task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn delete-btn" aria-label="Delete task" title="Delete Task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      // Event Listeners for Task Card
      const checkbox = li.querySelector('.custom-checkbox');
      checkbox.addEventListener('click', () => this.toggleTaskCompletion(task.id));

      const editBtn = li.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => this.openEditModal(task.id));

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      this.taskList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------------
     Helper Utilities & Toasts
     ------------------------------------------------------------------------ */
  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.taskFlowApp = new TaskFlowApp();
});
