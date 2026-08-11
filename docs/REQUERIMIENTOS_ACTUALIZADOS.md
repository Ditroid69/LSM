# Especificación de requisitos de KineSeña

**Versión:** 2.0  
**Fecha de revisión:** 6 de agosto de 2026  
**Base documental:** `Requerimientos.pdf` (versión inicial, 6 páginas)  
**Fuente de verdad de esta revisión:** comportamiento y recursos presentes en el repositorio.

## 1. Propósito y alcance

KineSeña es una aplicación educativa móvil, híbrida y de uso local para aprender vocabulario introductorio de Lengua de Señas Mexicana (LSM). La experiencia no requiere cuenta ni conexión a un servidor. Organiza el aprendizaje en cuatro categorías: abecedario, números, saludos y cortesía, y comunicación básica.

La aplicación combina demostraciones mediante imágenes o videos, ejercicios de reconocimiento, actividades de refuerzo y, cuando la seña puede validarse con el modelo actual, práctica con cámara y seguimiento de puntos de la mano.

### 1.1 Usuarios y límites de la versión

- Público objetivo: personas de distintos rangos de edad que comienzan a aprender LSM.
- Plataforma principal: teléfonos y tabletas Android.
- Persistencia: exclusivamente local en el dispositivo.
- Sin cuentas, nube, sincronización entre dispositivos, clasificación social ni recuperación remota de progreso.
- La validación por cámara reconoce configuraciones y trayectorias programadas; no sustituye la evaluación de una persona especialista en LSM.
- Saludos, frases de cortesía, comunicación básica, letras dinámicas y números del 9 al 20 no se validan con cámara en esta versión.

## 2. Requerimientos funcionales actualizados

### 2.1 Inicio, personalización y navegación

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF01 | El sistema permitirá el acceso sin autenticación, correo electrónico ni contraseña. | Implementado |
| RF02 | En el primer inicio solicitará únicamente el nombre, validará que no esté vacío y admitirá hasta 40 caracteres. | Implementado |
| RF03 | El nombre se almacenará en las preferencias locales y se reutilizará en accesos posteriores. | Implementado |
| RF04 | Después del registro o de recuperar un nombre guardado, mostrará una pantalla breve de preparación y abrirá el menú principal. | Implementado |
| RF05 | El menú principal mostrará las categorías Abecedario, Números, Saludos y cortesía, y Comunicación básica. | Implementado |
| RF06 | La cabecera mostrará el nombre local del usuario, navegación contextual para regresar y acceso al menú principal. | Implementado |
| RF07 | Antes de abandonar un nivel sin completar, el sistema solicitará confirmación; el usuario podrá continuar o salir. | Implementado |
| RF08 | Las rutas inexistentes redirigirán al inicio y las rutas internas estarán protegidas durante la sesión hasta completar el flujo inicial. | Implementado con limitación: la protección vive en memoria y se reinicia al recargar la aplicación web |

### 2.2 Recursos y presentación de lecciones

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF09 | Cada elemento de aprendizaje tendrá una demostración visual: imagen para señas estáticas o video para señas dinámicas y expresiones. | Implementado para el catálogo actual |
| RF10 | Las demostraciones incluirán nombre o símbolo y una explicación breve, sencilla y orientada a la ejecución de la seña. | Implementado; pendiente validación lingüística formal |
| RF11 | Los videos ofrecerán controles propios para reproducir, pausar y reiniciar, además de manejo visible de carga o error. | Implementado |
| RF12 | Los carruseles permitirán avanzar y regresar libremente, mostrarán posición y progreso, y marcarán el nivel al llegar al final. | Implementado |

