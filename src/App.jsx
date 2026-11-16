import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MenuNavBar from "./components/shared/MenuNavBar.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import CryptoTicker from "./CryptoTicker.jsx";
import FooterBboyLinkinStyle from "./components/shared/FooterBboyLinkinStyle.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Administrator from "./pages/Administrator.jsx";
import Error404 from "./pages/Error404.jsx";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import MeteoraPools from "./pages/MeteoraPools.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Stocks from "./pages/Stocks.jsx";
import "./academy.css";

function AppContent() {
  const [lightOn, setLightOn] = useState(true);

  return (
    <div className={`app-shell ${lightOn ? "app-shell--light" : "app-shell--dark"}`}>
      <div className="theme-toolbar academy-container">
        <button
          aria-label={`Cambiar a tema ${lightOn ? "oscuro" : "claro"}`}
          className="theme-toggle"
          onClick={() => setLightOn((current) => !current)}
          type="button"
        >
          <span aria-hidden="true">{lightOn ? "☾" : "☀"}</span>
          {lightOn ? "Modo oscuro" : "Modo claro"}
        </button>
      </div>
      <MenuNavBar />
      <CryptoTicker />
      <main className="academy-main">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/administrator"
            element={
              <ProtectedRoute>
                <Administrator />
              </ProtectedRoute>
            }
          />
          <Route path="/courses" element={<ProductDetail />} />
          <Route path="/courses/:courseId" element={<ProductDetail />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/meteora-pools" element={<MeteoraPools />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <FooterBboyLinkinStyle />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
