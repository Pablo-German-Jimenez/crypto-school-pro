import React from "react";
import { ArrowDown, ArrowRight, BookOpen, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const learningPaths = [
  {
    icon: <BookOpen size={20} />,
    level: "PARA EMPEZAR",
    title: "Fundamentos cripto",
    description: "Blockchain, Bitcoin y los conceptos esenciales explicados con claridad.",
    to: "/courses/bitcoin-basics",
  },
  {
    icon: <ShieldCheck size={20} />,
    level: "SEGURIDAD",
    title: "Cuida tus activos",
    description: "Wallets, claves privadas y hábitos para reducir riesgos comunes.",
    to: "/courses/crypto-security",
  },
  {
    icon: <Compass size={20} />,
    level: "EXPLORA",
    title: "DeFi y ecosistemas",
    description: "Conoce protocolos, redes y pools de liquidez antes de interactuar.",
    to: "/courses/defi-essentials",
  },
];

const Index = () => (
  <div className="academy-container home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-badge"><Sparkles size={14} /> EDUCACIÓN CRIPTO PARA TODOS</span>
        <h1>Entiende cripto.<br /><span>Decide con conocimiento.</span></h1>
        <p>Un espacio para aprender sobre Bitcoin, blockchain y activos digitales con explicaciones claras, pensamiento crítico y foco en la seguridad.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/courses">Explorar cursos <ArrowRight size={17} /></Link>
          <Link className="button button-secondary" to="/stocks">Conocer los activos</Link>
        </div>
        <div className="hero-principles">
          <span><ShieldCheck size={16} /> Educación antes que inversión</span>
          <span><BookOpen size={16} /> Aprende a tu ritmo</span>
        </div>
      </div>
      <div className="hero-visual" aria-label="Ilustración educativa de Bitcoin y blockchain" role="img">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-coin">₿</div>
        <div className="hero-floating-card hero-card-top"><span className="hero-card-dot" /> Bloques conectados</div>
        <div className="hero-floating-card hero-card-bottom"><ShieldCheck size={17} /> Aprende con seguridad</div>
        <div className="hero-visual-caption">Conocimiento descentralizado</div>
      </div>
    </section>

    <section className="learning-section" aria-labelledby="learning-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TU RECORRIDO</p>
          <h2 id="learning-title">Aprende paso a paso</h2>
        </div>
        <Link className="text-link" to="/courses">Ver todos los cursos <ArrowRight size={16} /></Link>
      </div>
      <div className="learning-grid">
        {learningPaths.map((path) => (
          <Link className="learning-card" key={path.title} to={path.to}>
            <span className="learning-icon">{path.icon}</span>
            <span className="learning-level">{path.level}</span>
            <h3>{path.title}</h3>
            <p>{path.description}</p>
            <span className="learning-card-link">Explorar <ArrowRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>

    <aside className="home-disclaimer">
      <ArrowDown size={17} />
      <p><strong>Aprender primero.</strong> El contenido es educativo, no constituye asesoramiento financiero y no promete resultados de inversión.</p>
    </aside>
  </div>
);

export default Index;
