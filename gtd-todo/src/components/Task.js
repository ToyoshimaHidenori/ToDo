import React from "react";
import "./Task.css";

const Task = (props) => {
  return (
    <div className={"Task"}>
      <div className={props.isDone ? "Checked" : "Unchecked"}>
        <button className="CheckBox" onClick={props.done}>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="New task"
          onChange={props.change}
          value={props.name}
        />
        <select onChange={props.rankChange} value={props.rank}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <div className="InputNum">
          <input
            type="number"
            onChange={props.taskMinitesChange}
            value={props.taskMinites}
          />
          min
        </div>
        <button className="Trash" onClick={props.delete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Task;
