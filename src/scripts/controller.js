export default class Controller {
  constructor(state, view) {
    this.state = state;
    this.view = view;
    this.init();
  }

  init() {
    const tasksList = this.state.getAllTasks();

    if (tasksList.length) {
      this.view.renderTasksList(this.state.getAllTasks());
    }
  }
}
