import React from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, GraduationCap, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const courses = [
  {
    id: "bitcoin-basics",
    category: "FUNDAMENTOS",
    title: "Bitcoin y blockchain desde cero",
    description: "Comprende cómo funciona Bitcoin, qué problema propone resolver y cómo se registran las transacciones en una blockchain.",
    duration: "4 módulos · ritmo propio",
    level: "Principiante",
    lessons: ["Qué es el dinero digital", "Cómo funciona una blockchain", "Bitcoin, minería y consenso", "Wallets y autocustodia"],
  },
  {
    id: "crypto-security",
    category: "SEGURIDAD",
    title: "Seguridad y autocustodia",
    description: "Aprende la diferencia entre wallets, claves y frases de recuperación para reconocer riesgos antes de operar.",
    duration: "3 módulos · ritmo propio",
    level: "Principiante",
    lessons: ["Claves públicas y privadas", "Tipos de wallets", "Phishing y buenas prácticas", "Respaldo y recuperación"],
  },
  {
    id: "defi-essentials",
    category: "ECOSISTEMAS",
    title: "Introducción a DeFi",
    description: "Explora aplicaciones descentralizadas, contratos inteligentes y pools de liquidez desde una perspectiva educativa.",
    duration: "5 módulos · ritmo propio",
    level: "Intermedio",
    lessons: ["Contratos inteligentes", "Exchanges descentralizados", "Pools y provisión de liquidez", "Riesgos de los protocolos"],
  },
];

const ProductDetail = () => {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId);

  if (!courseId) {
    return (
      <section className="academy-container catalog-page">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Inicio</Link>
        <div className="page-intro">
          <p className="eyebrow">BIBLIOTECA CRYPTOSCHOOL</p>
          <h1>Rutas para aprender con criterio</h1>
          <p>Contenidos introductorios sobre activos digitales, seguridad y finanzas descentralizadas.</p>
        </div>
        <div className="course-catalog-grid">
          {courses.map((item) => (
            <article className="course-card" key={item.id}>
              <span className="course-card-icon"><BookOpen size={22} /></span>
              <p className="eyebrow">{item.category}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="course-card-meta"><span><Clock3 size={15} /> {item.duration}</span><span>{item.level}</span></div>
              <Link className="text-link" to={`/courses/${item.id}`}>Ver programa <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
        <p className="education-note"><ShieldCheck size={17} /> Material educativo. No es asesoramiento financiero ni una recomendación de compra.</p>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="academy-container course-not-found">
        <BookOpen size={30} />
        <p className="eyebrow">CURSO NO DISPONIBLE</p>
        <h1>No encontramos esa ruta de aprendizaje.</h1>
        <Link className="button button-primary" to="/courses">Explorar cursos <ArrowRight size={17} /></Link>
      </section>
    );
  }

  return (
    <section className="academy-container course-detail-page">
      <Link className="back-link" to="/courses"><ArrowLeft size={16} /> Todos los cursos</Link>
      <div className="course-detail-hero">
        <div>
          <p className="eyebrow">{course.category} · {course.level.toUpperCase()}</p>
          <h1>{course.title}</h1>
          <p className="course-lead">{course.description}</p>
          <div className="course-detail-meta"><span><Clock3 size={17} /> {course.duration}</span><span><GraduationCap size={18} /> Aprendizaje guiado</span></div>
          <Link className="button button-primary" to="/login">Comenzar a aprender <ArrowRight size={17} /></Link>
        </div>
        <div className="course-hero-mark" aria-hidden="true"><BookOpen size={64} /></div>
      </div>
      <div className="course-outline">
        <div>
          <p className="eyebrow">CONTENIDO DEL CURSO</p>
          <h2>Lo que vas a descubrir</h2>
        </div>
        <ol>
          {course.lessons.map((lesson) => <li key={lesson}><span><Check size={16} /></span>{lesson}</li>)}
        </ol>
      </div>
      <p className="education-note"><ShieldCheck size={17} /> Este material es informativo y no constituye una recomendación de inversión.</p>
    </section>
  );
};

export default ProductDetail;