### 2.3 Abecedario

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF13 | El contenido estático se organizará por configuración manual: bloque 1 (A, E, S, T, O), bloque 2 (B, C, D, F, U), bloque 3 (I, P, V, W), bloque 4 (L, M, Ñ, R) y bloque 5 (G, H, X, Y). | Implementado tal como está en el código |
| RF14 | Las letras con demostración en movimiento se agruparán en el bloque 6: J, K, Ñ, Z y Q. | Implementado |
| RF15 | Los bloques 1 a 5 tendrán tres niveles secuenciales: demostración, ejercicio y práctica con cámara. | Implementado |
| RF16 | El bloque 6 tendrá demostración y ejercicio, sin validación por cámara. | Implementado |
| RF17 | En el ejercicio se mostrará una seña objetivo y hasta cuatro letras; preguntas y opciones se elegirán aleatoriamente y una letra solo contará como superada al responder correctamente. | Implementado |
| RF18 | La práctica con cámara guiará al usuario por cada letra del bloque, guardará los aciertos y completará el nivel al validar toda la secuencia. | Implementado para los bloques con nivel 3 |
| RF19 | La sección de práctica general ofrecerá: relacionar seña con letra, ordenar señas para deletrear palabras y memorama de parejas seña-letra. | Añadido e implementado |
| RF20 | Cada actividad general podrá repetirse y conservará localmente su estado de completada. | Implementado |

**Catálogo del abecedario:** el catálogo actual contiene las 27 letras del alfabeto español. Incluye 22 demostraciones estáticas y cinco demostraciones en movimiento: `J`, `K`, `Ñ`, `Z` y `Q`.

### 2.4 Números del 1 al 20

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF21 | Los números se organizarán por tipo de seña y capacidad técnica: módulo 1, números estáticos del 1 al 8; módulo 2, números dinámicos del 9 al 14; módulo 3, números dinámicos del 15 al 20. | Modificado e implementado; sustituye los cuatro grupos de cinco del PDF inicial |
| RF22 | El módulo 1 tendrá demostración con imágenes, ejercicio aleatorio y práctica con cámara. | Implementado |
| RF23 | Los módulos 2 y 3 tendrán demostración con videos y ejercicio de reconocimiento, sin validación por cámara. | Modificado e implementado |
| RF24 | Los ejercicios exigirán reconocer todos los números del módulo y mostrarán retroalimentación correcta o incorrecta antes de continuar. | Implementado |

### 2.5 Saludos y cortesía

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF25 | Se ofrecerán tres módulos: saludos formales e informales; cortesía básica; presentaciones y despedidas. | Implementado |
| RF26 | El catálogo incluirá 17 expresiones: 5 saludos, 7 expresiones de cortesía y 5 presentaciones o despedidas. | Ampliado e implementado |
| RF27 | Cada módulo tendrá demostración en video y ejercicio de reconocimiento aleatorio, sin cámara. | Implementado |

### 2.6 Comunicación básica

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF28 | Se ofrecerán tres módulos: necesidades fisiológicas y comida; información de contacto y ayuda; interacción básica. | Implementado |
| RF29 | El catálogo incluirá 18 expresiones: 7 de necesidades, 4 de ayuda y 7 de interacción. | Ampliado e implementado |
| RF30 | Cada módulo tendrá demostración en video y ejercicio de reconocimiento aleatorio, sin cámara. | Implementado |

### 2.7 Cámara y reconocimiento local

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF31 | La cámara se solicitará únicamente al entrar a una práctica que la necesita y el sistema explicará los errores de permiso o compatibilidad. | Implementado |
| RF32 | El seguimiento se ejecutará localmente con MediaPipe Hands, una mano como máximo y recursos del modelo empaquetados en la aplicación. | Implementado |
| RF33 | La vista superpondrá conexiones y puntos de referencia sobre la mano detectada. | Añadido e implementado |
| RF34 | Una seña deberá mantenerse correctamente durante aproximadamente 0.75 segundos para completar la validación; variaciones breves del seguimiento serán toleradas. | Añadido e implementado |
| RF35 | El sistema mostrará progreso circular, detección de mano, acierto y fallo, y notificará el acierto una sola vez por elemento. | Implementado |
| RF36 | La validación automática se limitará a A, B, C, D, E, F, G, H, I, K/P, L, M, Ñ, O, R, S, T, U, V, W, X, Y, Z y números 1 a 8. | Implementado con limitación: K y P comparten detector y no hay validación de Q ni de movimientos complejos |

