import React from "react";
import "./App.css";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import FeaturesSection from "./components/FeaturesSection.JSX";

function App() {
  return (
    <div className=" bg-darkPalette-200 h-svh">
      <Header />
      <div className=" min-h-[60vh]">
        <Outlet />
      </div>
      <FeaturesSection />
      <p className=" text-sm place-self-center p-4">
        Made with ❤️ by <a href="">Swapan Mandi</a>
      </p>
      <Footer />
    </div>
  );
}

export default App;
