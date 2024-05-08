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

    this.btnCategoryActive = new BaseElement({
      parentNode: tabsContainerElement,
      tagName: "button",
      textContent: "Active",
      classNames: ["btn", "tab", "tab_category-active"],
    });

    this.btnCategoryCompleted = new BaseElement({
      parentNode: tabsContainerElement,
      tagName: "button",
      textContent: "Completed",
      classNames: ["btn", "tab", "tab_category-completed"],
    });

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

    this.container.appendToParent(this.parentNode);
  }

  addTask(task) {
    const taskElement = this.createTaskElement(task);

    this.taskItems.push({
      id: task.id,
      element: taskElement,
    });

    this.container.appendToParent(this.parentNode);
  }

  createTaskElement(task) {
    const taskElement = new TaskItem({
      parentNode: this.taskListElement.getNode(),
      task,
    });
    return taskElement;
  }
}
