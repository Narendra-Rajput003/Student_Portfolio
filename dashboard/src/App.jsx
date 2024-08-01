import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage"
import {Login} from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Skills from "./pages/Skills"
import Timeline from "./pages/TimeLine"
import Projects from "./pages/Projects"
import ViewProject from "./pages/ViewProject"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/password/forgot" element={<ForgotPassword/>} />
          <Route path="/password/reset/:token" element={<ResetPassword/>} />
          <Route path="/skills" element={<Skills/>} />
          <Route path="/timeline" element={<Timeline/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/view/project/:id" element={<ViewProject/>} />
        </Routes>
        <ToastContainer position="bottom-right" theme="dark"/>
      </Router>
     
    </>
  );
}

export default App;
