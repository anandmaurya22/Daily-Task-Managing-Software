# ⚡ TaskFlow - Glassmorphism Task & Productivity Dashboard

A modern, responsive, single-page **Task & Productivity Dashboard** built with pure **Vanilla HTML5, CSS3, and JavaScript**. Features clean glassmorphism design, vibrant theme accents, a dynamic live digital clock, category management (including Online & Physical gaming/sports), status filters, and real-time productivity statistics.

> 🚀 **Live Demo**: **[https://anandmaurya22.github.io/Task-Manage/]([https://[anandmaurya22.github.io/Task-Manage/](https://github.com/anandmaurya22/Daily-Task-Managing-Software)](https://anandmaurya22.github.io/Daily-Task-Managing-Software))**  
> Anyone can click the link above to open and use the live application directly in their web browser!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- 🕒 **Dynamic Live Clock & Greeting**: Real-time clock with seconds counter and adaptive greetings based on the time of day (*Good morning*, *Good afternoon*, *Good evening*, *Good night*).
- 📊 **Real-time Statistics Overview**: Track total tasks, active tasks, completed tasks, and an animated overall completion progress rate percentage bar.
- 🎯 **Task Management & Priority System**:
  - Add tasks with Title, Description, Priority level (**High 🔴**, **Medium 🟡**, **Low 🟢**), Category, and Due Date.
  - Interactive strike-through checkboxes with completion feedback.
  - Full CRUD: Add, Toggle, Edit, and Delete tasks.
- 🎮 **Gaming & Sports Support**:
  - **`Game (Online)` 🎮**: Esports, online multiplayer, scrims, Discord sessions.
  - **`Game (Physical)` ⚽**: Outdoor sports, football, basketball, gym, physical board games.
  - Work, Personal, Study, Health, and Finance categories.
- 🔍 **Search & Multi-filtering**: Filter tasks by Status (*All*, *Active*, *Completed*), Category (*Work*, *Game (Online)*, *Game (Physical)*, etc.), Priority, or Search keywords.
- 🌙 **Dark & Light Theme Toggle**: Persistent dark/light mode with smooth CSS transitions and `localStorage` memory.
- 📱 **Responsive Glassmorphism UI**: Backdrop blur effects, glowing ambient background elements, micro-animations, and full mobile/desktop responsiveness.

---

## 📁 File Structure

```text
├── index.html   # Main application HTML markup & modal dialogs
├── style.css    # Modern glassmorphism styles, CSS variables, & animations
├── app.js       # Core state management, CRUD logic, clock, & persistence
└── README.md    # Project documentation
```

---

## 🚀 Getting Started

No heavy frameworks, Node.js packages, or build steps required!

### Option 1: Open Directly in Browser
Simply clone or download the repo and double-click `index.html` to run the application directly in any browser.

### Option 2: Run via Local Web Server
If you prefer running via a local web server (e.g. Python, VS Code Live Server):

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/taskflow-dashboard.git

# Navigate to project directory
cd taskflow-dashboard

# Start local server with Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 🌐 Deploy Free on GitHub Pages

You can host this project online for free using GitHub Pages:

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your dashboard will be live on the web at `https://YOUR_USERNAME.github.io/taskflow-dashboard/`!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
