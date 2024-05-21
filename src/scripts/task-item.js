import BaseElement from "./base-element.js";

export default class TaskItem {
  constructor({ parentNode, task }) {
    this.id = task.id;
    this.isDone = task.isDone;
    this.text = task.text;

    this.container = new BaseElement({
      tagName: "li",
      classNames: ["task-item"]
    });

    this.container.prependToParent(parentNode);

    const containerNode = this.container.getNode();

    this.taskWrapper = new BaseElement({
      tagName: "div",
      classNames: ["task-wrapper"],
      parentNode: containerNode,
    });

    this.checkbox = new BaseElement({
      tagName: "input",
      classNames: ["task-checkbox"],
      parentNode: this.taskWrapper.getNode(),
    });

    const checkboxNode = this.checkbox.getNode();

    checkboxNode.type = "checkbox";
    checkboxNode.title = "Update state";
    checkboxNode.checked = this.isDone;

    if (this.isDone) {
      this.container.addClass("task-item_done");
    }

    this.taskText = new BaseElement({
      tagName: "span",
      textContent: this.text,
      classNames: ["task-text", "text-big"],
      parentNode: this.taskWrapper.getNode(),
    });

    this.editBtn = new BaseElement({
      tagName: "button",
      classNames: ["btn", "btn_edit-task", "icon-btn"],
      parentNode: containerNode,
    });

    this.deleteBtn = new BaseElement({
      tagName: "button",
      classNames: ["btn", "btn_delete-task", "icon-btn"],
      parentNode: containerNode,
    });

    this.taskEditorContainer = new BaseElement({
      classNames: ["task-editor-container"],
    });

    this.taskTextInput = new BaseElement({
      tagName: "input",
      classNames: ["input", "input_task-text"],
      parentNode: this.taskEditorContainer.getNode(),
    });

    this.saveBtn = new BaseElement({
      tagName: "button",
      classNames: ["btn", "btn_save-task", "icon-btn"],
      parentNode: this.taskEditorContainer.getNode(),
    });

    this.editBtn.addListener("click", () => this.onTextEdit());
    this.taskText.addListener("dblclick", () => this.onTextEdit());
  }

  getCurrentTask() {
    return {
      id: this.id,
      text: this.text,
      isDone: this.isDone,
    };
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
    this.deleteBtn.addListener("click", () => cb(this.id));
  }

  onTextEdit() {
    const editInputEl = this.taskTextInput.getNode();

    editInputEl.value = this.text;

    this.showTaskEditInput();
    editInputEl.focus();
  }

  onStateUpdate(cb) {
    const checkboxEl = this.checkbox.getNode();
    const currentTask = this.getCurrentTask();

    checkboxEl.addEventListener("change", () => {
      currentTask.isDone = checkboxEl.checked;
      cb(currentTask);
    });
  }

  onTextUpdate(cb) {
    const taskEditInputElement = this.taskTextInput.getNode();

    const handleTodoUpdate = () => {
      const newText = taskEditInputElement.value.trim();

      if (newText && this.text !== newText) {
        const currentTask = this.getCurrentTask();

        currentTask.text = newText;
        cb(currentTask);
      }

      this.showTaskElement();
    };

    const handleEscape = () => {
      this.showTaskElement();
    };

    taskEditInputElement.addEventListener("blur", handleTodoUpdate);
    taskEditInputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTodoUpdate();
      }
      if (e.key === "Escape") {
        handleEscape();
      }
    });

    this.saveBtn.addListener("click", handleTodoUpdate);
  }

  handleTaskUpdate(task) {
    this.handleStateUpdate(task.isDone);
    this.handleTextUpdate(task.text);
  }

  handleStateUpdate(isDone) {
    const checkboxEl = this.checkbox.getNode();

    checkboxEl.checked = isDone;
    this.isDone = isDone;

    if (isDone) {
      this.container.addClass("task-item_done");
    } else {
      this.container.removeClass("task-item_done");
    }
  }

  handleTextUpdate(text) {
    this.text = text;
    this.taskText.updateTextContent(text);
  }

  appendToParent(parentNode) {
    this.container.appendToParent(parentNode);
  }

  destroy() {
    this.container.destroy();
  }
}
