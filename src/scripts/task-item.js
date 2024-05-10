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
      textContent: "edit",
      classNames: ["btn", "btn_edit-task", "icon-btn"],
    });

    this.deleteBtn = new BaseElement({
      parentNode: containerNode,
      tagName: "button",
      textContent: "delete",
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
      textContent: "save",
      parentNode: this.taskEditorContainer.getNode(),
      classNames: ["btn", "btn_save-task", "icon-btn"],
    });
  }

  onDelete(cb) {
    this.deleteBtn.getNode().addEventListener("click", () => cb(this.id));
  }

  appendToParent(parentNode) {
    this.container.appendToParent(parentNode);
  }

  destroy() {
    this.container.destroy();
  }
}
