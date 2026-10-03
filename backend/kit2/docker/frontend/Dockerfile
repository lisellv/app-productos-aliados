# Frontend React + Vite · copiar a la raíz del repo del frontend
# (junto con .dockerignore y la carpeta nginx/)

# ---------- Etapa 1: compilar ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
# Vacío = las llamadas van a /api del mismo origen y Nginx las reenvía
ARG VITE_API_ORIGIN=
ENV VITE_API_ORIGIN=$VITE_API_ORIGIN
RUN npm run build

# ---------- Etapa 2: servir con Nginx sin privilegios ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# La imagen reemplaza ${BACKEND_URL} en la plantilla al arrancar
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_URL=http://backend:8080
EXPOSE 8080
