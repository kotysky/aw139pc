// src/components/ImageResizer.js
export async function resizeImage(file, width = 1440, height = 1600) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function (event) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
  
          // Redimensionar y dibujar
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convertir a Blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("No se pudo convertir a Blob"));
              return;
            }
  
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(resizedFile);
          }, 'image/jpeg', 0.9);
        };
  
        img.onerror = reject;
        img.src = event.target.result;
      };
  
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  