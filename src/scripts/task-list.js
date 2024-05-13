import BaseElement from "./base-element.js";
import TaskItem from "./task-item.js";

export default class TaskList {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.taskItems = [];
    this.visibleElements = [];
    this.currCategory = "all";

    this.container = new BaseElement({
      classNames: ["task-list-container", "text-normal"],
    });

    this.taskListElement = new BaseElement({
      tagName: "ul",
      parentNode: this.container.getNode(),
      classNames: ["tasks-list"],
    });

    this.taskControlsContainer = new BaseElement({
      classNames: ["task-list-controls"],
      parentNode: this.container.getNode(),
    });

    // controls

    const controlsContainer = this.taskControlsContainer.getNode();

    this.activeItemsCounter = new BaseElement({
      parentNode: controlsContainer,
      textContent: "0 items left",
      classNames: ["task-counter"],
      tagName: "span",
    });

    this.tabsContainer = new BaseElement({
      parentNode: controlsContainer,
      classNames: ["tabs-container"],
    });

    const tabsContainerElement = this.tabsContainer.getNode();

    this.btnCategoryAll = new BaseElement({
      parentNode: tabsContainerElement,
      tagName: "button",
      textContent: "All",
      classNames: ["btn", "tab", "tab_category-all", "tab_active"],
    });

    this.btnCategoryAll.getNode().onclick = () => {
      this.showAll();
    };

    this.btnCategoryActive = new BaseElement({
      parentNode: tabsContainerElement,
      tagName: "button",
      textContent: "Active",
      classNames: ["btn", "tab", "tab_category-active"],
    });

    this.btnCategoryActive.getNode().onclick = () => {
      this.showActive();
    };

    this.btnCategoryCompleted = new BaseElement({
      parentNode: tabsContainerElement,
      tagName: "button",
      textContent: "Completed",
      classNames: ["btn", "tab", "tab_category-completed"],
    });

    this.btnCategoryCompleted.getNode().onclick = () => {
      this.showCompleted();
    };

    this.categoryBtns = {
      all: this.btnCategoryAll,
      active: this.btnCategoryActive,
      completed: this.btnCategoryCompleted,
    };

    this.btnClearCompleted = new BaseElement({
      parentNode: controlsContainer,
      tagName: "button",
      textContent: "Clear completed",
      classNames: ["btn", "btn_clear-completed"],
    });

    this.btnClearCompleted.getNode().onclick = () =>
      this.removeCompletedTasks();

    this.hintTextElement = new BaseElement({
      classNames: ["hint"],
    });
  }

  renderActiveCategoryItems() {
    this.taskListElement.getNode().replaceChildren();

    Object.entries(this.categoryBtns).forEach(([key, btn]) => {
      if (key === this.currCategory) {
        btn.addClass("tab_active");
      } else {
        btn.removeClass("tab_active");
      }
    });

    if (this.visibleElements.length === 0 && this.taskItems.length > 0) {
      if (this.currCategory === "active") {
        this.hintTextElement.updateTextContent("All done ヽ(o＾▽＾o)ノ");
      } else {
        this.hintTextElement.updateTextContent("No tasks (｡╯︵╰｡)");
      }

      this.hintTextElement.appendToParent(this.taskListElement.getNode());

      return;
    }

    this.visibleElements.forEach((el) =>
      el.element.appendToParent(this.taskListElement.getNode()),
    );
  }

  updateElementsOnScreen() {
    // if (this.currCategory === "all") {
    //   this.showAll();
    // }
    if (this.currCategory === "active") {
      this.showActive();
    }
    if (this.currCategory === "completed") {
      this.showCompleted();
    }
  }

  showAll() {
    this.currCategory = "all";
    this.visibleElements = this.taskItems;
    this.renderActiveCategoryItems();
  }

  showActive() {
    this.currCategory = "active";
    this.visibleElements = this.taskItems.filter(
      (item) => !item.element.getCurrentTask().isDone,
    );
    this.renderActiveCategoryItems();
  }

  showCompleted() {
    this.currCategory = "completed";
    this.visibleElements = this.taskItems.filter(
      (item) => item.element.getCurrentTask().isDone,
    );
    this.renderActiveCategoryItems();
  }

  removeCompletedTasks() {
    const cb = this.removeCompletedCb;
    if (!cb) {
      return;
    }

    this.taskItems.forEach((item) => {
      const task = item.element.getCurrentTask();
      if (task.isDone) {
        cb(task.id);
      }
    });
  }

  renderTasksList(list) {
    if (list.length === 0) {
      return;
    }

    this.taskListElement.getNode().replaceChildren();
    this.taskItems = [];

    list.forEach((el) => {
      this.addTask(el);
    });

    this.updateActiveItemsCounter();
    this.container.appendToParent(this.parentNode);
  }

  addTask(task) {
    const taskElement = this.createTaskElement(task);

    this.taskItems.push({
      id: task.id,
      element: taskElement,
    });

    if (!this.container.getNode().parentElement) {
      this.container.appendToParent(this.parentNode);
    }

    this.updateActiveItemsCounter();
    this.updateElementsOnScreen();
  }

  createTaskElement(task) {
    const taskElement = new TaskItem({
      parentNode: this.taskListElement.getNode(),
      task,
    });

    if (this.deleteTaskCallback) {
      taskElement.onDelete(this.deleteTaskCallback);
    }
    if (this.taskStateUpdateCallback) {
      taskElement.onStateUpdate(this.taskStateUpdateCallback);
    }
    if (this.taskTextUpdateCallback) {
      taskElement.onTextUpdate(this.taskTextUpdateCallback);
    }

    return taskElement;
  }

  handleDeleteTask(id) {
    this.taskItems = this.taskItems.filter((item) => {
      if (item.id === id) {
        item.element.destroy();
        return false;
      }
      return true;
    });

    if (this.taskItems.length === 0) {
      this.container.destroy();
      this.currCategory = "all";
      return;
    }

    this.updateElementsOnScreen();
    this.updateActiveItemsCounter();
  }

  updateActiveItemsCounter() {
    const undoneItems = this.taskItems.filter(
      (item) => !item.element.getCurrentTask().isDone,
    );

    this.activeItemsCounter.updateTextContent(
      `Tasks left: ${undoneItems.length}`,
    );
  }

  onTaskDelete(cb) {
    this.deleteTaskCallback = cb;

    this.taskItems.forEach((task) => {
      task.element.onDelete(cb);
    });
  }

  onTaskStateUpdate(cb) {
    this.taskStateUpdateCallback = cb;

    this.taskItems.forEach((taskItem) => {
      taskItem.element.onStateUpdate(cb);
    });
  }

  onTaskTextUpdate(cb) {
    this.taskTextUpdateCallback = cb;

    this.taskItems.forEach((taskItem) => {
      taskItem.element.onTextUpdate(cb);
    });
  }

  onRemoveCompletedTasks(cb) {
    this.removeCompletedCb = cb;
  }

  handleTaskStateUpdate(task) {
    const taskItem = this.taskItems.find((el) => el.id === task.id);

    if (taskItem) {
      taskItem.element.handleStateUpdate(task.isDone);
      this.updateActiveItemsCounter();
      this.updateElementsOnScreen();
    }
  }

  handleTaskTextUpdate(task) {
    const taskItem = this.taskItems.find((el) => el.id === task.id);

    if (taskItem) {
      taskItem.element.handleTextUpdate(task.text);
    }
  }

  updateAllTasksState(tasks) {
    tasks.forEach((task) => this.handleTaskStateUpdate(task));

    this.updateElementsOnScreen();
    this.updateActiveItemsCounter();
  }
}