### 2.8 Progreso local

| ID | Requerimiento | Estado actual |
|---|---|---|
| RF37 | El sistema almacenará por categoría, módulo y nivel si la actividad fue completada. | Implementado con Capacitor Preferences |
| RF38 | Los niveles se desbloquearán en orden; el primero estará disponible y cada siguiente requerirá completar el anterior. | Implementado |
| RF39 | La ruta de niveles mostrará estados disponible, bloqueado y completado, junto con un resumen numérico del avance. | Implementado |
| RF40 | Los avances parciales de la práctica con cámara se conservarán por bloque para continuar la secuencia. | Implementado |
| RF41 | El progreso permanecerá en el dispositivo y no se sincronizará ni se respaldará en línea. | Implementado por diseño |

**Brecha de persistencia PR-01:** las claves de progreso no incluyen el nombre. Si se cambia manualmente el nombre almacenado, el progreso pertenece al dispositivo y no a perfiles separados. Por tanto, el antiguo RF13 del PDF se redefine como progreso local de un solo perfil.

## 3. Requerimientos no funcionales

### 3.1 Usabilidad y accesibilidad

| ID | Requerimiento verificable | Estado actual |
|---|---|---|
| RNF01 | La interfaz será responsive y priorizará interacción táctil en móvil sin impedir su uso en navegador de escritorio. | Implementado |
| RNF02 | El texto base tendrá un mínimo objetivo de 16 px en móvil y los encabezados principales al menos 24 px, salvo etiquetas auxiliares justificadas por el diseño. | Parcial; requiere auditoría visual por pantalla |
| RNF03 | Se usará tipografía sans-serif y texto en español con instrucciones breves y sin terminología lingüística innecesaria. | Implementado en contenido; pendiente revisión editorial final |
| RNF04 | La paleta conservará azul profundo `#1E3A8A`, amarillo `#FED301`, verde `#10B981` y naranja `#F97316`; el turquesa `#41D6C3` será el color secundario actual. | Modificado e implementado; el violeta dejó de ser el color principal de selección |
| RNF05 | La aplicación ofrecerá modos claro y oscuro y conservará la preferencia localmente. | Añadido e implementado |
| RNF06 | Los controles interactivos importantes tendrán nombre accesible, estados deshabilitados distinguibles y retroalimentación que no dependa solo del color. | Parcial; existe semántica ARIA, falta auditoría WCAG completa |
| RNF07 | La aplicación mostrará mensajes comprensibles ante cámara denegada, motor no disponible, video faltante o contenido inexistente. | Parcialmente implementado |

### 3.2 Operación, compatibilidad y privacidad

| ID | Requerimiento verificable | Estado actual |
|---|---|---|
| RNF08 | El APK soportará como mínimo Android 8.0 (API 26). Puede admitir versiones anteriores si las pruebas lo permiten. | Configurado actualmente desde API 24; cumple por inclusión, pero falta matriz de pruebas desde API 26 |
| RNF09 | La aplicación podrá usar sus lecciones, videos, preferencias y modelo de manos sin conexión después de instalarse. | Implementado; todos los recursos están empaquetados |
| RNF10 | No se enviarán nombre, imágenes de cámara ni progreso a servicios externos. Los fotogramas se procesarán localmente y no se almacenarán. | Implementado por arquitectura actual |
| RNF11 | La aplicación solicitará permiso de cámara solo para la funcionalidad que lo requiere. | Implementado |
| RNF12 | Las señas, descripciones, fotografías y videos deberán aprobarse y quedar trazables a una fuente institucional o especialista competente en LSM antes de la liberación. | Pendiente de evidencia documental; no puede inferirse del código |

