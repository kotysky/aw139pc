import React, { useState, useEffect } from 'react';
import { evaluateImage } from './fetchEngineStatus';
import { resizeImage } from './ImageResizer';

export default function EnginePhotoEvaluator({ onComplete, temperature, pressureAltitude }) {
  const [photos, setPhotos] = useState([]);
  const [mode, setMode] = useState('cargar');
  const [hasCamera, setHasCamera] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Verifica si hay cámara disponible
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices()
      .then(devices => {
        const videoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(videoInput);
      })
      .catch(() => setHasCamera(false));
  }, []);

  // Captura o carga una imagen, la redimensiona y la evalúa
  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Redimensionar la imagen
      const resized = await resizeImage(file);
      const previewUrl = URL.createObjectURL(resized);

      console.log("Iniciando evaluación de imagen", { temperature, pressureAltitude });

      // Eliminar fotos 'invalid' o 'error' antes de añadir la nueva
      setPhotos(prev => {
        const cleaned = prev.filter(p => p.status !== 'invalid' && p.status !== 'error');
        return [...cleaned, { previewUrl, status: 'uploading' }];
      });

      // Evaluar la imagen
      const result = await evaluateImage(resized, temperature, pressureAltitude);

      if (!result || !result.MOTOR) {
        setPhotos(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            status: 'error',
          };
          return updated;
        });
        return;
      }

      const motor = result.MOTOR;
      const exists = photos.some(p => p.status === 'valid' && p.MOTOR === motor);

      if (result.status === 'valid' && exists) {
        const confirmReplace = window.confirm(`Ya has subido una foto válida de ${motor}. ¿Quieres reemplazarla con esta nueva?`);

        if (confirmReplace) {
          setPhotos(prev => {
            const filtered = prev.filter(p => !(p.status === 'valid' && p.MOTOR === motor));
            const updated = [...filtered];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              ...result,
              previewUrl,
            };
            return updated;
          });
        } else {
          setPhotos(prev => prev.slice(0, -1));
        }

      } else {
        setPhotos(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            ...result,
            previewUrl,
          };
          return updated;
        });
      }

    } catch (error) {
      console.error('Error al procesar la imagen:', error);
    }
  };

  // Cuando hay dos motores válidos, se llama a onComplete
  useEffect(() => {
    if (submitted) return;

    const valid = photos.filter(p => p.status === 'valid');
    const eng1 = valid.find(p => p.MOTOR === 'ENG1');
    const eng2 = valid.find(p => p.MOTOR === 'ENG2');

    if (eng1 && eng2) {
      setSubmitted(true);
      onComplete({ eng1: eng1.data, eng2: eng2.data });
    }
  }, [photos, submitted, onComplete]);

  const needsMore = () => {
    const hasENG1 = photos.some(p => p.status === 'valid' && p.MOTOR === 'ENG1');
    const hasENG2 = photos.some(p => p.status === 'valid' && p.MOTOR === 'ENG2');
    return !hasENG1 || !hasENG2;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {needsMore() && (
        <>
          <div style={{ marginBottom: '1rem' }}>
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
        </>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {photos.map((p, i) => (
          <li key={i} style={{ marginBottom: '1rem' }}>
            <img src={p.previewUrl} alt="Preview" style={{ width: 150, borderRadius: 8 }} /><br />
            {p.status === 'uploading' && '⏳ Evaluating...'}
            {p.status === 'valid' && `✅ ${p.MOTOR}`}
            {p.status === 'invalid' && '❌ Engine Parameters mismatch,Try again'}
            {p.status === 'error' && '⚠️ Error evaluating'}
            {console.log("Status: ", p.status, "MOTOR:", p.MOTOR)}
          </li>
        ))}
      </ul>
    </div>
  );
}
