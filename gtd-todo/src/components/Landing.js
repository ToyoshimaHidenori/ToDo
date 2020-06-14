import React from "react";
import { Link } from "react-router-dom";
import success from "../img/success_.svg";
import enjoy from "../img/enjoy_.svg";
import improve from "../img/improve_.svg";
import online from "../img/online_.svg";
import Task from "./Task";
import "./Landing.css";

const Landing = (props) => {
  return (
    <div className="Landing">
      <section className="LandingHeader">
        <img src={success} alt="success" />
        <h1>
          すべてのタスクを完遂して、<span>１日を終えましょう。</span>
        </h1>
        <p>
          NeuToDo は革新的な機能を<span>提供するアプリ。</span>
          <span>タスク管理を</span>強力にサポートします。
        </p>
      </section>

      <section>
        <div className="SampleTask">
          <Task
            key="landing"
            name="NeuToDoにアクセス"
            isDone={false}
            endTime=""
            rank="A"
            taskMinites="1"
          />
        </div>
        <h2>タスクを美しくデザイン。</h2>
        <p>
          シンプルに、でも美しく。あなたのタスク管理をさりげなく彩るために、Neumorphismを使用しました。
        </p>
      </section>

      <section>
        <img src={enjoy} alt="enjoy" />
        <h2>楽しみまで全力で。</h2>
        <p>
          あなたが本当にしたいことは、緊急度が高いタスクに埋れていませんか？
          NeuToDo は楽しいことまで、すべてのタスク完遂をサポートします。
        </p>
      </section>
      <section>
        <img src={online} alt="online" />
        <h2>友達があなたの力に。</h2>
        <p>
          今日のあなたの進捗を気軽にシェアできます。
          SNSで成果をシェアすることで、友人があなたのタスク管理を応援します。
        </p>
      </section>
      <section>
        <img src={improve} alt="improve" />
        <h2>継続的な機能追加。</h2>
        <p>
          NeuToDo
          はタスク管理をサポートするため、継続的かつ革新的な機能追加を予定しています。
          また、ソースコードの一部をOSSとして公開しています。あなたの協力をお待ちしております。
        </p>
      </section>
    </div>
  );
};

export default Landing;
