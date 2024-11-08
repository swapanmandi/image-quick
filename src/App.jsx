import React from "react";
import "./App.css";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className=" bg-darkPalette-200 h-svh">
      <Header />
      <div className=" min-h-[80%]">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default App;
