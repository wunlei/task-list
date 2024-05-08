const mock = [
  { id: 1, text: "buy milk", isDone: false },
  { id: 3, text: "pet the cat", isDone: true },
];

export default class State {
  constructor() {
    this.tasks = [];
    this.tasks = mock;
    this.nextMarkState = true;
  }

  createTask(text) {
    const lastTaskId = this.tasks.length
      ? this.tasks[this.tasks.length - 1].id
      : 0;

    const newTask = {
      id: lastTaskId + 1,
      text,
      isDone: false,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  getTaskById(id) {
    const taskIdx = this.tasks.findIndex((el) => el.id === id);

    if (taskIdx < 0) {
      return null;
    }

    return this.tasks[taskIdx];
  }

  getAllTasks() {
    return this.tasks;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((el) => el.id !== id);
  }

  markAll() {
    if (this.nextMarkState) {
      this.tasks.forEach((el) => (el.isDone = true));
      this.nextMarkState = false;
    } else {
      this.tasks.forEach((el) => (el.isDone = false));
      this.nextMarkState = true;
    }
  }

  updateTask(task) {
    const taskIdx = this.tasks.findIndex((el) => el.id === task.id);

    if (taskIdx < 0) {
      throw new Error("No such task");
    }

    this.tasks[taskIdx] = task;
  }
}
