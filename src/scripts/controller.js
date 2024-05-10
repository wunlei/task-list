export default class Controller {
  constructor(state, view) {
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.updateTaskState = this.updateTaskState.bind(this);
    this.markAllTasks = this.markAllTasks.bind(this);

    this.state = state;
    this.view = view;
    this.init();
  }

  init() {
    const tasksList = this.state.getAllTasks();

    if (tasksList.length) {
      this.view.renderTasksList(this.state.getAllTasks());
    }

    this.view.onTaskTextUpdate(this.updateTask);
    this.view.onTaskStateUpdate(this.updateTaskState);
    this.view.onAddTask(this.createTask);
    this.view.onTaskDelete(this.deleteTask);
    this.view.onMarkAll(this.markAllTasks);
  }

  createTask(text) {
    const newTask = this.state.createTask(text);
    this.view.handleCreateTask(newTask);
    this.state.resetNextMarkState();
  }

  deleteTask(id) {
    this.state.deleteTask(id);
    const isEmpty = this.state.getAllTasks().length === 0;
    this.view.handleTaskDelete(id, isEmpty);
  }

  updateTask(task) {
    this.state.updateTask(task);
  }

  updateTaskState(task) {
    this.state.updateTask(task);
    this.state.resetNextMarkState();
  }

  markAllTasks() {
    this.state.markAll();
    const tasks = this.state.getAllTasks();
    this.view.handleAllTasksStateUpdate(tasks);
    // tasks.forEach((task) => this.view.handleTaskStateUpdate(task));
  }
}
