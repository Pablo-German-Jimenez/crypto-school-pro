import React from "react";
import { BookOpen, ChartNoAxesCombined, CircleDollarSign, LogIn } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth.js";

const MenuNavBar = () => {
  const { user } = useAuth();

  return (
    <header className="site-header">
      <nav className="academy-nav academy-container" aria-label="Navegación principal">
        <Link className="academy-brand" to="/">
          <span className="academy-brand-mark" aria-hidden="true">
            <CircleDollarSign size={22} />
          </span>
          <span>
            <strong>CryptoSchool</strong>
            <small>Aprende. Comprende. Decide.</small>
          </span>
        </Link>
        <div className="academy-nav-links">
          <NavLink end to="/" className={({ isActive }) => `academy-nav-link${isActive ? " is-active" : ""}`}>
            Inicio
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `academy-nav-link${isActive ? " is-active" : ""}`}>
            <BookOpen size={16} /> Cursos
          </NavLink>
          <NavLink to="/stocks" className={({ isActive }) => `academy-nav-link${isActive ? " is-active" : ""}`}>
            <ChartNoAxesCombined size={16} /> Activos
          </NavLink>
          <NavLink to="/meteora-pools" className={({ isActive }) => `academy-nav-link${isActive ? " is-active" : ""}`}>
            Pools
          </NavLink>
        </div>
        <Link className="academy-login-link" to={user ? "/administrator" : "/login"}>
          <LogIn size={16} />
          {user ? "Mi panel" : "Iniciar sesión"}
        </Link>
      </nav>
    </header>
  );
};

export default MenuNavBar;
