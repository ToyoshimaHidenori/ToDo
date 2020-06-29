import React, { useState, useEffect } from "react";
import "./Calendar.css";
import Task from "./Task";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { TwitterShareButton } from "react-twitter-embed";
import "react-circular-progressbar/dist/styles.css";
import "firebase/auth";
import { BrowserRouter as Router } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import CSSTransition from "react-transition-group/CSSTransition";
import { Calendar as CalendarArea } from "react-calendar";

const Calendar = (props) => {
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

  const [selectedDate, selectDate] = useState(new Date());
  useEffect(() => {
    window.addEventListener("beforeunload", () =>
      firebase.database().goOffline()
    );
    return window.removeEventListener("beforeunload", () =>
      firebase.database().goOffline()
    );
  });
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

  const addTaskHandler = () => {
    const key = Math.random().toString(32).substring(2);
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key)
      .set({
        id: key,
        name: "",
        isDone: false,
        endTime: null,
        notificationTime: Date.parse(selectedDate),
        taskMinites: 30,
        rank: "A",
      });
    setProgressState([progressState[0], progressState[1] + 30]);
  };

  const toggleDoneHandler = (event, key) => {
    let now = new Date();
    firebase
      .database()
      .ref("users/" + userId + "/todayTasks/" + key + "/endTime")
      .set(taskState.todayTasks[key].isDone ? null : Date.now());

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

  //20200628<20200701 true
  function lowerThanDateOnly(date1, date2) {
    var year1 = date1.getFullYear();
    var month1 = date1.getMonth() + 1;
    var day1 = date1.getDate();

    var year2 = date2.getFullYear();
    var month2 = date2.getMonth() + 1;
    var day2 = date2.getDate();

    if (year1 == year2) {
      if (month1 == month2) {
        return day1 < day2;
      } else {
        return month1 < month2;
      }
    } else {
      return year1 < year2;
    }
  }

  //20200628<20200701 false
  function sameDateOnly(date1, date2) {
    var year1 = date1.getFullYear();
    var month1 = date1.getMonth() + 1;
    var day1 = date1.getDate();

    var year2 = date2.getFullYear();
    var month2 = date2.getMonth() + 1;
    var day2 = date2.getDate();

    if (year1 == year2) {
      if (month1 == month2) {
        return day1 == day2;
      }
    }
    return false;
  }

  //   Object.keys(taskState.todayTasks).map((key) => {
  // 	if (taskState.todayTasks[key].isDone) {
  // 	  let date = new Date(taskState.todayTasks[key].endTime);
  // 	  if (sameDateOnly(selectedDate, date)){
  // 		key={taskState.todayTasks[key].id}
  // 		name={taskState.todayTasks[key].name}
  // 		isDone={taskState.todayTasks[key].isDone}
  // 		endTime={taskState.todayTasks[key].endTime}
  // 		taskMinites={taskState.todayTasks[key].taskMinites}
  // 	  }
  //   }}

  let todayDate = new Date();

  return (
    <div className="Calendar">
      <div className="header">
        <h1>
          {selectedDate.getFullYear().toString() +
            "年 " +
            (selectedDate.getMonth() + 1).toString() +
            "月 " +
            selectedDate.getDate().toString() +
            "日"}
          {sameDateOnly(selectedDate, todayDate) ? null : (
            <button
              onClick={() => {
                selectDate(todayDate);
              }}
            >
              Today
            </button>
          )}
        </h1>

        <CalendarArea
          onChange={selectDate}
          value={selectedDate}
          nextAriaLabel="next"
          nextLabel="　　›　　"
          prevLabel="　　‹　　"
          next2Label="　»　"
          prev2Label="　«　"
          // tileContent={({ date, view }) =>
          //   view === "month" && date.getDay() === 0 ? <p>It's Sunday!</p> : null
          // }
        />

        <progress
          id="progressbar"
          max={progressState[1]}
          value={progressState[0]}
        ></progress>
      </div>
      <TransitionGroup>
        {Object.keys(taskState.todayTasks).map((key) => {
          if (!taskState.todayTasks[key].isDone) {
            let date = new Date(taskState.todayTasks[key].notificationTime);
            if (
              (sameDateOnly(selectedDate, todayDate) &&
                lowerThanDateOnly(date, selectedDate)) ||
              (sameDateOnly(selectedDate, date) &&
                !lowerThanDateOnly(selectedDate, todayDate))
            )
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
        {!lowerThanDateOnly(selectedDate, todayDate) ? (
          <button className="Button" onClick={addTaskHandler}>
            Add task
          </button>
        ) : null}
      </div>
      <TransitionGroup>
        {Object.keys(taskState.todayTasks).map((key) => {
          if (taskState.todayTasks[key].isDone) {
            let date = new Date(taskState.todayTasks[key].endTime);
            if (sameDateOnly(selectedDate, date))
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

export default Calendar;
