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
      classNames: ["btn", "btn_mark-all", "icon-btn", "btn_hidden"],
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

    this.taskInputElement.onfocus = () => {
      this.taskInputContainer.addClass("input-container_focused");
      this.btnAddTask.removeClass("btn_hidden");
    };

    this.btnAddTask = new BaseElement({
      parentNode: this.taskInputContainer.getNode(),
      tagName: "button",
      classNames: ["btn", "btn_add-task", "icon-btn"],
    });

    this.btnAddTask.getNode().title = "Add task";

    // todo list
    this.taskList = new TaskList(this.appContainer.getNode());
  }

  onMarkAll(cb) {
    this.btnMarkAll.getNode().addEventListener("click", cb);
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
