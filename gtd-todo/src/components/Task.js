import React from "react";
import "./Task.css";

const Task = (props) => {
  return (
    <div className={"Task"}>
      <div className={props.isDone ? "Checked" : "Unchecked"}>
        <button
          className="CheckBox"
          aria-label="Toggle done"
          onClick={props.done}
        >
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
          </svg>
        </button>
        <input
          type="text"
          id="task name"
          placeholder="New task"
          onChange={props.change}
          value={props.name}
        />
        {/* <select onChange={props.rankChange} value={props.rank}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select> */}
        <div className="InputNum">
          <input
            type="number"
            id="task minites"
            onChange={props.taskMinitesChange}
            value={props.taskMinites}
          />
          min
        </div>
        {/* <button className="Trash" onClick={() => console.log("calender")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M17 1c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-12 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2zm13 5v10h-16v-10h16zm2-6h-2v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1h-8v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1h-2v18h20v-18zm4 3v19h-22v-2h20v-17h2zm-17 7h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
          </svg>
        </button> */}
        {/* <input
          type="date"
          onChange={props.endTimeChange}
          value={props.endTime}
        /> */}
        <button
          className="Trash"
          aria-label="Remove Task"
          onClick={props.delete}
        >
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
