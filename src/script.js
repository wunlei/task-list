import Controller from "./scripts/controller.js";
import State from "./scripts/state.js";
import View from "./scripts/view.js";

export default class App {
  constructor() {
    this.state = new State();
    this.view = new View(document.body);
    this.controller = new Controller(this.state, this.view);
  }
}

new App();
