import React, { useState, useEffect } from 'react';

 const CryptoTicker = () => {
  const [prices, setPrices] = useState({
    BTC: 'Cargando...',
    ETH: 'Cargando...',
    SOL: 'Cargando...',
    XRP: 'Cargando...',
    ADA: 'Cargando...'
  });

  useEffect(() => {
    // Definimos los símbolos que queremos (Binance usa minúsculas para streams)

    const streamUrl = `https://min-api.cryptocompare.com/data/v2/news/?lang=ES`;

    const ws = new WebSocket(streamUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbolMap = {
        BTCUSDT: 'BTC',
        ETHUSDT: 'ETH',
        SOLUSDT: 'SOL',
        XRPUSDT: 'XRP',
        ADAUSDT: 'ADA'
      };

      const coinName = symbolMap[data.s];
      if (coinName) {
        setPrices(prev => ({
          ...prev,
          [coinName]: parseFloat(data.c).toLocaleString(undefined, {
            minimumFractionDigits: data.s === 'XRPUSDT' || data.s === 'ADAUSDT' ? 4 : 2
          })
        }));
      }
    };

    return () => ws.close(); // Limpiamos la conexión al desmontar
  }, []);

  const cryptos = [
    { name: 'BTC', price: prices.BTC, color: 'text-orange-500' },
    { name: 'ETH', price: prices.ETH, color: 'text-blue-500' },
    { name: 'XRP', price: prices.XRP, color: 'text-gray-400' },
    { name: 'SOL', price: prices.SOL, color: 'text-purple-500' },
    { name: 'ADA', price: prices.ADA, color: 'text-blue-400' }
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-wrap">
        <div className="ticker-move">
          {[...cryptos, ...cryptos].map((coin, index) => (
            <div key={index} className="ticker-item">
              <span className={`font-bold ${coin.color}`}>{coin.name}:</span>
                            <span className="price-value">${coin.price}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
      `}</style>
    </div>
  );
};


export default CryptoTicker;