import fs from "node:fs";
import chalk from "chalk";
import { randomUUID } from "node:crypto";

const filePath = "./tasks.json";

function createdId() {
  return randomUUID();
}

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

// Load tasks from the file tasks.json and return the list of tasks as an array
export function loadTasks(): Task[] {
  try {
    let fileContent = fs.readFileSync("./tasks.json", "utf-8");

    if (fileContent.trim() === "") {
      console.log(
        chalk.yellow(
          "Warning: Task File is empty! You should maybe add some tasks?"
        )
      );
      return [];
    }

    const allTasksParsed = JSON.parse(fileContent);

    return allTasksParsed;
  } catch (error) {
    console.log("Error loading tasks:", error);
    return [];
  }
}

// Save tasks to the file tasks.json
function saveTasks(tasks: Task[]) {
  try {
    const jsonString = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf8");
  } catch (error) {
    console.log(chalk.red("Error saving task: ", error));
  }
}

// Add a new task to the file tasks.json
export function addTask(task: string): Task {
  const tasks = loadTasks();
  const newTask: Task = {
    id: createdId(),
    text: task,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(chalk.green("New task added!"));
  return newTask;
}

// List all tasks from the file tasks.json and print them to the console
export function listTasks() {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found. Add a task to get started!"));
    return;
  }

  tasks.forEach((task, index) => {
    const status = task.completed ? "[✔]" : "[ ]";
    console.log(chalk.blue(task.id + " " + status + " " + task.text + task.id));
  });
}

// Mark a task as done in the file tasks.json
export function markTaskDone(id: string, completed: boolean = true): boolean {
  const tasks = loadTasks();

  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    return false;
  }

  task.completed = completed;
  saveTasks(tasks);
  console.log(chalk.green(`Marked task #${id} as done.`));
  return true;
}

// Clear all tasks from the file tasks.json
export function clearTasks() {
  fs.writeFile(filePath, "", function () {
    console.log(chalk.green("All tasks cleared!"));
  });
}

export function clearTask(id: string) {
  const tasks = loadTasks();
  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    return;
  }

  const newTask = tasks.filter((task) => {
    return task.id !== id;
  });
  saveTasks(newTask);
}
