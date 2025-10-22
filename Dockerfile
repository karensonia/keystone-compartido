# Dockerfile para aplicación React/Vite en Google Cloud

# Usar imagen oficial de Node.js
FROM node:20-alpine as builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción - usar nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Habilitar compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Configurar headers para cache de assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Servir React Router (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Copiar archivos construidos desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 8080 (requerido por Google Cloud Run)
EXPOSE 8080

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]