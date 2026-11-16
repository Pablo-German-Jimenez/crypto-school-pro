import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCw, TrendingUp } from "lucide-react";
import "./MeteoraPools.css";

const API_BASE = "https://dlmm.datapi.meteora.ag";
const POOL_LIMIT = 24;
const REFRESH_INTERVAL = 60_000;

const formatUsd = (value) => {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1 ? 0 : 4,
  }).format(value);
};

const formatPercent = (value) => {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const getTokenLabel = (token) =>
  token?.symbol || token?.name || "Token";

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Meteora respondió con HTTP ${response.status}`);
  }
  return response.json();
}

function getTrendPercent(candles) {
  if (!Array.isArray(candles) || candles.length < 2) return null;

  const orderedCandles = [...candles].sort(
    (first, second) => first.timestamp - second.timestamp,
  );
  const firstOpen = Number(orderedCandles[0].open);
  const lastClose = Number(orderedCandles.at(-1).close);

  if (!Number.isFinite(firstOpen) || firstOpen <= 0 || !Number.isFinite(lastClose)) {
    return null;
  }

  const firstTimestamp = Number(orderedCandles[0].timestamp);
  const lastTimestamp = Number(orderedCandles.at(-1).timestamp);
  const observedHours =
    Number.isFinite(firstTimestamp) && Number.isFinite(lastTimestamp)
      ? Math.max(1, Math.round((lastTimestamp - firstTimestamp) / 3600) + 1)
      : null;

  return {
    changePct: ((lastClose - firstOpen) / firstOpen) * 100,
    observedHours,
  };
}

async function loadTrendingPools(signal) {
  const poolParams = new URLSearchParams({
    page: "1",
    page_size: String(POOL_LIMIT),
    sort_by: "volume_24h:desc",
    filter_by: "is_blacklisted=false",
  });
  const poolResponse = await fetchJson(
    `${API_BASE}/pools?${poolParams.toString()}`,
    signal,
  );
  if (!Array.isArray(poolResponse.data)) {
    throw new Error("La API de Meteora devolvió una lista de pools inválida.");
  }
  const pools = poolResponse.data;
  const results = await Promise.all(
    pools.map(async (pool) => {
      try {
        const candleResponse = await fetchJson(
          `${API_BASE}/pools/${encodeURIComponent(pool.address)}/ohlcv?timeframe=1h`,
          signal,
        );
        const trend = getTrendPercent(candleResponse.data);
        return trend === null ? null : { ...pool, ...trend };
      } catch (error) {
        if (error.name === "AbortError") throw error;
        return null;
      }
    }),
  );

  return {
    pools: results.filter(Boolean),
    totalPools: pools.length,
    unavailableCandles: results.filter((pool) => !pool).length,
  };
}

const MeteoraPools=()=>{
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [unavailableCandles, setUnavailableCandles] = useState(0);
  const [evaluatedPools, setEvaluatedPools] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [minimumChange, setMinimumChange] = useState("1");
  const [maximumChange, setMaximumChange] = useState("20");
  const [minimumTvl, setMinimumTvl] = useState("10000");
  const [minimumVolume, setMinimumVolume] = useState("1000");

  const refreshPools = useCallback(async (signal, isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    else setRefreshing(true);

    try {
      const result = await loadTrendingPools(signal);
      setPools(result.pools);
      setUnavailableCandles(result.unavailableCandles);
      setEvaluatedPools(result.totalPools);
      setLastUpdated(new Date());
      setError("");
    } catch (fetchError) {
      if (fetchError.name !== "AbortError") {
        setError(
          "No se pudieron cargar los pools de Meteora. Comprueba tu conexión e inténtalo de nuevo.",
        );
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshPools(controller.signal, true);

    const intervalId = window.setInterval(() => {
      refreshPools(controller.signal);
    }, REFRESH_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [refreshPools]);

  const visiblePools = useMemo(() => {
    const minChange = Number(minimumChange);
    const maxChange = Number(maximumChange);
    const minTvl = Number(minimumTvl);
    const minVolume = Number(minimumVolume);

    return pools
      .filter(
        (pool) =>
          pool.changePct >= minChange &&
          pool.changePct <= maxChange &&
          Number(pool.tvl) >= minTvl &&
          Number(pool.volume?.["24h"]) >= minVolume,
      )
      .sort((first, second) => second.changePct - first.changePct);
  }, [pools, minimumChange, maximumChange, minimumTvl, minimumVolume]);

  const handleManualRefresh = () => {
    refreshPools(new AbortController().signal);
  };

  return (
    <section className="meteora-page" aria-labelledby="meteora-title">
      <header className="meteora-header">
        <div>
          <p className="meteora-eyebrow">SOLANA · DLMM</p>
          <h1 id="meteora-title">Pools en tendencia</h1>
          <p className="meteora-description">
            Pools con variación positiva en las velas horarias más recientes
            que entrega la API. La ventana puede variar según la disponibilidad
            de datos; no es una predicción ni garantiza beneficios.
          </p>
        </div>
        <button
          className="meteora-refresh"
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing || loading}
        >
          <RefreshCw size={16} className={refreshing ? "meteora-spin" : ""} />
          {refreshing ? "Actualizando" : "Actualizar"}
        </button>
      </header>

      <div className="meteora-meta">
        <span className="meteora-live-dot" />
        <span>Datos de la API de Meteora</span>
        <span className="meteora-meta-separator">·</span>
        <span>Se actualiza cada 60 s</span>
        {lastUpdated && (
          <>
            <span className="meteora-meta-separator">·</span>
            <span>
              Actualizado {lastUpdated.toLocaleTimeString()}
            </span>
          </>
        )}
      </div>

      <div className="meteora-filters" aria-label="Filtros de pools">
        <label>
          Variación mínima (%)
          <input
            type="number"
            step="0.1"
            value={minimumChange}
            onChange={(event) => setMinimumChange(event.target.value)}
          />
        </label>
        <label>
          Variación máxima (%)
          <input
            type="number"
            step="0.1"
            value={maximumChange}
            onChange={(event) => setMaximumChange(event.target.value)}
          />
        </label>
        <label>
          TVL mínimo (USD)
          <input
            type="number"
            min="0"
            step="1000"
            value={minimumTvl}
            onChange={(event) => setMinimumTvl(event.target.value)}
          />
        </label>
        <label>
          Volumen 24 h mínimo (USD)
          <input
            type="number"
            min="0"
            step="1000"
            value={minimumVolume}
            onChange={(event) => setMinimumVolume(event.target.value)}
          />
        </label>
      </div>

      {error && (
        <div className="meteora-message meteora-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={handleManualRefresh}>
            Reintentar
          </button>
        </div>
      )}

      {unavailableCandles > 0 && !error && (
        <p className="meteora-message meteora-warning" role="status">
          No se pudo obtener el histórico de {unavailableCandles} de los{" "}
          {evaluatedPools} pools consultados; se muestran solo los datos
          completos.
        </p>
      )}

      <div className="meteora-results-heading">
        <div>
          <h2>Señales alcistas observadas</h2>
          <p>
            {loading
              ? "Analizando pools de mayor volumen…"
              : `${visiblePools.length} pools coinciden con tus filtros`}
          </p>
        </div>
        <span className="meteora-window">Cambio observado · velas 1 h</span>
      </div>

      {loading ? (
        <div className="meteora-empty" role="status">
          Cargando pools y velas de Meteora…
        </div>
      ) : !error && visiblePools.length === 0 ? (
        <div className="meteora-empty">
          No hay pools que cumplan todos los filtros. Prueba reducir los
          mínimos o ampliar el rango de variación.
        </div>
      ) : (
        <div className="meteora-pool-grid">
          {visiblePools.map((pool) => (
            <article className="meteora-pool-card" key={pool.address}>
              <div className="meteora-card-topline">
                <div>
                  <h3>{pool.name || `${getTokenLabel(pool.token_x)} / ${getTokenLabel(pool.token_y)}`}</h3>
                  <p>
                    {getTokenLabel(pool.token_x)} / {getTokenLabel(pool.token_y)}
                  </p>
                </div>
                <span className="meteora-trend-badge">
                  <TrendingUp size={15} />
                  Alcista
                </span>
              </div>

              <div className="meteora-change">
                <span>{formatPercent(pool.changePct)}</span>
                <small>
                  {pool.observedHours
                    ? `${pool.observedHours} h aprox.`
                    : "velas recientes"}
                </small>
              </div>

              <div className="meteora-pool-metrics">
                <div>
                  <span>TVL</span>
                  <strong>{formatUsd(Number(pool.tvl))}</strong>
                </div>
                <div>
                  <span>Volumen 24 h</span>
                  <strong>{formatUsd(Number(pool.volume?.["24h"]))}</strong>
                </div>
              </div>

              <a
                className="meteora-pool-link"
                href={`https://solscan.io/account/${encodeURIComponent(pool.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver pool en Solscan <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>
      )}

      <footer className="meteora-disclaimer">
        Se analizan hasta {POOL_LIMIT} pools DLMM de mayor volumen y se compara
        la apertura de la primera vela horaria disponible con el cierre de la
        última (la ventana puede ser inferior a 24 h). El volumen mostrado sí
        corresponde a 24 h. La variación pasada, el TVL y el volumen no aseguran
        resultados futuros. No se ejecutan swaps.
      </footer>
    </section>
  );
}

export default MeteoraPools;
