import BaseElement from "./base-element.js";
import TaskItem from "./task-item.js";

const CATEGORIES = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export default class TaskList {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.taskItems = [];
    this.visibleElements = [];
    this.currCategory = CATEGORIES.ALL;

    this.container = new BaseElement({
      classNames: ["task-list-container", "text-normal"],
    });

    this.taskListElement = new BaseElement({
      tagName: "ul",
      classNames: ["tasks-list"],
      parentNode: this.container.getNode(),
    });

    this.taskControlsContainer = new BaseElement({
      classNames: ["task-list-controls"],
      parentNode: this.container.getNode(),
    });

    // controls
    const controlsContainer = this.taskControlsContainer.getNode();

    this.activeItemsCounter = new BaseElement({
      tagName: "span",
      textContent: "0 items left",
      classNames: ["task-counter"],
      parentNode: controlsContainer,
    });

    this.tabsContainer = new BaseElement({
      classNames: ["tabs-container"],
      parentNode: controlsContainer,
    });

    const tabsContainerElement = this.tabsContainer.getNode();

    this.btnCategoryAll = new BaseElement({
      tagName: "button",
      textContent: "All",
      classNames: ["btn", "tab", "tab_category-all", "tab_active"],
      parentNode: tabsContainerElement,
    });

    this.btnCategoryAll.addListener("click", () => this.showAll());

    this.btnCategoryActive = new BaseElement({
      tagName: "button",
      textContent: "Active",
      classNames: ["btn", "tab", "tab_category-active"],
      parentNode: tabsContainerElement,
    });

    this.btnCategoryActive.addListener("click", () => this.showActive());

    this.btnCategoryCompleted = new BaseElement({
      tagName: "button",
      textContent: "Completed",
      classNames: ["btn", "tab", "tab_category-completed"],
      parentNode: tabsContainerElement,
    });

    this.btnCategoryCompleted.addListener("click", () => this.showCompleted());

    this.categoryBtns = {
      [CATEGORIES.ALL]: this.btnCategoryAll,
      [CATEGORIES.ACTIVE]: this.btnCategoryActive,
      [CATEGORIES.COMPLETED]: this.btnCategoryCompleted,
    };

    this.btnClearCompleted = new BaseElement({
      tagName: "button",
      textContent: "Clear completed",
      classNames: ["btn", "btn_clear-completed", "btn_hidden"],
      parentNode: controlsContainer,
    });

    this.btnClearCompleted.addListener("click", () =>
      this.removeCompletedTasks(),
    );

    this.hintTextElement = new BaseElement({
      tagName: "span",
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
      if (this.currCategory === CATEGORIES.ACTIVE) {
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
    if (this.currCategory === CATEGORIES.ACTIVE) {
      this.showActive();
    }
    if (this.currCategory === CATEGORIES.COMPLETED) {
      this.showCompleted();
    }
  }

  showAll() {
    this.currCategory = CATEGORIES.ALL;
    this.visibleElements = this.taskItems;
    this.renderActiveCategoryItems();
  }

  showActive() {
    this.currCategory = CATEGORIES.ACTIVE;
    this.visibleElements = this.taskItems.filter(
      (item) => !item.element.getCurrentTask().isDone,
    );
    this.renderActiveCategoryItems();
  }

  showCompleted() {
    this.currCategory = CATEGORIES.COMPLETED;
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
    this.toggleClearCompletedBtn();
    this.container.appendToParent(this.parentNode);
  }

  addTask(task) {
    const taskElement = this.createTaskElement(task);

    this.taskItems.unshift({
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
      this.currCategory = CATEGORIES.ALL;
      this.showAll();
      return;
    }

    this.updateElementsOnScreen();
    this.updateActiveItemsCounter();
    this.toggleClearCompletedBtn();
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
      this.toggleClearCompletedBtn();
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
    this.toggleClearCompletedBtn();
  }

  toggleClearCompletedBtn() {
    const hasCompleted = this.taskItems.some(
      (el) => el.element.getCurrentTask().isDone,
    );
    if (hasCompleted) {
      this.btnClearCompleted.removeClass("btn_hidden");
    } else {
      this.btnClearCompleted.addClass("btn_hidden");
    }
  }
}
