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
    checkboxNode.checked = this.isDone;

    if (this.isDone) {
      this.container.addClass("task-item_done");
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

    this.taskTextInput = new BaseElement({
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
      this.onTextEdit();
    };

    this.taskText.getNode().ondblclick = () => {
      this.onTextEdit();
    };
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
    this.deleteBtn.getNode().addEventListener("click", () => cb(this.id));
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

    taskEditInputElement.addEventListener("blur", handleTodoUpdate);
    taskEditInputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTodoUpdate();
      }
    });

    this.saveBtn.getNode().addEventListener("click", handleTodoUpdate);
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
