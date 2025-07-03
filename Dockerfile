FROM node:20

# Crear carpeta de trabajo
WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de archivos
COPY . .

# Exponer el puerto de desarrollo
EXPOSE 3200
ENV PORT=3200

# Lanzar en modo desarrollo con hot reload
CMD ["npm", "start"]