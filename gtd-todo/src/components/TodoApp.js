import React, { useState, useEffect } from "react";
import "./TodoApp.css";
import Task from "./Task";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import firebase from "firebase";
import "firebase/auth";

import TransitionGroup from "react-transition-group/TransitionGroup";
import CSSTransition from "react-transition-group/CSSTransition";

// Hook
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
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
};

const TodoApp = (props) => {
  const [taskState, setTaskState] = useState({
    todayTasks: {
      asdfas: {
        id: "asdfas",
        name: "Now loading ...",
        isDone: false,
        endTime: Date.parse(2020 / 10 / 21),
        taskMinites: 0,
        rank: "A",
      },
    },
  });

  const [progressState, setProgressState] = useLocalStorage("progressState", [
    10,
    30,
  ]);

  let tweetMin = progressState[0];

  var firebase = props.firebase;
  var firebaseDb = firebase.database();
  const userId = firebase.auth().currentUser.uid;
  var todayTasksRef = firebaseDb.ref("users/" + userId + "/todayTasks");
  useEffect(() => {
    firebaseDb
      .ref("users/" + userId + "/todayTasks")
      .once("value", function (snapshot) {
        console.log("here" + snapshot + " : " + snapshot.val());
        if (snapshot.val() === null) {
          console.log("here^");
          firebase
            .database()
            .ref("users/" + userId + "/todayTasks")
            .set({
              asdfas: {
                id: "asdfas",
                name: "NeuToDoにアクセスする",
                isDone: true,
                endTime: 2020 / 10 / 21,
                taskMinites: 10,
                rank: "A",
              },
              afffdjkdk: {
                id: "afffdjkdk",
                name: "Task を登録する",
                isDone: false,
                endTime: Date(),
                taskMinites: 20,
                rank: "A",
              },
            });
          console.log(snapshot.val() + " is initialized");
        }
      });
  }, []);
  useEffect(() => {
    todayTasksRef.on("value", function (snapshot) {
      if (snapshot.val() != null) {
        setTaskState({ todayTasks: snapshot.val() });
      } else {
        console.log("loading!!");
        setTaskState({ todayTasks: "" });
      }
      console.log(snapshot.val());
      console.log("catch changed data from db");
    });
  }, []);

  useEffect(() => {
    var connectedRef = firebaseDb.ref(".info/connected");
    // connectedRef.on("value", function (snap) {
    //   if (snap.val() === true) {
    //     alert("connect" + firebase.auth().currentUser.uid);
    //   } else {
    //     alert("disconnet" + firebase.auth().currentUser.uid);
    //   }
    // });
  });

  const addTaskHandler = () => {
    const todayTasks = taskState.todayTasks;
    const key = Math.random().toString(32).substring(2);
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key)
      .set({
        id: key,
        name: "",
        isDone: false,
        endTime: Date(),
        taskMinites: 30,
        rank: "A",
      });
    // todayTasks.push({
    //   id: key,
    //   name: "",
    //   isDone: false,
    //   endTime: Date(),
    //   taskMinites: 30,
    //   rank: "A",
    // });
    // setTaskState({ todayTasks });
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
    Object.keys(taskState.todayTasks).forEach((key) => {
      allTaskMin += Number(taskState.todayTasks[key].taskMinites);
      if (taskState.todayTasks[key].isDone) {
        doneTaskMin += Number(taskState.todayTasks[key].taskMinites);
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
        {Object.keys(taskState.todayTasks).map((key) => {
          if (!taskState.todayTasks[key].isDone) {
            console.log("task!");
            console.log(taskState.todayTasks[key].id);
            return (
              <CSSTransition
                key={taskState.todayTasks[key].id}
                timeout={500}
                classNames="hi"
              >
                <Task
                  key={taskState.todayTasks[key].id}
                  name={taskState.todayTasks[key].name}
                  isDone={taskState.todayTasks[key].isDone}
                  endTime={taskState.todayTasks[key].endTime}
                  rank={taskState.todayTasks[key].rank}
                  taskMinites={taskState.todayTasks[key].taskMinites}
                  taskMinitesChange={(event) =>
                    taskMinitesChangedHandler(
                      event,
                      taskState.todayTasks[key].id
                    )
                  }
                  done={(event) =>
                    toggleDoneHandler(event, taskState.todayTasks[key].id)
                  }
                  delete={() => deleteTaskHandler(key)}
                  rankChange={(event) =>
                    rankChangedHandler(event, taskState.todayTasks[key].id)
                  }
                  change={(event) =>
                    nameChangedHandler(event, taskState.todayTasks[key].id)
                  }
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
        {Object.keys(taskState.todayTasks).map((key) => {
          if (taskState.todayTasks[key].isDone) {
            return (
              <CSSTransition
                key={taskState.todayTasks[key].id}
                timeout={500}
                classNames="hi"
              >
                <Task
                  key={taskState.todayTasks[key].id}
                  name={taskState.todayTasks[key].name}
                  isDone={taskState.todayTasks[key].isDone}
                  endTime={taskState.todayTasks[key].endTime}
                  rank={taskState.todayTasks[key].rank}
                  taskMinites={taskState.todayTasks[key].taskMinites}
                  taskMinitesChange={(event) =>
                    taskMinitesChangedHandler(
                      event,
                      taskState.todayTasks[key].id
                    )
                  }
                  done={(event) =>
                    toggleDoneHandler(event, taskState.todayTasks[key].id)
                  }
                  delete={() => deleteTaskHandler(key)}
                  rankChange={(event) =>
                    rankChangedHandler(event, taskState.todayTasks[key].id)
                  }
                  change={(event) =>
                    nameChangedHandler(event, taskState.todayTasks[key].id)
                  }
                />
              </CSSTransition>
            );
          }
        })}
      </TransitionGroup>
    </div>
  );
};

export default TodoApp;
