import React, { useState } from "react";
import "./Task.css";

const Task = (props) => {
  return (
    <div className="Task">
      <h2>{props.name}</h2>
      <p id={props.key}>{props.rank}</p>
      <button onClick={props.done}>Toggle</button>
      {props.isDone ? <p>done</p> : <p>wip</p>}

      <input type="text" onChange={props.change} value={props.name} />
      <p onClick={props.delete}>remove</p>
    </div>
  );
};

export default Task;
