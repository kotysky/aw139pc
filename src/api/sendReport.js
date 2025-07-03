// src/api/sendReport.js
export async function sendReport(data) {
    try {
      const response = await fetch('https://n8n.tudominio.com/webhook/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      return await response.json();
    } catch (err) {
      console.error('Error al enviar el informe:', err);
      return null;
    }
  }
  


  /*{
    Podria ser:
  email: "cliente@ejemplo.com",
  resultado: "ENGINE 1 OK, ENGINE 2 FAIL",
  imagenes: [foto1, foto2],  // Opcional base64 o URLs
  observaciones: "Temperatura elevada detectada"
}*/