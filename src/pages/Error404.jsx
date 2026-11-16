import React from "react";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const Error404 = () => (
  <section className="academy-container not-found-page">
    <div className="not-found-orbit"><Compass size={48} /></div>
    <p className="eyebrow">ERROR 404 · RUTA NO ENCONTRADA</p>
    <h1>Esta página todavía no está en el mapa.</h1>
    <p>Puede que el enlace haya cambiado. Vuelve al inicio o explora las rutas de aprendizaje.</p>
    <div className="hero-actions">
      <Link className="button button-primary" to="/"><ArrowLeft size={17} /> Ir al inicio</Link>
      <Link className="button button-secondary" to="/courses">Explorar cursos <ArrowRight size={17} /></Link>
    </div>
  </section>
);

export default Error404;
