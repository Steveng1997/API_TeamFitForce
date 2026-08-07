# Imagen base ligera de Node.js 20 en Alpine Linux
FROM node:20-alpine

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar el código fuente de la aplicación
COPY . .

# Crear carpeta de uploads
RUN mkdir -p uploads

# Exponer el puerto 3000
EXPOSE 3000

# Definir variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]