### 3.3 Rendimiento y almacenamiento

| ID | Requerimiento verificable | Estado actual |
|---|---|---|
| RNF13 | Imágenes y videos se comprimirán conservando legibilidad suficiente para observar manos, orientación y movimiento. | Parcial; hay recursos comprimidos, falta criterio y reporte reproducible |
| RNF14 | El APK instalable no excederá 300 MB. | Cumple en compilación debug revisada: aproximadamente 196 MB; validar nuevamente en release |
| RNF15 | La interfaz responderá a una pulsación en menos de 300 ms, sin contar carga de video, inicio de cámara o procesamiento del modelo. | Pendiente de medición en dispositivos objetivo |
| RNF16 | La cámara comunicará estado de carga y no bloqueará indefinidamente la navegación si falla. | Implementado funcionalmente; pendiente prueba de estrés |

### 3.4 Mantenibilidad, calidad y seguridad

| ID | Requerimiento verificable | Estado actual |
|---|---|---|
| RNF17 | Catálogos de números, saludos y comunicación se definirán como datos separados de sus vistas para permitir altas y correcciones sin duplicar pantallas. | Implementado |
| RNF18 | Los bloques de abecedario deberán migrarse a una única fuente de datos compartida; no deberán mantenerse copias divergentes en varias vistas. | Pendiente; actualmente hay definiciones duplicadas |
| RNF19 | Los módulos compartirán componentes de video, niveles y estilos cuando el comportamiento sea equivalente. | Parcialmente implementado |
| RNF20 | El proyecto deberá aprobar compilación de producción y análisis estático antes de generar una entrega. | Compilación y análisis de `src`, `scripts` y Vite aprobados; `npm run lint` global queda pendiente de excluir artefactos generados de Android |
| RNF21 | La documentación describirá propósito, instalación, compilación, arquitectura, recursos y requisitos vigentes. | Se inicia con esta revisión; README actualizado |
| RNF22 | El identificador Android será `com.kinesena.app` y el nombre visible será “KineSeña”. | Implementado |
| RNF23 | Los permisos Android se limitarán a los estrictamente necesarios y se revisarán antes de publicar. | Pendiente: justificar o retirar INTERNET y READ_EXTERNAL_STORAGE |

## 4. Requerimientos técnicos vigentes

Estos valores sustituyen las versiones propuestas en el PDF cuando el repositorio ya utiliza una versión distinta.

### 4.1 Desarrollo

- Node.js 20 LTS o superior compatible con Vite 8.
- React 19.2.x y React DOM 19.2.x.
- JavaScript con JSX. TypeScript 5.x deja de ser requisito de la versión actual porque el código no lo utiliza; su adopción futura requerirá una migración planificada.
- React Router DOM 7.17.x.
- Vite 8.0.x y complemento oficial de React 6.0.x.
- Capacitor 8.4.x, plataforma Android y complementos Camera y Preferences.
- MediaPipe Hands Web `0.4.1675469240`, Camera Utils y Drawing Utils empaquetados localmente.
- Android SDK de compilación y objetivo API 36; mínimo técnico actual API 24.
- Android Studio y JDK compatibles con el proyecto Gradle generado por Capacitor 8.
- Equipo de desarrollo recomendado: CPU multinúcleo x86-64, 8 GB de RAM o más, virtualización y cámara 720p para pruebas.

### 4.2 Uso

- Teléfono o tableta Android 8.0 o superior como objetivo soportado del proyecto.
- Procesador ARM moderno y al menos 2 GB de RAM disponible como referencia mínima sujeta a pruebas.
- Cámara frontal o trasera funcional de al menos 720p para los niveles de validación.
- Aproximadamente 300 MB libres para instalar; se recomienda margen adicional durante instalación y actualización.
- La conexión a Internet no es necesaria para el contenido ni para el reconocimiento después de instalar la aplicación.

