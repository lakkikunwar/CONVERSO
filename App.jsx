import React from "react";
import Spline from '@splinetool/react-spline';
import axios from "axios";

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Logout from "./components/Logout"; 
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";

import "./App.css";
import "./styles.css";
import LoginPage from "./components/LoginPage";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/signup" element={<SignUpForm />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
  );
};

export default App;
