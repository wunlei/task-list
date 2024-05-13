export default class Controller {
  constructor(state, view) {
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTaskState = this.updateTaskState.bind(this);
    this.updateTaskText = this.updateTaskText.bind(this);
    this.markAllTasks = this.markAllTasks.bind(this);

    this.state = state;
    this.view = view;

    this.init();
  }

  init() {
    this.view.onTaskTextUpdate(this.updateTaskText);
    this.view.onTaskStateUpdate(this.updateTaskState);
    this.view.onAddTask(this.createTask);
    this.view.onTaskDelete(this.deleteTask);
    this.view.onMarkAll(this.markAllTasks);
    this.view.onRemoveCompleted(this.deleteTask);

    const tasksList = this.state.getAllTasks();

    if (tasksList.length) {
      this.view.renderTasksList(this.state.getAllTasks());
    }
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

  updateTaskState(task) {
    this.state.updateTask(task);
    this.state.resetNextMarkState();
    this.view.handleTaskStateUpdate(task);
  }

  updateTaskText(task) {
    this.state.updateTask(task);
    this.view.handleTaskTextUpdate(task);
  }

  markAllTasks() {
    this.state.markAll();
    const tasks = this.state.getAllTasks();
    this.view.handleAllTasksStateUpdate(tasks);
    // tasks.forEach((task) => this.view.handleTaskStateUpdate(task));
  }
}