## 5. Reglas de negocio y criterios transversales

- RB01. Un nivel solo se marca completado al consumir todo el carrusel, superar todos los reactivos o validar todos los elementos, según corresponda.
- RB02. Una respuesta incorrecta muestra la respuesta correcta, pero no marca el elemento como superado; el elemento vuelve a aparecer entre los pendientes.
- RB03. Repetir un nivel o actividad completada no borra su estado.
- RB04. El progreso de una categoría no bloquea el acceso a otras categorías.
- RB05. Los módulos con contenido dinámico no tendrán nivel de cámara hasta disponer de validadores confiables de trayectoria, orientación y temporalidad.
- RB06. Ningún recurso debe incorporarse al catálogo final sin comprobar que archivo, etiqueta y descripción representan la misma seña.

## 6. Matriz de trazabilidad con el PDF inicial

| Requisito original | Resultado de la revisión |
|---|---|
| RF01–RF04 | Se conservan y amplían en RF01–RF12. |
| RF05–RF06 | Se modifican: seis bloques de abecedario, tratamiento separado de movimiento y tres actividades de refuerzo. Véanse RF13–RF20 y AB-01. |
| RF07–RF08 | Se sustituyen cuatro grupos de cinco por tres módulos 1–8, 9–14 y 15–20. Solo 1–8 usa cámara. |
| RF09–RF10 | Se conservan y amplían a 17 expresiones. |
| RF11–RF12 | Se conservan y amplían a 18 expresiones. |
| RF13–RF14 | Se conservan como progreso local, desbloqueo secuencial y resumen por módulo; se aclara el modelo de perfil único. |
| RFN01–RFN02 | Se conservan con paleta actualizada, modo oscuro y criterios de accesibilidad. |
| RFN03 | Se conserva Android 8 como plataforma objetivo, aunque la configuración técnica permite API 24. |
| RFN04 | Se convierte en requisito de aprobación con evidencia; su cumplimiento sigue pendiente. |
| RFN05–RFN06 | Se conservan; el APK debug actual está por debajo de 300 MB. |
| RFN07–RFN09 | Se reformulan como RNF17–RNF21 para que sean verificables y reflejen la deuda técnica real. |
| Requisitos técnicos | Se actualizan de React 18/TypeScript/Capacitor 6 a React 19/JavaScript/Capacitor 8 y a las versiones instaladas. |

## 7. Pendientes obligatorios antes de declarar cumplimiento total

1. Resolver AB-01 y validar el catálogo completo del abecedario con una fuente institucional o especialista en LSM.
2. Obtener y archivar evidencia de validación lingüística para los 80 elementos didácticos actuales: 25 letras únicas, 20 números, 17 saludos y 18 expresiones de comunicación.
3. Verificar que futuras compilaciones y publicaciones conserven el identificador `com.kinesena.app` y el nombre visible “KineSeña”.
4. Ejecutar pruebas funcionales en Android 8, una versión intermedia y Android 16, incluyendo permisos, cámara, rotación, modo oscuro y funcionamiento sin conexión.
5. Auditar accesibilidad, tamaños táctiles, contraste, lectura por TalkBack y reducción de movimiento.
6. Medir rendimiento y tamaño sobre un APK release firmado; documentar compresión de recursos.
7. Centralizar la configuración del abecedario y añadir pruebas automatizadas para catálogos, rutas, desbloqueo y persistencia.
8. Revisar permisos Android y retirar los que no sean necesarios.

## 8. Criterio de aceptación de la versión

La versión se considerará candidata a entrega cuando compile y pase análisis estático, cumpla los flujos RF01–RF41 aplicables, no contenga recursos faltantes, resuelva los pendientes 1 a 4 de la sección anterior y disponga de evidencia de prueba del APK release por debajo de 300 MB.
