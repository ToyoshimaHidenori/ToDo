import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    person: [{ name: "max" }, { name: "john" }],
    otherState: "some other value",
  };

  buttonHandler = () => {
    this.setState({
      person: [{ name: "maximam" }, { name: "john" }],
      otherState: "some other value",
    });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.buttonHandler}> button </button>
        <p>{this.state.person[0].name}</p>
        <h1>This is GTD todo</h1>
      </div>
    );
  }
}

export default App;
