# Preparar iOS desde Windows

El código React y los recursos compartidos se pueden mantener desde Windows. La compilación nativa de iOS de Capacitor necesita macOS y Xcode, por lo que este repositorio usa un runner macOS de GitHub Actions.

## Primera compilación

1. Incluye en GitHub los cambios de preparación iOS: `package.json`, `package-lock.json`, `README.md`, `docs/REQUERIMIENTOS_ACTUALIZADOS.md`, esta guía y `.github/workflows/ios-build.yml`. Revisa y conserva por separado cualquier otro cambio local.
2. En GitHub, abre **Actions → iOS simulator build → Run workflow**.
3. El workflow instala dependencias, genera `dist`, crea el proyecto iOS con Swift Package Manager si aún no existe y compila para el simulador sin firma.
4. Descarga el artefacto **ios-native-project** de esa ejecución y extrae la carpeta `ios/` en la raíz del repositorio. Se sube cuando se crea o sincroniza el proyecto, incluso si falla la compilación del simulador.
5. Añade el proyecto nativo `ios/` al control de versiones. No se incluye `ios/App/App/public/` en el artefacto: `npx cap sync ios` lo vuelve a generar en cada compilación.
6. Ejecuta de nuevo el workflow. Desde entonces sincronizará el proyecto guardado y compilará el simulador.

El runner solo entrega una compilación de simulador sin firmar. La distribución en iPhone requiere configurar firma de Apple y probar la cámara en un dispositivo físico; este workflow no publica la app ni firma un IPA.

El workflow se ejecuta manualmente para evitar compilar en macOS con cada cambio. GitHub puede descontar minutos de macOS según el plan y la configuración del repositorio.
