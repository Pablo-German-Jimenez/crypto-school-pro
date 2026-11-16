import React, { useMemo, useState } from "react";
import { ArrowRight, Bitcoin, CircleDollarSign, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const assets = [
  { ticker: "BTC", name: "Bitcoin", category: "Moneda digital", network: "Bitcoin", description: "Red monetaria descentralizada con una emisión previsible.", course: "bitcoin-basics" },
  { ticker: "ETH", name: "Ethereum", category: "Plataforma", network: "Ethereum", description: "Plataforma programable para aplicaciones y contratos inteligentes.", course: "defi-essentials" },
  { ticker: "SOL", name: "Solana", category: "Plataforma", network: "Solana", description: "Blockchain de alto rendimiento con un amplio ecosistema de aplicaciones.", course: "defi-essentials" },
  { ticker: "USDC", name: "USD Coin", category: "Stablecoin", network: "Multired", description: "Activo digital diseñado para mantener paridad con el dólar estadounidense.", course: "bitcoin-basics" },
  { ticker: "XRP", name: "XRP", category: "Activo digital", network: "XRP Ledger", description: "Activo nativo de una red enfocada en liquidación y transferencia de valor.", course: "bitcoin-basics" },
  { ticker: "ADA", name: "Cardano", category: "Plataforma", network: "Cardano", description: "Blockchain de prueba de participación con un enfoque de desarrollo formal.", course: "defi-essentials" },
];

const categories = ["Todos", "Moneda digital", "Plataforma", "Stablecoin", "Activo digital"];

const Stocks = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const visibleAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesCategory = category === "Todos" || asset.category === category;
      const matchesQuery = !normalizedQuery || `${asset.name} ${asset.ticker} ${asset.network}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section className="academy-container assets-page">
      <header className="page-intro assets-intro">
        <p className="eyebrow">GLOSARIO DE ACTIVOS DIGITALES</p>
        <h1>Conoce antes de explorar</h1>
        <p>Una guía introductoria de algunos activos y redes del ecosistema. Aprende qué son y cómo se diferencian; aquí no hay cotizaciones ni recomendaciones de compra.</p>
      </header>
      <div className="assets-tools">
        <label className="asset-search">
          <Search size={18} />
          <span className="visually-hidden">Buscar activos</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, ticker o red..." value={query} />
        </label>
        <label className="asset-category">
          <span className="visually-hidden">Filtrar por categoría</span>
          <select onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="asset-result-count" aria-live="polite">{visibleAssets.length} {visibleAssets.length === 1 ? "activo" : "activos"} para explorar</p>
      {visibleAssets.length > 0 ? (
        <div className="assets-grid">
          {visibleAssets.map((asset, index) => (
            <article className="asset-card" key={asset.ticker}>
              <div className={`asset-symbol asset-symbol-${index % 4}`}>
                {asset.ticker === "BTC" ? <Bitcoin size={24} /> : <CircleDollarSign size={23} />}
              </div>
              <span className="asset-category-tag">{asset.category}</span>
              <h2>{asset.name} <span>{asset.ticker}</span></h2>
              <p>{asset.description}</p>
              <div className="asset-network"><span>Red / referencia</span><strong>{asset.network}</strong></div>
              <Link className="text-link" to={`/courses/${asset.course}`}>Aprender conceptos <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-search"><Search size={22} /><p>No encontramos activos con esos filtros.</p><button className="text-link" onClick={() => { setQuery(""); setCategory("Todos"); }} type="button">Limpiar búsqueda</button></div>
      )}
      <aside className="education-note"><ShieldCheck size={17} /> Los criptoactivos son volátiles y conllevan riesgos. Esta guía es educativa; investiga de forma independiente.</aside>
    </section>
  );
};

export default Stocks;
