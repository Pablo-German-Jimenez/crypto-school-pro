import React from "react";
import { useState } from "react";
import { ArrowRight, BookOpen, CircleHelp, FileText, GraduationCap, LayoutDashboard, LogOut, Settings, ShieldCheck, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/auth.js";
import { auth } from "../firebase.js";

const demoCourses = [
  { title: "Bitcoin y blockchain desde cero", topic: "Fundamentos", status: "Publicado", lessons: 4 },
  { title: "Seguridad y autocustodia", topic: "Seguridad", status: "Publicado", lessons: 4 },
  { title: "Introducción a DeFi", topic: "Ecosistemas", status: "En preparación", lessons: 4 },
];

const Administrator = () => {
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (!auth) {
      setLogoutError("No se pudo conectar con Firebase para cerrar la sesión.");
      return;
    }

    setLogoutBusy(true);
    setLogoutError("");
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("No se pudo cerrar la sesión. Inténtalo nuevamente.");
    } finally {
      setLogoutBusy(false);
    }
  };

  return (
    <section className="academy-container admin-page">
      <div className="admin-account-bar">
        <p>Sesión iniciada como <strong>{user?.email}</strong></p>
        <button className="admin-logout-button" disabled={logoutBusy} onClick={handleSignOut} type="button">
          <LogOut size={15} /> {logoutBusy ? "Cerrando…" : "Cerrar sesión"}
        </button>
      </div>
      {logoutError && <p className="form-notice form-error admin-logout-error" role="alert">{logoutError}</p>}
      <header className="admin-welcome">
        <div>
          <p className="eyebrow">PANEL DE ADMINISTRACIÓN · VISTA DEMO</p>
          <h1>Centro de aprendizaje</h1>
          <p>Una vista de referencia para organizar los contenidos educativos de CryptoSchool.</p>
        </div>
        <span className="admin-demo-badge"><ShieldCheck size={15} /> Datos de ejemplo</span>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Secciones del administrador">
          <span className="admin-sidebar-title">ESPACIO DE TRABAJO</span>
          <span className="admin-sidebar-link admin-sidebar-active"><LayoutDashboard size={17} /> Resumen</span>
          <Link className="admin-sidebar-link" to="/courses"><BookOpen size={17} /> Cursos</Link>
          <span className="admin-sidebar-link"><Users size={17} /> Comunidad</span>
          <span className="admin-sidebar-link"><FileText size={17} /> Recursos</span>
          <span className="admin-sidebar-link"><Settings size={17} /> Ajustes</span>
          <div className="admin-sidebar-help"><CircleHelp size={18} /><p>¿Buscas aprender?</p><Link to="/courses">Visita la biblioteca <ArrowRight size={14} /></Link></div>
        </aside>
        <div className="admin-content">
          <div className="admin-overview-heading"><div><h2>Resumen general</h2><p>Vista estática para presentar la estructura del panel.</p></div><span className="admin-date-label">Modo de demostración</span></div>
          <div className="admin-stat-grid">
            <article className="admin-stat-card"><span className="admin-stat-icon"><BookOpen size={19} /></span><span>Cursos en biblioteca</span><strong>03</strong><small>Contenido de ejemplo</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon admin-stat-purple"><GraduationCap size={19} /></span><span>Rutas de aprendizaje</span><strong>03</strong><small>Fundamentos, seguridad, DeFi</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon admin-stat-gold"><ShieldCheck size={19} /></span><span>Enfoque educativo</span><strong>100%</strong><small>Sin asesoramiento financiero</small></article>
          </div>
          <section className="admin-course-table">
            <div className="admin-table-heading"><div><h2>Biblioteca de cursos</h2><p>Ejemplo de contenidos que podría gestionar el equipo.</p></div><Link className="text-link" to="/courses">Abrir biblioteca <ArrowRight size={15} /></Link></div>
            <div className="admin-table-scroll">
              <table>
                <thead><tr><th>Curso</th><th>Categoría</th><th>Módulos</th><th>Estado</th></tr></thead>
                <tbody>
                  {demoCourses.map((course) => (
                    <tr key={course.title}>
                      <td><span className="admin-course-icon"><BookOpen size={16} /></span>{course.title}</td>
                      <td>{course.topic}</td>
                      <td>{course.lessons} módulos</td>
                      <td><span className={`admin-status ${course.status === "Publicado" ? "admin-status-live" : ""}`}>{course.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <p className="admin-demo-note">Este panel usa métricas de ejemplo y no tiene operaciones reales de gestión. El acceso requiere sesión, pero todavía no distingue roles administrativos.</p>
        </div>
      </div>
    </section>
  );
};

export default Administrator;
