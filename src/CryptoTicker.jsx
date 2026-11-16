import React, { useEffect, useState } from "react";
import "./CryptoTicker.css";

const STREAM_URL =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/adausdt@ticker";

const initialPrices = { BTC: "—", ETH: "—", SOL: "—", XRP: "—", ADA: "—" };
const symbolMap = {
  BTCUSDT: "BTC",
  ETHUSDT: "ETH",
  SOLUSDT: "SOL",
  XRPUSDT: "XRP",
  ADAUSDT: "ADA",
};

const CryptoTicker = () => {
  const [prices, setPrices] = useState(initialPrices);
  const [connectionStatus, setConnectionStatus] = useState("Conectando al mercado");

  useEffect(() => {
    let active = true;
    const socket = new WebSocket(STREAM_URL);

    socket.onopen = () => {
      if (active) setConnectionStatus("Datos de mercado en vivo");
    };

    socket.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      const coin = symbolMap[data?.s];
      const price = Number(data?.c);

      if (!coin || !Number.isFinite(price)) return;

      setPrices((current) => ({
        ...current,
        [coin]: price.toLocaleString("en-US", {
          minimumFractionDigits: coin === "XRP" || coin === "ADA" ? 4 : 2,
          maximumFractionDigits: coin === "XRP" || coin === "ADA" ? 4 : 2,
        }),
      }));
    };

    socket.onerror = () => {
      if (active) setConnectionStatus("Cotizaciones temporalmente no disponibles");
    };

    socket.onclose = () => {
      if (active) setConnectionStatus("Conexión de mercado cerrada");
    };

    return () => {
      active = false;
      socket.close();
    };
  }, []);

  const cryptos = [
    { name: "BTC", price: prices.BTC, color: "ticker-bitcoin" },
    { name: "ETH", price: prices.ETH, color: "ticker-ethereum" },
    { name: "SOL", price: prices.SOL, color: "ticker-solana" },
    { name: "XRP", price: prices.XRP, color: "ticker-xrp" },
    { name: "ADA", price: prices.ADA, color: "ticker-cardano" },
  ];

  return (
    <div className="ticker-container" aria-label="Cotizaciones orientativas de criptomonedas">
      <div className="ticker-wrap">
        <div className="ticker-move">
          {[...cryptos, ...cryptos].map((coin, index) => (
            <div className="ticker-item" key={`${coin.name}-${index}`}>
              <span className={`ticker-symbol ${coin.color}`}>{coin.name}</span>
              <span className="price-value">${coin.price}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="ticker-status"><span aria-hidden="true" />{connectionStatus} · Binance</span>
    </div>
  );
};

export default CryptoTicker;
