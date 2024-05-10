import BaseElement from "./base-element.js";
import TaskList from "./task-list.js";

export default class View {
  constructor(parentNode) {
    this.parent = parentNode;

    this.mainElement = new BaseElement({
      parentNode: this.parent,
      tagName: "main",
      classNames: ["main"],
    });

    this.pageTitle = new BaseElement({
      parentNode: this.mainElement.getNode(),
      classNames: ["title-h2", "page-title"],
      tagName: "h1",
      textContent: "todos",
    });

    this.appContainer = new BaseElement({
      parentNode: this.mainElement.getNode(),
      classNames: ["app-container"],
    });

    this.taskInputContainer = new BaseElement({
      parentNode: this.appContainer.getNode(),
      classNames: [
        "create-task-container",
        "text-normal",
        "input-container_focused",
      ],
    });

    this.btnMarkAll = new BaseElement({
      parentNode: this.taskInputContainer.getNode(),
      tagName: "button",
      textContent: "mark all",
      classNames: ["btn", "btn_mark-all", "icon-btn"],
    });

    this.btnMarkAll.getNode().title = "Mark all";

    this.taskInput = new BaseElement({
      parentNode: this.taskInputContainer.getNode(),
      tagName: "input",
      classNames: ["input", "input_create-task"],
    });

    this.taskInputElement = this.taskInput.getNode();

    this.taskInputElement.focus();
    this.taskInputElement.placeholder = "What needs to be done?";

    this.btnAddTask = new BaseElement({
      parentNode: this.taskInputContainer.getNode(),
      tagName: "button",
      textContent: "add task",
      classNames: ["btn", "btn_add-task", "icon-btn"],
    });

    this.btnAddTask.getNode().title = "Add task";

    // todo list
    this.taskList = new TaskList(this.appContainer.getNode());
  }

  onAddTask(cb) {
    const handleTaskInput = () => {
      if (this.taskInputElement.value) {
        cb(this.taskInputElement.value);
        this.taskInputElement.value = "";
      }
      this.btnAddTask.addClass("btn_hidden");
      this.taskInputContainer.removeClass("input-container_focused");
    };
    this.taskInputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTaskInput();
        this.btnAddTask.removeClass("btn_hidden");
        this.taskInputContainer.addClass("input-container_focused");
      }
    });
    this.taskInputElement.addEventListener("blur", handleTaskInput);
    this.btnAddTask.getNode().addEventListener("click", handleTaskInput);
  }

  onTaskDelete(cb) {
    this.taskList.onTaskDelete(cb);
  }

  renderTasksList(list) {
    this.taskList.renderTasksList(list);
  }

  handleCreateTask(task) {
    this.taskList.addTask(task);
  }

  handleTaskDelete(id, isListEmpty) {
    this.taskList.handleDeleteTask(id);
    this.toggleMarkAllBtn(isListEmpty);
  }
}
