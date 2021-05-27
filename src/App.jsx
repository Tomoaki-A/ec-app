import React from "react";
import Router from "./Router";
import "./assets/reset.css";
import "./assets/style.css";
import { Header } from "./components/Header/index";

const App = () => {
  return (
    <>
    <Header/>
    <main className="c-main">
      <Router />
    </main>
    </>
  );
};

export default App;
