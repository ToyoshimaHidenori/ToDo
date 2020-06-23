import React, { useState, useEffect } from "react";
import "./TodoApp.css";
import Task from "./Task";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "firebase/auth";

import TransitionGroup from "react-transition-group/TransitionGroup";
import CSSTransition from "react-transition-group/CSSTransition";

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

  const [progressState, setProgressState] = useState([0, 1]);

  let tweetMin = progressState[0];

  var firebase = props.firebase;
  var firebaseDb = firebase.database();
  const userId = firebase.auth().currentUser.uid;
  var todayTasksRef = firebaseDb.ref("users/" + userId + "/todayTasks");
  useEffect(() => {
    firebaseDb
      .ref("users/" + userId + "/todayTasks")
      .once("value", function (snapshot) {
        if (snapshot.val() === null) {
          firebase
            .database()
            .ref("users/" + userId + "/todayTasks")
            .set({
              asdfas: {
                id: "asdfas",
                name: "NeuToDoにアクセスする",
                isDone: true,
                endTime: null,
                notificationTime: null,
                taskMinites: 10,
              },
              afffdjkdk: {
                id: "afffdjkdk",
                name: "Task を登録する",
                isDone: false,
                endTime: null,
                notificationTime: null,
                taskMinites: 20,
              },
            });
          firebase
            .database()
            .ref("users/" + userId + "/settings")
            .set({ userName: "匿名" });
          setProgressState([10, 30]);
        } else {
          let allTaskMin = 0;
          let doneTaskMin = 0;
          Object.keys(snapshot.val()).map((key) => {
            allTaskMin += Number(snapshot.val()[key].taskMinites);
            if (snapshot.val()[key].isDone) {
              doneTaskMin += Number(snapshot.val()[key].taskMinites);
            }
          });
          setProgressState([doneTaskMin, allTaskMin]);
        }
      });
  }, []);
  useEffect(() => {
    todayTasksRef.on("value", function (snapshot) {
      if (snapshot.val() != null) {
        setTaskState({ todayTasks: snapshot.val() });
      } else {
        setTaskState({ todayTasks: "" });
      }
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
    setProgressState([progressState[0], progressState[1] + 30]);
  };

  const toggleDoneHandler = (event, key) => {
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key + "/isDone")
      .set(taskState.todayTasks[key].isDone ? false : true);
    if (taskState.todayTasks[key].isDone) {
      setProgressState([
        Number(progressState[0]) -
          Number(taskState.todayTasks[key].taskMinites),
        progressState[1],
      ]);
    } else {
      setProgressState([
        Number(progressState[0]) +
          Number(taskState.todayTasks[key].taskMinites),
        progressState[1],
      ]);
    }
  };

  const nameChangedHandler = (event, key) => {
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key + "/name")
      .set(event.target.value);
  };

  const taskMinitesChangedHandler = (event, key) => {
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key + "/taskMinites")
      .set(event.target.value);

    const todayTask = {
      ...taskState.todayTasks[key],
    };
    const diff = Number(event.target.value) - Number(todayTask.taskMinites);
    if (todayTask.isDone) {
      setProgressState([progressState[0] + diff, progressState[1] + diff]);
    } else {
      setProgressState([progressState[0], progressState[1] + diff]);
    }
  };

  const deleteTaskHandler = (key) => {
    firebaseDb.ref("users/" + userId + "/todayTasks/" + key).remove();
  };

  const calcProgress = () => {
    let allTaskMin = 0;
    let doneTaskMin = 0;
    Object.keys(taskState.todayTasks).map((key) => {
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
                  {progressState[0]}
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
