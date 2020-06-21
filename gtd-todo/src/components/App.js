import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import TodoApp from "./TodoApp";
import Nav from "./Nav";
import Landing from "./Landing";
import Login from "./Login";
import "./App.css";
import firebase from "firebase";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyAIZ8k0Ego7xGT0x1uc0dIFUFK-iUMhGO8",
  authDomain: "neutodo.firebaseapp.com",
  databaseURL: "https://neutodo.firebaseio.com",
  projectId: "neutodo",
  storageBucket: "neutodo.appspot.com",
  messagingSenderId: "912686861825",
  appId: "1:912686861825:web:265d66a218a91bb70a3a00",
  measurementId: "G-8EMHMXKZF6",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const firebaseDb = firebase.database();

let loading = false;
const toggleLoading = () => {
  loading = loading ? false : true;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => setCurrentUser(user));
  }, []);

  return (
    <Router>
      <div className="wrapper">
        <Nav>Neu ToDo</Nav>
        <div>
          <Switch>
            <Route path="/guest/home">
              <TodoApp />
            </Route>
            <PrivateRoute path="/home/calender" currentUser={currentUser}>
              <p>coming soon!</p>
            </PrivateRoute>
            <PrivateRoute path="/home" currentUser={currentUser}>
              <TodoApp firebase={firebase} />
            </PrivateRoute>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/policy">
              <Policy />
            </Route>
            <Route path="/login" currentUsery={currentUser}>
              <Login
                firebase={firebase}
                user={currentUser}
                loading={loading}
                toggleLoading={() => toggleLoading()}
              />
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
          <div>
            <div className="Links">
              <Link to="/policy">プライバシーポリシー&利用規約</Link>
            </div>
            <div className="Links">
              <Link to="/contact">お問い合わせ</Link>
            </div>
          </div>
          <small>
            ©︎<a href="https://toyo.dev">Toyoshima Hidenori</a> 2020, v1.0.0
          </small>
        </div>
      </div>
      {/* <p className="App-intro">
        UID: {firebase.auth().currentUser && firebase.auth().currentUser.uid}
      </p>
      <p className="App-intro">UID: {currentUser && currentUser.uid}</p> */}
    </Router>
  );
}

function Contact() {
  return (
    <div>
      <h2>Contact</h2>
      <p>mail: t@toyo.dev</p>
      homepage: <a href="https://toyo.dev"> toyo.dev </a>
    </div>
  );
}

function Policy() {
  return (
    <div>
      <h2>Policy</h2>
      <p>
        本サイトはLocal Stateを使用して、ブラウザに情報を保存しています。
        また、Google Analytics、Google Adsenseを利用しています。
        このサイトではユーザーの許可もしくはユーザーの事前通知なしに入力情報の公開する機能はありませんが、機密情報等の入力は控えていただきたく存じます。
        入力情報のメタ情報はサービス向上のために活用します。
      </p>
    </div>
  );
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
    <div style={{ textAlign: "center" }}>
      <h2>進捗公開機能(coming soon!)</h2>
      <p>他の人が公開した頑張りを見ることができます。</p>
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

function PrivateRoute({ children }) {
  var user = firebase.auth().currentUser;
  if (user) {
    //サインインしてるとき（そのまま表示）
    return children;
  } else {
    //してないとき（ログイン画面にリダイレクト）
    return <Redirect to="/login" />;
  }
}
