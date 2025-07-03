// src/api/fetchEngineStatus.js

import { v4 as uuidv4 } from 'uuid';

/**
 * Convierte un archivo a una cadena Base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} - Promesa que resuelve con la cadena base64
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // quitamos el prefijo "data:..."
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Evalúa una imagen de motor enviándola a un webhook de n8n
 * @param {File} file - Imagen del motor (ENG1 o ENG2)
 * @param {number|string} temperature - Temperatura actual
 * @param {number|string} pressureAltitude - Altitud de presión en pies
 * @returns {Promise<Object>} - Resultado de la evaluación
 */
export async function evaluateImage(file, temperature, pressureAltitude) {
  const formData = new FormData();

  try {
    // Convertimos el archivo a base64
    const base64Data = await toBase64(file);

    // Añadimos la imagen codificada al formulario
    formData.append('image', base64Data);

    // Añadimos los datos meteorológicos
    formData.append('temperature', temperature);
    formData.append('altitude_presion', pressureAltitude);

    // Enviamos al webhook de n8n
    const response = await fetch('https://n8n.chatbotbot.org/webhook/1913ccdf-828f-4501-95d9-4fadf56bb1ff', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log("Resultado de n8n:", result);

    // Validamos que sea un motor reconocido
    const MOTOR = result[0].MOTOR;
    console.log("MOTOR:",result[0].MOTOR)
    if (result[0]?.MOTOR === 'ENG1' || result[0]?.MOTOR === 'ENG2') {
      
      const otherMOTOR = MOTOR === 'ENG1' ? 'ENG2' : 'ENG1';

      const engOkKey = `${MOTOR}_OK`;
      const otherIdleKey = `${otherMOTOR}_IDLE`;

      const engOk = result[0][engOkKey] === true;
      const otherIdle = result[0][otherIdleKey] === true;

      const isValid = engOk && otherIdle;

      console.log(`🧠 Enine validation: ${MOTOR}`);
      console.log(`✔️ ${engOkKey}:`, engOk);
      console.log(`✔️ ${otherIdleKey}:`, otherIdle);
      console.log(`✅ isValid:`, isValid);

      return {
        id: uuidv4(),
        status: isValid ? 'valid' : 'invalid',
        MOTOR,
        data: result,
        ...(isValid ? {} : { error: 'Condiciones no válidas: se requiere un motor OK y el otro en IDLE' })
      };
    } else {
      console.log("Status invalid!!!",)
      return {
        id: uuidv4(),
        MOTOR,
        status: 'invalid',
        error: result?.error || 'Condiciones no válidas: se requiere un motor OK y el otro en IDLE',
        data: result
      };
    }
  } catch (error) {
    console.error("❌ ERROR evaluando imagen:", error);
    return {
      id: uuidv4(),
      MOTOR,
      status: 'error',
      error: error.message
    };
  }
}
