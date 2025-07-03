export async function fetchMetar() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const response = await fetch('https://n8n.chatbotbot.org/webhook/2e3f8def-ad3f-42fe-b04e-80297c61daf4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            }),
          });

          if (!response.ok) throw new Error('Error al obtener el METAR');
          const data = await response.json();
          resolve(data); // { qnh: 1016, icao: 'GCLP',temperature:18, presure_altitude:27 }
        } catch (err) {
          reject(err);
        }
      },
      (geoError) => reject(geoError)
    );
  });
}
