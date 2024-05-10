import BaseElement from "./base-element.js";

export default class TaskItem {
  constructor({ parentNode, task }) {
    this.id = task.id;
    this.isDone = task.isDone;
    this.text = task.text;

    this.container = new BaseElement({
      parentNode,
      tagName: "li",
      classNames: ["task-item"],
    });

    const containerNode = this.container.getNode();

    this.taskWrapper = new BaseElement({
      tagName: "div",
      classNames: ["task-wrapper"],
      parentNode: containerNode,
    });

    this.checkbox = new BaseElement({
      parentNode: this.taskWrapper.getNode(),
      tagName: "input",
      classNames: ["task-checkbox"],
    });

    const checkboxNode = this.checkbox.getNode();
    checkboxNode.type = "checkbox";
    checkboxNode.title = "Update state";

    if (this.isDone) {
      checkboxNode.checked = true;
      this.container.addClass("task-item_done");
    } else {
      checkboxNode.checked = false;
    }

    this.taskText = new BaseElement({
      parentNode: this.taskWrapper.getNode(),
      tagName: "span",
      textContent: this.text,
      classNames: ["task-text", "text-big"],
    });

    this.editBtn = new BaseElement({
      parentNode: containerNode,
      tagName: "button",
      classNames: ["btn", "btn_edit-task", "icon-btn"],
    });

    this.deleteBtn = new BaseElement({
      parentNode: containerNode,
      tagName: "button",
      classNames: ["btn", "btn_delete-task", "icon-btn"],
    });

    this.taskEditorContainer = new BaseElement({
      classNames: ["task-editor-container"],
    });

    this.taskTextInputInput = new BaseElement({
      tagName: "input",
      parentNode: this.taskEditorContainer.getNode(),
      classNames: ["input", "input_task-text"],
    });

    this.saveBtn = new BaseElement({
      tagName: "button",
      parentNode: this.taskEditorContainer.getNode(),
      classNames: ["btn", "btn_save-task", "icon-btn"],
    });

    this.editBtn.getNode().onclick = () => {
      this.handleEditTask();
    };

    this.taskText.getNode().ondblclick = () => {
      this.handleEditTask();
    };
  }

  handleEditTask() {
    const editInputEl = this.taskTextInputInput.getNode();
    editInputEl.value = this.text;
    this.showTaskEditInput();
    editInputEl.focus();
  }

  showTaskEditInput() {
    this.taskWrapper.destroy();
    this.editBtn.destroy();
    this.deleteBtn.destroy();
    this.taskEditorContainer.appendToParent(this.container.getNode());
  }

  showTaskElement() {
    this.taskWrapper.appendToParent(this.container.getNode());
    this.editBtn.appendToParent(this.container.getNode());
    this.deleteBtn.appendToParent(this.container.getNode());
    this.taskEditorContainer.destroy();
  }

  onDelete(cb) {
    this.deleteBtn.getNode().addEventListener("click", () => cb(this.id));
  }

  onTaskStateUpdate(cb) {
    const checkboxEl = this.checkbox.getNode();
    const currentTask = this.getCurrentTask();
    checkboxEl.addEventListener("change", () => {
      if (checkboxEl.checked) {
        this.isDone = true;
        currentTask.isDone = true;
        this.container.addClass("task-item_done");
        cb(currentTask);
      } else {
        this.isDone = false;
        currentTask.isDone = false;
        this.container.removeClass("task-item_done");
        cb(currentTask);
      }
    });
  }

  getCurrentTask() {
    return {
      id: this.id,
      text: this.text,
      isDone: this.isDone,
    };
  }

  onTaskTextUpdate(cb) {
    const taskEditInputElement = this.taskTextInputInput.getNode();
    const handleTodoUpdate = () => {
      const newText = taskEditInputElement.value.trim();
      if (newText && this.text !== newText) {
        this.text = newText;
        const currentTask = this.getCurrentTask();
        currentTask.text = newText;
        cb(currentTask);
        this.taskText.updateTextContent(newText);
      }
      this.showTaskElement();
    };
    taskEditInputElement.addEventListener("blur", handleTodoUpdate);
    taskEditInputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTodoUpdate();
      }
    });
    this.saveBtn.getNode().addEventListener("click", handleTodoUpdate);
  }

  handleTaskUpdate(task) {
    this.handleTaskStateUpdate(task);
    this.text = task.text;
    this.taskText.updateTextContent(task.text);
  }

  handleTaskStateUpdate(task) {
    const checkboxEl = this.checkbox.getNode();
    if (task.isDone) {
      checkboxEl.checked = true;
      this.container.addClass("task-item_done");
    } else {
      checkboxEl.checked = false;
      this.container.removeClass("task-item_done");
    }
    this.isDone = task.isDone;
  }

  appendToParent(parentNode) {
    this.container.appendToParent(parentNode);
  }

  destroy() {
    this.container.destroy();
  }
}
