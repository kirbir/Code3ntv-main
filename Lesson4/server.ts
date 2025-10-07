import express from "express";
import {
  addTask,
  clearTask,
  loadTasks,
  markTaskDone,
  type Task,
} from "./tasks.ts";

const app = express();

app.use(express.json());
app.listen(8000, () => {
  console.log("Server is running on Http://localhost:8000");
});

// type PatchTaskParams = {
//   id: string;
//   subtaskId: string;
// };

//// MIDDLEWARE
app.use((request, response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${request.method} ${request.originalUrl}`);
  next();
});

app.use((request, response, next) => {
  if (request.method === "POST") {
    console.log(request.body);
  }
  next();
});
//// MIDDLEWARE

//// PING
app.get("/ping", (request, response) => {
  response.status(200).send("pong");
});
//// PING

//// GET TASK BY ID
app.get("/tasks/:id", (request, response) => {
  const { id } = request.params as { id: string };
  const tasks = loadTasks();

  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    response.status(404);
    return;
  }

  response.status(200).json(task);
});
//// GET TASK BY ID

//// MARK TASK AS DONE
app.patch("/tasks/:id", (request, response) => {
  const { id } = request.params as { id: string };
  const { completed } = request.body as {
    completed: boolean;
  };

  const tasks = loadTasks();
  const foundTask = tasks.find((task) => {
    return task.id === id;
  });

  if (!foundTask) {
    response.status(404).send(null);
    return;
  }

  markTaskDone(foundTask.id, completed);
  response.status(204).send("");
});
//// MARK TASK AS DONE

//// GET ALL TASKS
app.get("/tasks", (request, response) => {
  const tasks = loadTasks();
  response.status(200).json(tasks);
});
//// GET ALL TASKS

//// ADD TASK
app.post("/tasks", (request, response) => {
  const { task } = request.body as { task: string };

  const createdTask = addTask(task);
  response.status(201).json(createdTask);
});
//// ADD TASK

//// DELETE TASK BY ID
app.delete("/tasks/:id", (request, response) => {
  const { id } = request.params as { id: string };
  const tasks = loadTasks();
  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    response.status(404).send(null);
    return;
  }

  clearTask(task.id);
  response.status(204).send("");
});
