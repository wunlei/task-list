export default class BaseElement {
  constructor({
    tagName = "div",
    classNames = [],
    textContent = "",
    parentNode,
  }) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.textContent = textContent;

    if (parentNode) {
      parentNode.append(this.node);
    }
  }

  appendToParent(parentNode) {
    parentNode.append(this.node);
  }

  appendChild(child) {
    this.node.append(child.getNode());
  }

  appendChildren(children) {
    children.forEach((el) => {
      this.appendChild(el);
    });
  }

  getNode() {
    return this.node;
  }

  addClass(className) {
    this.node.classList.add(className);
  }

  removeClass(className) {
    this.node.classList.remove(className);
  }

  toggleClass(className) {
    this.node.classList.toggle(className);
  }

  updateTextContent(textContent) {
    this.node.textContent = textContent;
  }

  destroy() {
    this.node.remove();
  }

  addListener(type, listener, options = false) {
    this.node.addEventListener(type, listener, options);

    return {
      removeListener: () => {
        this.node.removeEventListener(type, listener, options);
      },
    };
  }
}
