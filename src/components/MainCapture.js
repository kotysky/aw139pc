import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMetar } from '../api/fetchMetar';
import EnginePhotoEvaluator from '../api/EnginePhotoEvaluator';

export default function MainCapture() {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetar()
      .then((data) => setMeteo(data))
      .catch((err) => console.error('Error al obtener datos METAR:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = ({ eng1, eng2 }) => {
    navigate('/result', { state: { eng1, eng2, meteo } });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Engine Data Capture</h2>

      {loading && (
        <p style={{ color: '#555' }}>🔄 Fetching closest weather data...</p>
      )}

      {!loading && meteo && (
        <>
          <div
            style={{
              background: '#f4f4f4',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'inline-block',
              textAlign: 'left',
            }}
          >
            <p>📍 <strong>Closest METAR location:</strong> {meteo.icao}</p>
            <p>🌡️ <strong>Temperature:</strong> {meteo.temperature} °C</p>
            <p>📊 <strong>QNH:</strong> {meteo.qnh} hPa</p>
            <p>📏 <strong>Pressure Altitude:</strong> {meteo.pressure_altitude} ft</p>
          </div>

          <EnginePhotoEvaluator
            onComplete={handleComplete}
            temperature={meteo.temperature}
            pressureAltitude={meteo.pressure_altitude}
          />
        </>
      )}

      {!loading && !meteo && (
        <p style={{ color: 'red' }}>❌ Unable to load weather data.</p>
      )}
    </div>
  );
}
