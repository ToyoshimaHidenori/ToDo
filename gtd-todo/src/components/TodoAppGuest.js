import React, { useState } from "react";
import "./TodoApp.css";
import Task from "./Task";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import TransitionGroup from "react-transition-group/TransitionGroup";
import CSSTransition from "react-transition-group/CSSTransition";

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
  const [taskState, setTaskState] = useLocalStorage("taskState", {
    todayTasks: [
      {
        id: "asdfas",
        name: "NeuToDoにアクセスする",
        isDone: true,
        endTime: Date.parse(2020 / 10 / 21),
        taskMinites: 10,
        rank: "A",
      },
      {
        id: "afffdjkdk",
        name: "Task を登録する",
        isDone: false,
        endTime: Date(),
        taskMinites: 20,
        rank: "A",
      },
    ],
  });

  const [progressState, setProgressState] = useLocalStorage("progressState", [
    10,
    30,
  ]);

  let tweetMin = progressState[0];

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
      rank: "A",
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

    let allTaskMin = 0;
    let doneTaskMin = 0;
    taskState.todayTasks.forEach((todayTask, index, array) => {
      allTaskMin += Number(todayTask.taskMinites);
      if (todayTask.isDone) {
        doneTaskMin += Number(todayTask.taskMinites);
      }
    });

    if (todayTask.isDone) {
      doneTaskMin += Number(todayTask.taskMinites);
    } else {
      doneTaskMin -= Number(todayTask.taskMinites);
    }
    setProgressState([doneTaskMin, allTaskMin]);
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
    const diff = Number(event.target.value) - Number(todayTask.taskMinites);
    console.log(event.target.value);
    console.log(todayTask.taskMinites);
    todayTask.taskMinites = event.target.value;
    const todayTasks = [...taskState.todayTasks];
    todayTasks[todayTaskIndex] = todayTask;
    setTaskState({ todayTasks: todayTasks });

    let allTaskMin = 0;
    let doneTaskMin = 0;
    taskState.todayTasks.forEach((todayTask, index, array) => {
      allTaskMin += Number(todayTask.taskMinites);
      if (todayTask.isDone) {
        doneTaskMin += Number(todayTask.taskMinites);
      }
    });

    allTaskMin += Number(diff);
    if (todayTask.isDone) {
      doneTaskMin += Number(diff);
    }
    setProgressState([doneTaskMin, allTaskMin]);
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

  let tweetButton;
  let donepo;
  if (progressState[1] === progressState[0] && progressState[0] !== 0) {
    tweetMin = progressState[0];
    tweetButton = {
      marginTop: "35px",
    };
    donepo = {
      animation: "donepo 2s infinite",
    };
  } else {
    tweetButton = {
      position: "absolute",
      left: "-100px",
      top: "-100px",
    };
  }

  return (
    <div className="App">
      <h1>Today's tasks</h1>
      <div className="header">
        <div className="ProgressOuter" style={donepo}>
          <CircularProgressbarWithChildren
            value={(100 * Number(progressState[0])) / Number(progressState[1])}
            strokeWidth={15}
            styles={buildStyles({
              rotation: 0.5,
              strokeLinecap: "butt",
              pathTransitionDuration: 1,
              pathColor: "#507cda",
              textColor: "#1c64ff",
              trailColor: "#c6c6e6",
              backgroundColor: "#3e98c7",
            })}
          >
            <div
              className="ProgressInner"
              style={{ display: "flex", alignItems: "flex-center" }}
            >
              <div className="ProgressInnerInner">
                <div
                  style={{
                    fontSize: "16vw",
                    textAlign: "center",
                    color: "#307cea",
                    textShadow: "0px 0px 7px #1c64ff",
                  }}
                >
                  {(tweetMin = progressState[0])}
                </div>
                <div
                  style={{
                    fontSize: "5vw",
                    color: "#9f9ea7",
                    display: "flex",
                    marginLeft: "40%",
                  }}
                >
                  /
                  <div
                    style={{
                      fontSize: "5vw",
                      color: "#507cda",
                    }}
                  >
                    {progressState[1]}
                  </div>
                </div>
              </div>
            </div>
          </CircularProgressbarWithChildren>
        </div>
        {/* <button onClick={resetTaskHandler}> reset </button>
        <button onClick={calcProgress}> sync </button> */}
      </div>

      <div style={tweetButton}>
        <a
          id="tweetButton"
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          className="twitter-share-button"
          data-size="large"
          data-text={"✨✨今日のタスクが完了しました✨✨"}
          data-url="https://neutodo.com/gtd-todo/build/index.html"
          data-hashtags="NeuToDo"
          data-show-count="false"
        >
          Tweet
        </a>
      </div>

      <progress
        id="progressbar"
        max={progressState[1]}
        value={progressState[0]}
      ></progress>

      <TransitionGroup>
        {taskState.todayTasks.map((todayTask, index) => {
          if (!todayTask.isDone) {
            return (
              <CSSTransition key={todayTask.id} timeout={1000} classNames="hi">
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
                  rankChange={(event) =>
                    rankChangedHandler(event, todayTask.id)
                  }
                  change={(event) => nameChangedHandler(event, todayTask.id)}
                />
              </CSSTransition>
            );
          }
        })}
      </TransitionGroup>
      <div>
        <button onClick={addTaskHandler}>Add task</button>
      </div>
      <TransitionGroup>
        {taskState.todayTasks.map((todayTask, index) => {
          if (todayTask.isDone) {
            return (
              <CSSTransition key={todayTask.id} timeout={500} classNames="hi">
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
                  rankChange={(event) =>
                    rankChangedHandler(event, todayTask.id)
                  }
                  change={(event) => nameChangedHandler(event, todayTask.id)}
                />
              </CSSTransition>
            );
          }
        })}
      </TransitionGroup>
    </div>
  );
};

export default App;
