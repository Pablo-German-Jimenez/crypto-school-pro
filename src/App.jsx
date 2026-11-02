import React, { useState, useEffect } from "react";
import MenuNavBar from "./components/shared/MenuNavBar";
import CryptoTicker from "./CryptoTicker.jsx";
import FooterBboyLinkinStyle from "./components/shared/FooterBboyLinkinStyle.jsx";

function App() {
  const [lightOn, setLightOn] = useState(true);

  const toggleLight = () => {
    setLightOn(!lightOn);
  };

  return (
    <>
      <div
        className={`d-flex flex-column min-vh-100 ${lightOn ? "bg-light text-dark" : "bg-dark text-white"}`}
      >
        <div className="d-flex justify-content-end p-1container">
          <button
            onClick={toggleLight}
            className={`btn ${lightOn ? "btn-light text-dark border" : "btn-dark text-white border"}`}
            type="button"
          >
            {lightOn ? `☀️Light Mode` : "🌙 Dark Move"}
          </button>
        </div>
        <main className="container flex-grow-1">
          <MenuNavBar />
          <CryptoTicker />
          <div className="text-center my-3">
            <img
              className="img-fluid rounded shadow"
              src="../public/GodandIA.png"
              alt="godAndIa"
            />
          </div>
          <FooterBboyLinkinStyle />
        </main>
      </div>
    </>
  );
}

export default App;
