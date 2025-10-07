import { useState, useEffect, type PropsWithChildren, useRef } from "react";
import "./App.css";
import type {Task} from "./types/types.ts";



function App() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify(taskList));
  // }, [taskList]);

  function addNewTask() {
    const value = inputRef.current?.value;
    if (value?.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: value.trim(), 
        complete: false,
        createdAt: new Date().toISOString(),
      };
      setTaskList([...taskList, task]);
      localStorage.setItem("tasks", JSON.stringify([...taskList, task]));
      inputRef.current!.value = ""; // Clear the input
    }
  }

  function deleteTask(index: number) {
    setTaskList(taskList.filter((_, i) => i !== index));
  }

  function toggleTask(index:number) {
    const updatedTasks = taskList.map((task,i) => 
    i === index ? {...task, complete: !task.complete} : task
    );
    setTaskList(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }
 

  return (
    <>
      <h1>Todo Listi</h1>

      <div id="add-task-container">

          <div className="input-container">
            <input type="text" ref={inputRef} placeholder="Input task here" name="taskTitle" id="taskTitle" />
          </div>
          <button id="add-task-button" onClick={addNewTask}>Add new task</button>
      
      </div>

      <div>
        <ul>
          {taskList.map((task, index) => (
            <li key={index}>
              <input type="checkbox" checked={task.complete} onClick={()=> toggleTask(index)}/>
              {task.title}
              <button className="del-button" onClick={() => deleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
