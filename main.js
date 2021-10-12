let queue;

const result = {
  ADDED: 1,
  INVALID_INPUT: 2,
  QUEUE_IS_FULL: 3,
};

class Queue {
  constructor(maxSize, queue = []) {
    this.maxSize = maxSize;
    this.queue = queue;
  }

  static createQueue(maxSize) {
    let serializedQueue = localStorage.getItem("queue");

    if (serializedQueue) {
      let queueObject = JSON.parse(serializedQueue);
      return new Queue(queueObject.maxSize, queueObject.queue);
    } else {
      return new Queue(maxSize);
    }
  }

  addElement(element) {
    if (this.queue.length >= this.maxSize) {
      return result.QUEUE_IS_FULL;
    } else if (!this.isElementValid(element)) {
      return result.INVALID_INPUT;
    } else {
      this.queue[this.queue.length] = element;

      this.serializeQueue();
      document.getElementById("input").value = "";
      return result.ADDED;
    }
  }

  deleteElement() {
    this.queue.shift();
    this.serializeQueue();
    document.location.reload();
  }

  isElementValid(str) {
    return str && str.length > 0;
  }

  serializeQueue() {
    localStorage.setItem("queue", JSON.stringify(this));
  }

  getStringReprezentation() {
    let stringReprezentation = "";

    for (var i = 0; i < this.queue.length; i++) {
      stringReprezentation += `${i + 1}. ${this.queue[i]}&nbsp&nbsp&nbsp`;
    }

    return stringReprezentation;
  }
}

function onPageLoaded() {
  queue = Queue.createQueue(25);
  document.getElementById("queue").innerHTML = queue.getStringReprezentation();
}

function onInputSubmitted(e) {
  e.preventDefault();

  const input = document.getElementById("input").value;

  const addingResult = queue.addElement(input);
  switch (addingResult) {
    case result.ADDED:
      displayQueue(queue.getStringReprezentation());
      break;
    case result.INVALID_INPUT:
      notifyUser("Invalid input");
      break;
    case result.QUEUE_IS_FULL:
      notifyUser("Max size exceeded");
    default:
      throw { name: "NotImplementedError", message: "Unknown Addition Result" };
  }
  return false;
}

function onDelete() {
  queue.deleteElement();
}

function displayQueue(str) {
  document.getElementById("queue").innerHTML = str;
}

function notifyUser(message) {
  document.getElementById("input").value = "";
  alert(message);
}
