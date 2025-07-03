// src/api/saveToDatabase.js
export async function saveToDatabase(data) {
    try {
      const response = await fetch('https://n8n.tudominio.com/webhook/save-engine-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      return await response.json();
    } catch (err) {
      console.error('Error al guardar datos en base de datos:', err);
      return null;
    }
  }
/*{
Podria ser

  timestamp: new Date().toISOString(),
  foto1: base64Foto1,
  foto2: base64Foto2,
  status: {
    eng1_ok: true,
    eng2_ok: false,
    motivo: "ITT fuera de rango"
  },
  metar: {
    qnh: 1016,
    airport: "GCLP"
  }
}*/  