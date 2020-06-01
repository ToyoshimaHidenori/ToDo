import React, { useState } from "react";
import "./Task.css";

const checkedStyle = {
  background: "#3272fc",
  "box-shadow": "inset 7px 7px 14px #214aa4 inset -7px -7px 14px #449aff",
  color: "#dddddd",
};

const Task = (props) => {
  return (
    <div className={"Task"}>
      {props.isDone ? (
        <button
          className="checkedButton"
          style={{ color: "#3272fc" }}
          onClick={props.done}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
          </svg>
        </button>
      ) : (
        <button className="UncheckedButton" onClick={props.done}>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
          </svg>
        </button>
      )}
      <input type="text" onChange={props.change} value={props.name} />
      <select onChange={props.rankChange} value={props.rank}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <input
        type="number"
        onChange={props.taskMinitesChange}
        value={props.taskMinites}
      />
      min
      <button onClick={props.delete}>remove</button>
    </div>
  );
};

export default Task;
