# Kineseña

Aplicación híbrida para aprender vocabulario introductorio de Lengua de Señas Mexicana mediante demostraciones, ejercicios, actividades de refuerzo y prácticas de reconocimiento de mano ejecutadas localmente.

## Documentación

- [Especificación de requisitos actualizada](docs/REQUERIMIENTOS_ACTUALIZADOS.md)
- [Guía de recursos de video](public/assets/GUIA_VIDEOS.md)

La especificación actualizada contrasta el PDF inicial con el estado real del proyecto, registra los cambios de alcance y separa lo implementado de los pendientes de validación o prueba.

## Tecnologías

- React 19 y Vite 8
- Capacitor 8 para Android
- Capacitor Preferences para nombre, apariencia y progreso local
- MediaPipe Hands empaquetado localmente para seguimiento de mano

## Desarrollo

```bash
npm install
npm run dev
```

Antes de iniciar o compilar, el proyecto copia los archivos necesarios de MediaPipe a `public/vendor/mediapipe`.

## Verificación

```bash
npm run lint
npm run build
```

Para sincronizar los recursos web compilados con Android:

```bash
npx cap sync android
```

## Privacidad y operación

El nombre y el progreso se guardan únicamente en el dispositivo. Los fotogramas de cámara se procesan localmente y no se almacenan ni se envían a un servidor. El contenido y el modelo de seguimiento están incluidos en la aplicación para permitir el uso sin conexión.
