/**
 * TaskFlow - Productivity Dashboard Application Logic
 */

class TaskFlowApp {
  constructor() {
    // Initial State
    this.tasks = [];
    this.userName = localStorage.getItem('taskflow_user_name') || 'Anand';
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
    this.greetingPrefix = document.getElementById('greetingPrefix');
    this.userNameDisplay = document.getElementById('userNameDisplay');
    this.greetingEmoji = document.getElementById('greetingEmoji');
    this.editNameBtn = document.getElementById('editNameBtn');
    this.clockTime = document.getElementById('clockTime');
    this.clockDate = document.getElementById('clockDate');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');

    // Quick Stats
    this.statTotal = document.getElementById('statTotal');
    this.statActive = document.getElementById('statActive');
    this.statCompleted = document.getElementById('statCompleted');
    this.statProgressPct = document.getElementById('statProgressPct');
    this.progressBarFill = document.getElementById('progressBarFill');

    // Task Form & Alarm
    this.taskForm = document.getElementById('taskForm');
    this.taskTitle = document.getElementById('taskTitle');
    this.taskDesc = document.getElementById('taskDesc');
    this.taskCategory = document.getElementById('taskCategory');
    this.taskDueDate = document.getElementById('taskDueDate');
    this.taskAlarmHour = document.getElementById('taskAlarmHour');
    this.taskAlarmMin = document.getElementById('taskAlarmMin');
    this.taskAlarmAmpm = document.getElementById('taskAlarmAmpm');
    this.taskPermanentAlarm = document.getElementById('taskPermanentAlarm');
    this.suggestionChips = document.querySelectorAll('.chip-btn');

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
    this.editTaskAlarmHour = document.getElementById('editTaskAlarmHour');
    this.editTaskAlarmMin = document.getElementById('editTaskAlarmMin');
    this.editTaskAlarmAmpm = document.getElementById('editTaskAlarmAmpm');
    this.editTaskPermanentAlarm = document.getElementById('editTaskPermanentAlarm');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.cancelEditBtn = document.getElementById('cancelEditBtn');

    // Alarm Modal
    this.alarmModalOverlay = document.getElementById('alarmModalOverlay');
    this.alarmModalText = document.getElementById('alarmModalText');
    this.dismissAlarmBtn = document.getElementById('dismissAlarmBtn');

    // Name Modal
    this.nameModalOverlay = document.getElementById('nameModalOverlay');
    this.nameForm = document.getElementById('nameForm');
    this.userNameInput = document.getElementById('userNameInput');
    this.closeNameModalBtn = document.getElementById('closeNameModalBtn');
    this.cancelNameBtn = document.getElementById('cancelNameBtn');

    // Quotes & Toast
    this.quoteText = document.getElementById('quoteText');
    this.quoteAuthor = document.getElementById('quoteAuthor');
    this.toastContainer = document.getElementById('toastContainer');

    // Daily Monitor Elements
    this.streakCountEl = document.getElementById('streakCount');
    this.monitorStatusBanner = document.getElementById('monitorStatusBanner');
    this.bannerIcon = document.getElementById('bannerIcon');
    this.bannerTitle = document.getElementById('bannerTitle');
    this.bannerMsg = document.getElementById('bannerMsg');
    this.checkProgressBtn = document.getElementById('checkProgressBtn');
    this.monitorTodayProgress = document.getElementById('monitorTodayProgress');
    this.monitorOverdueCount = document.getElementById('monitorOverdueCount');
    this.monitorScore = document.getElementById('monitorScore');
    this.monitorSystemStatus = document.getElementById('monitorSystemStatus');
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

    // Name Modal Events
    if (this.userNameDisplay) {
      this.userNameDisplay.addEventListener('click', () => this.openNameModal());
    }
    if (this.editNameBtn) {
      this.editNameBtn.addEventListener('click', () => this.openNameModal());
    }
    if (this.closeNameModalBtn) {
      this.closeNameModalBtn.addEventListener('click', () => this.closeNameModal());
    }
    if (this.cancelNameBtn) {
      this.cancelNameBtn.addEventListener('click', () => this.closeNameModal());
    }
    if (this.nameModalOverlay) {
      this.nameModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.nameModalOverlay) this.closeNameModal();
      });
    }
    if (this.nameForm) {
      this.nameForm.addEventListener('submit', (e) => this.handleSaveName(e));
    }

    // Monitor Scan Button
    if (this.checkProgressBtn) {
      this.checkProgressBtn.addEventListener('click', () => {
        this.updateDailyMonitor(true);
      });
    }

    // Quick Suggestion Chips
    if (this.suggestionChips) {
      this.suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
          this.taskTitle.value = chip.dataset.title;
          if (chip.dataset.cat) this.taskCategory.value = chip.dataset.cat;
          if (chip.dataset.prio) {
            const prioRadio = document.querySelector(`input[name="priority"][value="${chip.dataset.prio}"]`);
            if (prioRadio) prioRadio.checked = true;
          }
          this.taskTitle.focus();
          this.showToast(`Selected "${chip.textContent.trim()}"!`, 'info');
        });
      });
    }

    // Alarm Modal Events
    if (this.dismissAlarmBtn) {
      this.dismissAlarmBtn.addEventListener('click', () => {
        if (this.alarmModalOverlay) this.alarmModalOverlay.classList.add('hidden');
      });
    }
    if (this.alarmModalOverlay) {
      this.alarmModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.alarmModalOverlay) this.alarmModalOverlay.classList.add('hidden');
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.editModalOverlay.classList.contains('hidden')) this.closeEditModal();
        if (this.nameModalOverlay && !this.nameModalOverlay.classList.contains('hidden')) this.closeNameModal();
        if (this.alarmModalOverlay && !this.alarmModalOverlay.classList.contains('hidden')) this.alarmModalOverlay.classList.add('hidden');
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
      let prefix = 'Good day,';
      let emoji = '👋';

      if (hour >= 5 && hour < 12) {
        prefix = 'Good morning,';
        emoji = '☀️';
      } else if (hour >= 12 && hour < 17) {
        prefix = 'Good afternoon,';
        emoji = '🌤️';
      } else if (hour >= 17 && hour < 21) {
        prefix = 'Good evening,';
        emoji = '🌆';
      } else {
        prefix = 'Good night,';
        emoji = '🌙';
      }

      if (this.greetingPrefix) this.greetingPrefix.textContent = prefix;
      if (this.userNameDisplay) this.userNameDisplay.textContent = this.userName;
      if (this.greetingEmoji) this.greetingEmoji.textContent = emoji;

      // Real-time alarm checking
      this.checkTaskAlarms();
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  format12HourTime(rawTimeStr, ampmSelectVal = 'AM') {
    if (!rawTimeStr) return '';
    if (rawTimeStr.includes('AM') || rawTimeStr.includes('PM')) {
      return rawTimeStr;
    }

    const parts = rawTimeStr.split(':');
    if (parts.length < 2) return '';
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    let ampm = ampmSelectVal || 'AM';
    if (hours >= 12) {
      ampm = 'PM';
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
      ampm = 'AM';
    }

    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  /* ------------------------------------------------------------------------
     Task Alarm & Audio Reminder Engine
     ------------------------------------------------------------------------ */
  checkTaskAlarms() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    const current12HrTimeStr = `${hoursStr}:${minutes} ${ampm}`;
    const todayStr = now.toISOString().split('T')[0];

    this.tasks.forEach(task => {
      if (!task.completed && task.alarmTime) {
        if (task.alarmTime === current12HrTimeStr) {
          const alarmKey = `${todayStr}-${current12HrTimeStr}`;
          if (task.lastAlarmTriggeredDate !== alarmKey) {
            task.lastAlarmTriggeredDate = alarmKey;
            this.saveTasks();

            // Play Audio Chime Sound
            this.playAlarmSound();

            // Trigger Alarm Modal & Toast
            const repeatTag = task.isPermanent ? '🔁 Permanent Daily Alarm' : '🔔 Task Alarm Reminder';
            if (this.alarmModalText) {
              this.alarmModalText.textContent = `${repeatTag}: It's time for "${task.title}" (${task.alarmTime})!`;
            }
            if (this.alarmModalOverlay) {
              this.alarmModalOverlay.classList.remove('hidden');
            }
            this.showToast(`🔔 ALARM (${task.alarmTime}): Time for "${task.title}"!`, 'info');
          }
        }
      }
    });
  }

  playAlarmSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio Context error or user interaction needed', e);
    }
  }

  /* ------------------------------------------------------------------------
     User Name Personalization Modal
     ------------------------------------------------------------------------ */
  openNameModal() {
    if (this.userNameInput) this.userNameInput.value = this.userName;
    if (this.nameModalOverlay) this.nameModalOverlay.classList.remove('hidden');
    if (this.userNameInput) this.userNameInput.focus();
  }

  closeNameModal() {
    if (this.nameModalOverlay) this.nameModalOverlay.classList.add('hidden');
  }

  handleSaveName(e) {
    e.preventDefault();
    const newName = this.userNameInput.value.trim();
    if (!newName) return;

    this.userName = newName;
    localStorage.setItem('taskflow_user_name', newName);
    this.closeNameModal();
    this.showToast(`Welcome, ${this.userName}! 🎉`, 'success');
    this.startClock();
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

    const hour = this.taskAlarmHour ? this.taskAlarmHour.value : '';
    const min = this.taskAlarmMin ? this.taskAlarmMin.value : '00';
    const ampm = this.taskAlarmAmpm ? this.taskAlarmAmpm.value : 'AM';
    const alarmTime = hour ? `${hour}:${min} ${ampm}` : '';
    const isPermanent = this.taskPermanentAlarm ? this.taskPermanentAlarm.checked : false;

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      description,
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      alarmTime,
      isPermanent,
      lastAlarmTriggeredDate: ''
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

    if (task.alarmTime) {
      const timeParts = task.alarmTime.split(' ');
      if (timeParts.length >= 2) {
        const hm = timeParts[0].split(':');
        if (this.editTaskAlarmHour) this.editTaskAlarmHour.value = hm[0] || '';
        if (this.editTaskAlarmMin) this.editTaskAlarmMin.value = hm[1] || '00';
        if (this.editTaskAlarmAmpm) this.editTaskAlarmAmpm.value = timeParts[1] || 'AM';
      }
    } else {
      if (this.editTaskAlarmHour) this.editTaskAlarmHour.value = '';
      if (this.editTaskAlarmMin) this.editTaskAlarmMin.value = '00';
      if (this.editTaskAlarmAmpm) this.editTaskAlarmAmpm.value = 'AM';
    }

    if (this.editTaskPermanentAlarm) {
      this.editTaskPermanentAlarm.checked = !!task.isPermanent;
    }

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

    const hour = this.editTaskAlarmHour ? this.editTaskAlarmHour.value : '';
    const min = this.editTaskAlarmMin ? this.editTaskAlarmMin.value : '00';
    const ampm = this.editTaskAlarmAmpm ? this.editTaskAlarmAmpm.value : 'AM';
    task.alarmTime = hour ? `${hour}:${min} ${ampm}` : '';
    task.isPermanent = this.editTaskPermanentAlarm ? this.editTaskPermanentAlarm.checked : false;

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
     UI Rendering & Daily Monitoring Engine
     ------------------------------------------------------------------------ */
  render() {
    this.updateStats();
    this.updateDailyMonitor();
    this.renderTaskList();
  }

  updateDailyMonitor(manualScan = false) {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find overdue tasks (due date < today and not completed)
    const overdueTasks = this.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
    
    // Find today's tasks
    const todayTasks = this.tasks.filter(t => (t.dueDate === todayStr) || (t.createdAt && t.createdAt.startsWith(todayStr)));
    const todayCompleted = todayTasks.filter(t => t.completed).length;

    // Total counts & Productivity score
    const totalCount = this.tasks.length;
    const totalCompleted = this.tasks.filter(t => t.completed).length;
    const score = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 100;

    // Update UI Metric Texts
    if (this.monitorTodayProgress) {
      this.monitorTodayProgress.textContent = `${todayCompleted} / ${todayTasks.length || 0}`;
    }
    if (this.monitorOverdueCount) {
      this.monitorOverdueCount.textContent = overdueTasks.length;
    }
    if (this.monitorScore) {
      this.monitorScore.textContent = `${score}%`;
    }

    // Streak Logic
    let streak = parseInt(localStorage.getItem('taskflow_streak') || '1', 10);
    const lastActiveDate = localStorage.getItem('taskflow_last_active_date') || '';

    if (totalCompleted > 0 && lastActiveDate !== todayStr) {
      if (lastActiveDate) {
        const lastDate = new Date(lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate - lastDate) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          streak += 1;
        } else if (diffDays > 1) {
          streak = 1;
        }
      }
      localStorage.setItem('taskflow_streak', streak);
      localStorage.setItem('taskflow_last_active_date', todayStr);
    }
    if (this.streakCountEl) this.streakCountEl.textContent = streak;

    // Evaluation & Warning Banner Logic
    if (this.monitorStatusBanner) {
      this.monitorStatusBanner.classList.remove('alert-warning', 'alert-danger', 'alert-success');
      
      if (overdueTasks.length > 0) {
        // FAIL / FAILURE WARNING CONDITION
        this.monitorStatusBanner.classList.add('alert-danger');
        if (this.bannerIcon) this.bannerIcon.textContent = '🚨';
        if (this.bannerTitle) this.bannerTitle.textContent = 'Productivity Failure Warning!';
        if (this.bannerMsg) {
          this.bannerMsg.textContent = `You have ${overdueTasks.length} overdue task(s)! Complete them immediately to prevent streak loss.`;
        }
        if (this.monitorSystemStatus) {
          this.monitorSystemStatus.textContent = 'Action Required 🚨';
          this.monitorSystemStatus.className = 'status-chip chip-warning';
        }
        if (manualScan) {
          this.showToast(`🚨 System Alert: ${overdueTasks.length} task(s) are overdue!`, 'danger');
        }
      } else if (todayTasks.length > 0 && todayCompleted === 0) {
        // PENDING DAILY GOAL WARNING
        this.monitorStatusBanner.classList.add('alert-warning');
        if (this.bannerIcon) this.bannerIcon.textContent = '⚠️';
        if (this.bannerTitle) this.bannerTitle.textContent = 'Daily Goals Unfulfilled';
        if (this.bannerMsg) {
          this.bannerMsg.textContent = `${this.userName}, you haven't completed any of today's tasks yet. Complete your daily targets!`;
        }
        if (this.monitorSystemStatus) {
          this.monitorSystemStatus.textContent = 'Needs Attention ⚠️';
          this.monitorSystemStatus.className = 'status-chip chip-warning';
        }
        if (manualScan) {
          this.showToast('⚠️ Daily Monitor: Uncompleted tasks pending for today!', 'info');
        }
      } else if (totalCount > 0 && totalCompleted === totalCount) {
        // SUCCESS CONDITION - ALL TASKS COMPLETED
        this.monitorStatusBanner.classList.add('alert-success');
        if (this.bannerIcon) this.bannerIcon.textContent = '🎉';
        if (this.bannerTitle) this.bannerTitle.textContent = 'Perfect Productivity Day!';
        if (this.bannerMsg) {
          this.bannerMsg.textContent = `Outstanding job, ${this.userName}! All active tasks and goals are satisfied.`;
        }
        if (this.monitorSystemStatus) {
          this.monitorSystemStatus.textContent = 'Goals Met ✅';
          this.monitorSystemStatus.className = 'status-chip chip-active';
        }
        if (manualScan) {
          this.showToast('🎉 All goals & tasks satisfied! Streak intact.', 'success');
        }
      } else {
        // NEUTRAL / ON TRACK
        this.monitorStatusBanner.classList.add('alert-warning');
        if (this.bannerIcon) this.bannerIcon.textContent = '📊';
        if (this.bannerTitle) this.bannerTitle.textContent = 'Daily Progress Monitoring Active';
        if (this.bannerMsg) {
          this.bannerMsg.textContent = `${this.userName}, the system is monitoring your day-by-day progress. Stay on track!`;
        }
        if (this.monitorSystemStatus) {
          this.monitorSystemStatus.textContent = 'Monitoring Active';
          this.monitorSystemStatus.className = 'status-chip chip-active';
        }
        if (manualScan) {
          this.showToast('🔍 Automated scan: System monitoring active.', 'info');
        }
      }
    }
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

      let alarmTimeHtml = '';
      if (task.alarmTime) {
        alarmTimeHtml = `
          <span class="alarm-tag" title="${task.isPermanent ? 'Permanent Daily Recurring Alarm' : '12-Hour Alarm Reminder'}">
            ${task.isPermanent ? '🔁' : '🔔'} ${task.alarmTime} ${task.isPermanent ? '(Daily)' : ''}
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
            ${alarmTimeHtml}
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

      const alarmTag = li.querySelector('.alarm-tag');
      if (alarmTag) {
        alarmTag.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openEditModal(task.id);
        });
      }

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
