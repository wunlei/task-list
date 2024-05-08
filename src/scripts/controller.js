export default class Controller {
  constructor(state, view) {
    this.state = state;
    this.view = view;
    this.init();
  }
}
