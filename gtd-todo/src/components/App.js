import React, { useState } from "react";
import "./App.css";
import Task from "./Task";

const App = (props) => {
  const [taskState, setTaskState] = useState({
    todayTasks: [
      {
        id: "asdfas",
        name: "Sample1",
        isDone: false,
        endTime: Date.parse(2020 / 10 / 21),
        taskMinites: 30,
        rank: "A",
      },
      {
        id: "afffdjkdk",
        name: "Sample2",
        isDone: false,
        endTime: Date(),
        taskMinites: 30,
        rank: "B",
      },
    ],
  });

  const resetTaskHandler = () => {
    setTaskState({
      todayTasks: [
        {
          id: "asdfas",
          name: "Sample1",
          isDone: false,
          endTime: Date.parse(2020 / 10 / 21),
          taskMinites: 30,
          rank: "A",
        },
        {
          id: "afffdjkdk",
          name: "Sample2",
          isDone: false,
          endTime: Date(),
          taskMinites: 30,
          rank: "B",
        },
      ],
    });
  };
  const addTaskHandler = () => {
    const todayTasks = taskState.todayTasks;
    todayTasks.push({
      id: Math.random().toString(32).substring(2),
      name: "new task",
      isDone: false,
      endTime: Date(),
      taskMinites: 30,
      rank: "B",
    });
    setTaskState({ todayTasks });
  };

  const toggleDoneHandler = (event, id) => {
    const todayTaskIndex = taskState.todayTasks.findIndex((t) => {
      return t.id === id;
    });
    const todayTask = {
      ...taskState.todayTasks[todayTaskIndex],
    };
    todayTask.isDone = todayTask.isDone ? false : true;
    const todayTasks = [...taskState.todayTasks];
    todayTasks[todayTaskIndex] = todayTask;
    setTaskState({ todayTasks: todayTasks });
  };

  const nameChangedHandler = (event, id) => {
    const todayTaskIndex = taskState.todayTasks.findIndex((t) => {
      return t.id === id;
    });
    const todayTask = {
      ...taskState.todayTasks[todayTaskIndex],
    };
    todayTask.name = event.target.value;
    const todayTasks = [...taskState.todayTasks];
    todayTasks[todayTaskIndex] = todayTask;
    setTaskState({ todayTasks: todayTasks });
  };

  const taskMinitesChangedHandler = (event, id) => {
    const todayTaskIndex = taskState.todayTasks.findIndex((t) => {
      return t.id === id;
    });
    const todayTask = {
      ...taskState.todayTasks[todayTaskIndex],
    };
    todayTask.taskMinites = event.target.value;
    const todayTasks = [...taskState.todayTasks];
    todayTasks[todayTaskIndex] = todayTask;
    setTaskState({ todayTasks: todayTasks });
  };

  const rankChangedHandler = (event, id) => {
    const todayTaskIndex = taskState.todayTasks.findIndex((t) => {
      return t.id === id;
    });
    const todayTask = {
      ...taskState.todayTasks[todayTaskIndex],
    };
    todayTask.rank = event.target.value;
    const todayTasks = [...taskState.todayTasks];
    todayTasks[todayTaskIndex] = todayTask;
    setTaskState({ todayTasks: todayTasks });
  };

  const deleteTaskHandler = (taskIndex) => {
    // const todayTasks = taskState.todayTasks.slice();
    const todayTaskstmp = taskState.todayTasks;
    todayTaskstmp.splice(taskIndex, 1);
    setTaskState({ todayTasks: todayTaskstmp });
  };

  return (
    <div className="App">
      <h1>This is GTD todo</h1>
      <button onClick={resetTaskHandler}> reset </button>
      {taskState.todayTasks.map((todayTask, index) => {
        return (
          <Task
            key={todayTask.id}
            name={todayTask.name}
            isDone={todayTask.isDone}
            endTime={todayTask.endTime}
            rank={todayTask.rank}
            taskMinites={todayTask.taskMinites}
            taskMinitesChange={(event) =>
              taskMinitesChangedHandler(event, todayTask.id)
            }
            done={(event) => toggleDoneHandler(event, todayTask.id)}
            delete={() => deleteTaskHandler(index)}
            rankChange={(event) => rankChangedHandler(event, todayTask.id)}
            change={(event) => nameChangedHandler(event, todayTask.id)}
          />
        );
      })}

      <div>
        <button onClick={addTaskHandler}>addTask</button>
      </div>
    </div>
  );
};

export default App;