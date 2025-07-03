import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMetar } from '../api/fetchMetar';

export default function MainCapture() {
  const [foto1, setFoto1] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('cargar'); // 'cargar' o 'capturar'
  const [hasCamera, setHasCamera] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetar()
      .then((data) => setMeteo(data))
      .catch((err) => console.error('Error al obtener datos METAR:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices()
      .then(devices => {
        const videoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(videoInput);
      })
      .catch(() => setHasCamera(false));
  }, []);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFoto1(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    navigate('/result', { state: { foto: foto1, meteo } });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Engine data capture</h2>

      {loading ? (
        <p>Fetching closest weather data...</p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Closest:</strong> {meteo.icao}</p>
            <p><strong>QNH:</strong> {meteo.qnh}</p>
            <p><strong>Temperature:</strong> {meteo.temperature}</p>
            <p><strong>Pressure Altitude:</strong> {meteo.pressure_altitude}</p>
          </div>

          {/* Selector de modo */}
          <div style={{ margin: '1rem' }}>
            <label>
              <input
                type="radio"
                name="modo"
                value="cargar"
                checked={mode === 'cargar'}
                onChange={() => setMode('cargar')}
              />
              Load photo
            </label>
            &nbsp;&nbsp;
            {hasCamera && (
              <label>
                <input
                  type="radio"
                  name="modo"
                  value="capturar"
                  checked={mode === 'capturar'}
                  onChange={() => setMode('capturar')}
                />
                Take photo
              </label>
            )}
          </div>

          {/* Foto */}
          <div>
            <p><strong>Picture:</strong></p>
            <label className="btn btn-captura">
              {mode === 'capturar' ? '📸 MFD' : '📂 MFD File'}
              <input
                type="file"
                accept="image/*"
                capture={mode === 'capturar' ? 'environment' : undefined}
                onChange={handleCapture}
                style={{ display: 'none' }}
              />
            </label>
            {foto1 && <img src={foto1} alt="Foto 1" style={{ width: '100%', maxWidth: 300, margin: '1rem' }} />}
          </div>

          {foto1 && (
            <button onClick={handleSubmit} className="btn" style={{ marginTop: '1rem' }}>
              Evaluate Data
            </button>
          )}
        </>
      )}
    </div>
  );
}
