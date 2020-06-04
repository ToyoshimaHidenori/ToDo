import React, { useState } from "react";
import "./App.css";
import Task from "./Task";

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const App = (props) => {
  //   const [taskState, setTaskState] = useState({
  //     todayTasks: [
  //       {
  //         id: "asdfas",
  //         name: "Sample1",
  //         isDone: false,
  //         endTime: Date.parse(2020 / 10 / 21),
  //         taskMinites: 30,
  //         rank: "A",
  //       },
  //       {
  //         id: "afffdjkdk",
  //         name: "Sample2",
  //         isDone: false,
  //         endTime: Date(),
  //         taskMinites: 30,
  //         rank: "B",
  //       },
  //     ],
  //   });

  //   const [progressState, setProgressState] = useState([0, 60]);
  const [taskState, setTaskState] = useLocalStorage("taskState", {
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

  const [progressState, setProgressState] = useLocalStorage("progressState", [
    0,
    60,
  ]);

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
    setProgressState([0, 60]);
  };
  const addTaskHandler = () => {
    const todayTasks = taskState.todayTasks;
    todayTasks.push({
      id: Math.random().toString(32).substring(2),
      name: "",
      isDone: false,
      endTime: Date(),
      taskMinites: 30,
      rank: "B",
    });
    setTaskState({ todayTasks });
    calcProgress();
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
    calcProgress(setTimeout(1000));
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
    calcProgress();
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
    calcProgress(setTaskState({ todayTasks: todayTaskstmp }));
  };

  const calcProgress = () => {
    let allTaskMin = 0;
    let doneTaskMin = 0;
    taskState.todayTasks.forEach((todayTask, index, array) => {
      allTaskMin += Number(todayTask.taskMinites);
      if (todayTask.isDone) {
        doneTaskMin += Number(todayTask.taskMinites);
      }
    });
    setProgressState([doneTaskMin, allTaskMin]);
  };

  return (
    <div className="App">
      <h1>This is GTD todo</h1>
      <button onClick={resetTaskHandler}> reset </button>
      <button onClick={calcProgress}> sync </button>
      <p>
        Total:{progressState[1]}min Done:{progressState[0]}min Undone:
        {progressState[1] - progressState[0]}
      </p>
      <progress
        id="progressbar"
        max={progressState[1]}
        value={progressState[0]}
      ></progress>
      {taskState.todayTasks.map((todayTask, index) => {
        if (!todayTask.isDone) {
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
        }
      })}
      <div>
        <button onClick={addTaskHandler}>addTask</button>
      </div>
      {taskState.todayTasks.map((todayTask, index) => {
        if (todayTask.isDone) {
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
        }
      })}
    </div>
  );
};

export default App;
