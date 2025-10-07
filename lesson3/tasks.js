import fs from "node:fs";
import chalk from "chalk";

const filePath = "./tasks.json";

// Load tasks from the file tasks.json and return the list of tasks as an array
export function loadTasks() {
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
  }
}

// Save tasks to the file tasks.json
function saveTasks(tasks) {
  try {
    const jsonString = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf8");
  } catch (error) {
    console.log(chalk.red("Error saving task: ", error));
  }
}

// Add a new task to the file tasks.json
export function addTask(task) {
  try {
    const tasks = loadTasks();

    const newTask = {
      id: tasks.length + 1,
      text: task,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(chalk.green("New task added!"));
  } catch (error) {
    console.log(chalk.red("Error adding a new task: ", error));
  }
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
    console.log(chalk.blue(task.id + " " + status + " " + task.text));
  });
}

// Mark a task as done in the file tasks.json
export function markTaskDone(index) {
  try {
    const tasks = loadTasks();
    if (tasks.length < index) {
      console.log(chalk.red("Error: invalid task number."));
      return;
    } else {
      tasks[index - 1].completed = true;
      saveTasks(tasks);
      console.log(chalk.green(`Marked task #${index} as done.`));
    }
  } catch (error) {
    console.log(chalk.red("Error marking task done: ", error));
    return;
  }
}

// Clear all tasks from the file tasks.json
export function clearTasks() {
  fs.writeFile(filePath, "", function () {
    console.log(chalk.green("All tasks cleared!"));
  });
}
