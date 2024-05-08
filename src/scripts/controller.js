export default class Controller {
  constructor(state, view) {
    this.createTask = this.createTask.bind(this);
    this.state = state;
    this.view = view;
    this.init();
  }

  init() {
    const tasksList = this.state.getAllTasks();

    if (tasksList.length) {
      this.view.renderTasksList(this.state.getAllTasks());
    }

    this.view.onAddTask(this.createTask);
  }

  createTask(text) {
    const newTask = this.state.createTask(text);
    this.view.handleCreateTask(newTask);
    this.state.resetNextMarkState();
  }
}
