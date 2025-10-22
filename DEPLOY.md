# Despliegue en Google Cloud

Este proyecto está configurado para desplegarse en Google Cloud Platform usando App Engine o Cloud Run.

## Prerrequisitos

1. **Google Cloud SDK**: Instalar el [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. **Proyecto de Google Cloud**: Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
3. **Autenticación**: Ejecutar `gcloud auth login`

## Configuración Inicial

```bash
# Configurar proyecto de GCP
gcloud config set project TU_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable appengine.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Variables de Entorno

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.production.example .env.production
   ```

2. Editar `.env.production` con tus valores reales:
   - Firebase configuration (si usas Firebase)
   - API URLs
   - Google Analytics ID
   - Otras variables específicas de tu aplicación

## Opciones de Despliegue

### Opción 1: Google App Engine (Recomendado para sitios estáticos)

```bash
# Construir la aplicación
npm run build

# Desplegar a App Engine
npm run gcp:deploy
# o manualmente:
gcloud app deploy
```

### Opción 2: Google Cloud Run (Recomendado para contenedores)

```bash
# Opción A: Despliegue automático desde código fuente
npm run gcp:deploy-cloud-run

# Opción B: Despliegue manual con Docker
# 1. Construir imagen
gcloud builds submit --tag gcr.io/TU_PROJECT_ID/keystone-compartido

# 2. Desplegar en Cloud Run
gcloud run deploy keystone-compartido \
  --image gcr.io/TU_PROJECT_ID/keystone-compartido \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Estructura de Archivos Creados

- `app.yaml` - Configuración de App Engine
- `Dockerfile` - Configuración de contenedor para Cloud Run
- `.gcloudignore` - Archivos a excluir del despliegue
- `.env.production.example` - Template de variables de entorno
- `cloudrun.yaml` - Configuración adicional de Cloud Run

## Scripts Añadidos

- `npm run build:prod` - Build para producción
- `npm run start` - Servidor local en puerto 8080
- `npm run gcp:deploy` - Desplegar en App Engine
- `npm run gcp:deploy-cloud-run` - Desplegar en Cloud Run

## Notas Importantes

1. **Puerto 8080**: Google Cloud requiere que las aplicaciones escuchen en el puerto 8080
2. **Variables de entorno**: Solo las variables que empiecen con `VITE_` estarán disponibles en el cliente
3. **Dominios personalizados**: Se pueden configurar desde Google Cloud Console
4. **SSL/HTTPS**: Habilitado automáticamente por Google Cloud

## Monitoreo y Logs

```bash
# Ver logs de App Engine
gcloud app logs tail -s default

# Ver logs de Cloud Run
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=keystone-compartido"
```

## Costos

- **App Engine**: Gratis hasta ciertos límites, luego pago por uso
- **Cloud Run**: Gratis hasta 2 millones de requests/mes, luego pago por uso

Para más información, consulta la [documentación oficial de Google Cloud](https://cloud.google.com/docs).