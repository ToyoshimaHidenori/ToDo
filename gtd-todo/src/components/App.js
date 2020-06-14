import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import TodoApp from "./TodoApp";
import Nav from "./Nav";
import Landing from "./Landing";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="wrapper">
        <Nav>Neu ToDo</Nav>
        <div>
          <Switch>
            <Route path="/home">
              <TodoApp />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/policy">
              <Policy />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signin">
              <Signin />
            </Route>
            <Route path="/help">
              <Help />
            </Route>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        <div className="footer">
          <div className="Links">
            <Link to="/policy">プライバシーポリシー&利用規約</Link>
          </div>
          <div className="Links">
            <Link to="/contact">お問い合わせ</Link>
          </div>
          <small>
            ©︎<a href="https://toyo.dev">Toyoshima Hidenori</a> 2020, v1.0.0
          </small>
        </div>
      </div>
    </Router>
  );
}

function Contact() {
  return <h2>Contact</h2>;
}

function Policy() {
  return <h2>Policy</h2>;
}

function Login() {
  return <h2>Landing</h2>;
}
function Signin() {
  return <h2>Contact</h2>;
}

function Help() {
  return <h2>Landing</h2>;
}

function NotFound() {
  return <h2>NotFound</h2>;
}

function Users() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>進捗公開機能(coming soon!)</h2>
      <p>他の人の頑張りを見ることができます。</p>
      <Switch>
        <Route path={`${match.path}/:userId/:date`}>
          <User />
        </Route>
        <Route path={`${match.path}/:userId/`}>
          <h3>Please select a date.</h3>
        </Route>
        <Route path={match.path}>
          <h3>ユーザーを選択してください。</h3>
        </Route>
      </Switch>
    </div>
  );
}

function User() {
  let { userId, date } = useParams();
  return (
    <div>
      <h3>Requested User ID: {userId}</h3>
      <p>date: {date}</p>
    </div>
  );
}
