import BaseElement from "./base-element.js";
import TaskList from "./task-list.js";

export default class View {
  constructor(parentNode) {
    this.parent = parentNode;

    this.mainElement = new BaseElement({
      tagName: "main",
      classNames: ["main"],
      parentNode: this.parent,
    });

    this.pageTitle = new BaseElement({
      tagName: "h1",
      textContent: "todos",
      classNames: ["title-h2", "page-title"],
      parentNode: this.mainElement.getNode(),
    });

    this.appContainer = new BaseElement({
      parentNode: this.mainElement.getNode(),
      classNames: ["app-container"],
    });

    this.taskInputContainer = new BaseElement({
      parentNode: this.appContainer.getNode(),
      classNames: ["create-task-container", "text-normal"],
    });

    this.btnMarkAll = new BaseElement({
      tagName: "button",
      classNames: ["btn", "btn_mark-all", "icon-btn", "btn_hidden"],
      parentNode: this.taskInputContainer.getNode(),
    });

    this.btnMarkAll.getNode().title = "Mark all";

    this.taskInput = new BaseElement({
      tagName: "input",
      classNames: ["input", "input_create-task"],
      parentNode: this.taskInputContainer.getNode(),
    });

    this.taskInputElement = this.taskInput.getNode();

    this.taskInputElement.placeholder = "What needs to be done?";

    const mobileMediaquery = window.matchMedia("(hover: hover)");

    if (mobileMediaquery.matches) {
      this.taskInputElement.focus();
      this.taskInputContainer.addClass("create-task-container_focused");
    }

    this.taskInput.addListener("focus", () => {
      this.taskInputContainer.addClass("create-task-container_focused");
      this.btnAddTask.removeClass("btn_hidden");
    });

    this.btnAddTask = new BaseElement({
      tagName: "button",
      classNames: ["btn", "btn_add-task", "icon-btn"],
      parentNode: this.taskInputContainer.getNode(),
    });

    this.btnAddTask.getNode().title = "Add task";

    // todo list
    this.taskList = new TaskList(this.appContainer.getNode());
  }

  onMarkAll(cb) {
    this.btnMarkAll.addListener("click", cb);
  }

  onAddTask(cb) {
    const handleTaskInput = () => {
      if (this.taskInputElement.value) {
        cb(this.taskInputElement.value);
        this.taskInputElement.value = "";
      }

      this.btnAddTask.addClass("btn_hidden");
      this.taskInputContainer.removeClass("create-task-container_focused");
    };

    this.taskInput.addListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTaskInput();
        this.btnAddTask.removeClass("btn_hidden");
        this.taskInputContainer.addClass("create-task-container_focused");
      }
    });

    this.taskInput.addListener("blur", handleTaskInput);
    this.btnAddTask.addListener("click", handleTaskInput);
  }

  onTaskDelete(cb) {
    this.taskList.onTaskDelete(cb);
  }

  onTaskStateUpdate(cb) {
    this.taskList.onTaskStateUpdate(cb);
  }

  onTaskTextUpdate(cb) {
    this.taskList.onTaskTextUpdate(cb);
  }

  onRemoveCompleted(cb) {
    this.taskList.onRemoveCompletedTasks(cb);
  }

  handleCreateTask(task) {
    this.taskList.addTask(task);
    this.toggleMarkAllBtn(true);
  }

  handleTaskDelete(id, isListEmpty) {
    this.taskList.handleDeleteTask(id);
    this.toggleMarkAllBtn(!isListEmpty);
  }

  handleTaskStateUpdate(task) {
    this.taskList.handleTaskStateUpdate(task);
  }

  handleTaskTextUpdate(task) {
    this.taskList.handleTaskTextUpdate(task);
  }

  handleAllTasksStateUpdate(tasks) {
    this.taskList.updateAllTasksState(tasks);
  }

  renderTasksList(list) {
    if (list.length === 0) {
      this.toggleMarkAllBtn(false);
      return;
    }

    this.toggleMarkAllBtn(true);
    this.taskList.renderTasksList(list);
  }

  toggleMarkAllBtn(isShown) {
    if (isShown) {
      this.btnMarkAll.removeClass("btn_hidden");
    } else {
      this.btnMarkAll.addClass("btn_hidden");
    }
  }
}
