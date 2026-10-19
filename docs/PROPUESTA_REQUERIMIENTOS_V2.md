# Propuesta de requisitos para KineSeña V2

**Estado:** Borrador 0.1 para revisión y aprobación  
**Fecha:** 8 de septiembre de 2026  
**Línea base:** `docs/REQUERIMIENTOS_ACTUALIZADOS.md`  
**Propósito:** Definir las ampliaciones propuestas para la siguiente versión de KineSeña sin alterar los requisitos ya implementados ni dar por aprobadas decisiones de producto pendientes.

> Este documento es prospectivo. Los identificadores `RFV2`, `RNFV2`, `RBV2` y `EXP-V2` se usan para no renumerar ni confundir los requisitos de la línea base. Un requisito marcado como **P0** es esencial para la entrega V2; **P1** es una ampliación planificada; **EXP** es investigación o piloto y no debe bloquear el aprendizaje si no alcanza los criterios de calidad.

## 1. Objetivo de la versión

KineSeña V2 ampliará la aplicación de aprendizaje inicial de Lengua de Señas Mexicana (LSM) para que sea accesible en Android e iOS, ofrezca una experiencia multisensorial configurable, muestre el avance del usuario y favorezca el repaso a largo plazo.

La versión conservará como principio el aprendizaje visual, el uso sin conexión para el contenido esencial y el procesamiento local de la cámara. La conectividad, cuando se habilite, será voluntaria y nunca será necesaria para comenzar una lección, consultar el contenido base o practicar con cámara.

La V2 no pretende traducir LSM automáticamente ni certificar que una persona ejecuta una seña de forma lingüísticamente correcta. La cámara será una herramienta de práctica guiada y su reconocimiento dinámico, si se incorpora, estará limitado a un piloto pequeño y validado.

## 2. Alcance, prioridades y definiciones

### 2.1 Alcance heredado

Se conservan los flujos de inicio, categorías, lecciones, ejercicios, prácticas generales, progreso local, modo claro/oscuro y práctica con cámara que están definidos en la línea base, salvo cuando este documento los amplíe o sustituya expresamente.

### 2.2 Prioridades

| Prioridad | Significado |
|---|---|
| P0 | Requisito indispensable para declarar la V2 candidata a entrega. |
| P1 | Requisito deseado para V2; puede programarse en una entrega posterior de la misma versión si no compromete los P0. |
| EXP | Piloto controlado. Se habilita solo si supera la validación definida; su ausencia no bloquea el resto de V2. |

### 2.3 Definiciones

- **Elemento de aprendizaje:** letra, número, palabra, expresión o seña individual incluida en el catálogo.
- **Lección completada:** lección cuyo flujo mínimo fue terminado según sus reglas actuales.
- **Elemento dominado:** elemento que, además de haber sido visto, mantiene resultados satisfactorios en repasos separados en el tiempo. No es equivalente a una certificación de dominio de LSM.
- **Repaso pendiente:** elemento que el sistema selecciona porque tuvo errores, lleva tiempo sin practicarse o aún no alcanza el estado de dominado.
- **Práctica guiada:** actividad con instrucciones y retroalimentación aproximada que ayuda a ensayar una seña, sin emitir un juicio lingüístico definitivo.
- **Contenido base:** lecciones, medios y modelos necesarios para las categorías incluidas al instalar la aplicación.
- **Sincronización opcional:** respaldo o restauración iniciados por el usuario; no es un requisito para usar la aplicación.

## 3. Requisitos funcionales

### 3.1 Perfil y visualización de avance

#### RFV2-01. Perfil local del usuario

**Prioridad:** P0

El sistema contará con una pantalla denominada **Mi avance** accesible desde la navegación principal. La pantalla representará el perfil local existente sin obligar al usuario a crear una cuenta, proporcionar correo electrónico ni contraseña.

La pantalla deberá permitir al usuario:

- Consultar y modificar el nombre visible del perfil local.
- Ver la fecha de la última actividad registrada.
- Acceder a las preferencias de sonido, hápticos, animaciones, recordatorios y conectividad.
- Iniciar el borrado del progreso local desde una acción claramente diferenciada y confirmada.

Durante V2 habrá un perfil local activo por instalación. El nombre del perfil no creará perfiles independientes ni dividirá el progreso existente hasta que se apruebe una función específica de perfiles múltiples.

#### RFV2-02. Resumen global de progreso

**Prioridad:** P0

La pantalla Mi avance mostrará un resumen actualizado del aprendizaje sin requerir conexión a Internet. Como mínimo presentará:

- Porcentaje total de progreso y porcentaje por cada categoría.
- Número de módulos y lecciones completados respecto del total disponible.
- Número de elementos marcados como pendientes de repaso.
- Tiempo acumulado de práctica estimado a partir de sesiones completadas.
- Estado de la meta diaria, si el usuario la habilitó.

El sistema diferenciará visual y textualmente entre **completado**, **por repasar** y **dominado**. Una lección completada no se presentará automáticamente como dominada.

#### RFV2-03. Detalle de avance por contenido

**Prioridad:** P0

Desde el resumen, el usuario podrá abrir cada categoría para consultar el avance por módulo y nivel. Para cada elemento disponible, el sistema mostrará, cuando aplique:

- Estado de la lección: no iniciada, en curso o completada.
- Estado de repaso: nuevo, en aprendizaje, por repasar o dominado.
- Fecha de la última práctica.
- Motivo simple por el cual se recomienda repasarlo, por ejemplo: “tuviste errores recientemente” o “hace varios días que no lo practicas”.

La información se expresará con etiquetas y texto; no dependerá únicamente de barras, colores o iconos.

#### RFV2-04. Meta de práctica y racha opcionales

**Prioridad:** P1

El usuario podrá activar una meta diaria de práctica y elegir una duración de referencia de 5, 10 o 15 minutos. También podrá desactivar la meta y la visualización de racha en cualquier momento.

Una racha solo aumentará cuando el usuario complete una sesión de aprendizaje o repaso que cumpla la duración mínima configurada. El sistema no mostrará mensajes de culpa ni bloqueará contenido cuando una racha se interrumpa.

#### RFV2-05. Recordatorios locales de práctica

**Prioridad:** P1

Cuando el usuario habilite recordatorios, podrá seleccionar una hora y los días de la semana en que desea recibir una notificación local. La notificación invitará a abrir un repaso breve y no revelará datos personales ni resultados de aprendizaje en la pantalla bloqueada.

La denegación del permiso de notificaciones no afectará el uso de las lecciones ni la visualización del perfil.

### 3.2 Retroalimentación sonora, háptica y visual

#### RFV2-06. Preferencias independientes de retroalimentación

**Prioridad:** P0

El sistema ofrecerá interruptores independientes para:

- Sonidos de interacción.
- Retroalimentación háptica o vibración.
- Animaciones decorativas.

Las preferencias se guardarán localmente y se aplicarán de inmediato. Por defecto, la aplicación podrá ofrecer las tres opciones activadas durante el primer uso, pero deberá explicarlas y permitir modificarlas sin salir de la pantalla.

#### RFV2-07. Retroalimentación al acertar

**Prioridad:** P0

Al responder correctamente un ejercicio, completar una pareja o conseguir una coincidencia suficiente en práctica de cámara, el sistema mostrará un mensaje visual de éxito y la explicación correspondiente.

Si las preferencias están activas y el dispositivo lo permite, el sistema emitirá:

- Un sonido corto y no intrusivo de acierto.
- Un único pulso háptico breve.

En las prácticas de cámara, el acierto háptico y sonoro se emitirá una sola vez por objetivo validado; no se repetirá por cada fotograma detectado.

#### RFV2-08. Retroalimentación al equivocarse

**Prioridad:** P0

Al responder incorrectamente, el sistema mostrará una explicación clara sobre el siguiente paso, por ejemplo revisar la referencia, intentar de nuevo o identificar el rasgo que diferencia las opciones.

Si las preferencias están activas y el dispositivo lo permite, el sistema emitirá:

- Un sonido corto de error distinguible del sonido de acierto.
- Dos pulsos hápticos breves y separados.

La aplicación no vibrará continuamente mientras la cámara detecte una postura no coincidente. En ese contexto, el aviso solo podrá producirse después de que el usuario termine un intento o tras un intervalo visible de retroalimentación.

#### RFV2-09. Retroalimentación no dependiente de un solo canal

**Prioridad:** P0

Todo resultado correcto, incorrecto, bloqueado o pendiente deberá comunicarse mediante texto y una señal visual distinguible. El sonido, los hápticos, el color y las animaciones solo complementarán esa información.

Si un dispositivo no tiene motor háptico, tiene el audio silenciado o el usuario desactiva estas opciones, la experiencia deberá conservar la misma información y posibilidad de continuar.

### 3.3 Recursos multimedia y animaciones

#### RFV2-10. Recursos visuales controlables

**Prioridad:** P0

Cada seña dinámica o expresión que requiera movimiento dispondrá de un recurso visual controlable. El usuario podrá reproducir, pausar, reiniciar y repetir el recurso sin perder el progreso de la lección.

Cuando sea apropiado para el recurso y esté validado por el equipo de contenido LSM, el reproductor permitirá velocidad lenta de 0.5x y 0.75x, velocidad normal de 1x y modo espejo claramente etiquetado. El modo espejo no se habilitará para un recurso si altera una característica didáctica relevante de la seña.

#### RFV2-11. Descripción y alternativas de los recursos

**Prioridad:** P0

Toda demostración visual incluirá nombre, descripción breve de ejecución y una explicación textual de los aspectos relevantes, tales como forma de mano, orientación, ubicación y movimiento cuando corresponda.

Los videos que contengan voz, música o información no visible incluirán subtítulos o transcripción. Ninguna instrucción necesaria para completar una lección dependerá exclusivamente de audio.

#### RFV2-12. Animaciones de apoyo

**Prioridad:** P1

La aplicación podrá usar microanimaciones para indicar progreso, transiciones, trayectorias, éxito o error. Las animaciones deberán:

- Tener una finalidad educativa o de orientación concreta.
- Poder pausarse, omitirse o reducirse mediante la preferencia de animaciones.
- No impedir tocar controles ni retrasar innecesariamente la navegación.
- No ser la única demostración de una seña ni sustituir un video o secuencia controlable cuando el movimiento de la seña sea relevante.

La selección entre video, animación vectorial o imagen será técnica; el requisito no obliga a usar GIF.

### 3.4 Repaso adaptativo

#### RFV2-13. Registro de desempeño por elemento

**Prioridad:** P0

El sistema guardará localmente, para cada elemento que el usuario practique:

- Número de intentos, aciertos y errores.
- Fecha de la última práctica.
- Fecha programada para el siguiente repaso, cuando aplique.
- Estado de aprendizaje: nuevo, en aprendizaje, por repasar o dominado.

El registro no almacenará imágenes, video, fotogramas ni puntos de referencia de la cámara como parte del historial normal de aprendizaje.

#### RFV2-14. Selección de repaso adaptativo

**Prioridad:** P0

El sistema calculará los elementos por repasar a partir del desempeño local. Dará prioridad a los elementos con errores recientes, baja consistencia de aciertos o una fecha de repaso vencida.

Las reglas exactas de intervalos y dominio deberán ser configurables y documentadas por el equipo pedagógico. Cualquier modificación del algoritmo conservará el historial existente y no eliminará una lección completada.

#### RFV2-15. Sesión “Repaso de hoy”

**Prioridad:** P0

La pantalla Mi avance ofrecerá una sesión denominada **Repaso de hoy** de duración estimada entre tres y cinco minutos. La sesión incluirá elementos ya vistos y combinará, según el contenido, reconocimiento visual, actividades breves o práctica guiada.

La sesión deberá:

- Mostrar cuántos elementos quedan y permitir salir sin penalización.
- No exigir cronómetro ni imponer límite de tiempo para responder.
- Informar al terminar qué elementos mejoraron, cuáles siguen pendientes y qué puede repetirse.
- Permitir iniciar otra sesión de repaso si el usuario lo desea.

### 3.5 Actividades nuevas de práctica general

#### RFV2-16. Actividad “Detecta la diferencia”

**Prioridad:** P1

La aplicación ofrecerá una actividad donde el usuario compare señas similares y responda cuál corresponde al objetivo solicitado o qué rasgo las diferencia.

La actividad podrá contrastar forma de mano, orientación, ubicación o movimiento, siempre con recursos validados de LSM. Después de cada respuesta, mostrará una explicación breve y permitirá reintentar los reactivos incorrectos.

#### RFV2-17. Actividad “Dictado visual”

**Prioridad:** P1

La aplicación ofrecerá ejercicios en los que el usuario observe una imagen o clip de una seña y responda sin depender siempre de cuatro opciones visibles. Según el módulo, podrá elegir una palabra, construir un deletreo o ordenar una secuencia de señas.

Antes de comprobar la respuesta, el usuario podrá revisar la referencia. El sistema explicará el resultado y permitirá corregirlo sin perder el acceso a la actividad.

#### RFV2-18. Actividad “Misión cotidiana”

**Prioridad:** P1

La aplicación ofrecerá situaciones breves y visuales de la vida diaria, por ejemplo presentarse, pedir agua, pedir ayuda, ubicar un lugar o despedirse. El usuario deberá seleccionar u ordenar las señas apropiadas para resolver la situación.

Cada misión mostrará el contexto antes de pedir una respuesta, utilizará vocabulario que ya haya sido presentado o señalará claramente el vocabulario nuevo, y explicará por qué la solución es adecuada.

#### RFV2-19. Actividad “Conversación en orden”

**Prioridad:** P1

La aplicación ofrecerá una actividad para ordenar los turnos de una conversación corta. El usuario organizará clips, imágenes o tarjetas de señas para formar un intercambio coherente.

Al comprobar la respuesta, el sistema mostrará el orden correcto y permitirá reproducir cada recurso de la conversación. La actividad no evaluará expresiones faciales o movimiento mediante cámara.

#### RFV2-20. Reto de repaso y repetición de actividades

**Prioridad:** P1

La aplicación ofrecerá un reto breve que reutilice elementos pendientes de repaso, errores frecuentes o contenido elegido por el usuario. El temporizador, si se ofrece como variante lúdica, será opcional y nunca reducirá la calificación de una actividad.

Todas las nuevas actividades podrán repetirse. El sistema guardará el estado de completada por primera vez y el historial de intentos sin borrar los logros anteriores al jugar de nuevo.

### 3.6 Práctica con cámara

#### RFV2-21. Solicitud contextual de cámara y preparación

**Prioridad:** P0

El sistema solicitará permiso de cámara únicamente cuando el usuario elija una actividad que la requiera. Antes de abrir el visor, mostrará una preparación breve con:

- Motivo del uso de cámara y aviso de procesamiento local.
- Indicaciones de iluminación, distancia, encuadre y mano visible.
- Opción de cancelar y volver a la lección.
- Alternativa para continuar con práctica visual si el permiso es denegado o el dispositivo no es compatible.

La denegación del permiso no bloqueará el contenido demostrativo, ejercicios ni actividades generales.

#### RFV2-22. Calibración para señas estáticas

**Prioridad:** P0

Antes de comenzar una práctica de seña estática, el sistema verificará de forma comprensible que existe una mano visible y que el encuadre, iluminación y distancia permiten intentar la detección.

Durante la práctica, deberá señalar situaciones como “mano fuera del encuadre”, “acércate un poco”, “mejora la iluminación” o “mantén la mano estable”, sin afirmar que la seña es incorrecta cuando la calidad de la imagen no permita evaluarla.

#### RFV2-23. Resultado de práctica estática

**Prioridad:** P0

Para las señas estáticas que hayan sido validadas técnicamente, el sistema comparará la postura detectada con el objetivo y pedirá mantener una coincidencia estable durante un periodo visible de aproximadamente 0.75 a 1 segundo.

El resultado se expresará como **coincidencia aproximada**, **sigue practicando** o **no fue posible evaluar**, acompañado de una sugerencia accionable. El resultado no se presentará como certificación de corrección lingüística.

El usuario podrá reintentar, consultar de nuevo la demostración o continuar mediante el modo de práctica visual. Un fallo de detección no eliminará progreso previamente ganado.

#### RFV2-24. Práctica guiada de señas en movimiento

**Prioridad:** P1

Para señas con movimiento, la aplicación ofrecerá práctica guiada aunque no exista validación automática. La actividad incluirá:

- Video de referencia reproducible, repetible y con velocidad lenta.
- Vista de cámara del usuario al lado de la referencia o una alternativa para intercambiarlas.
- Indicaciones visuales de inicio, dirección de trayectoria, orientación o pasos relevantes cuando el contenido lo permita.
- Botón para marcar la práctica como realizada y continuar con el flujo de aprendizaje.

La actividad indicará expresamente que se trata de una guía de práctica y no de evaluación automática de la seña.

### 3.7 Piloto de reconocimiento de movimiento

#### EXP-V2-01. Catálogo limitado del piloto dinámico

**Prioridad:** EXP

El piloto de reconocimiento automático de movimiento se limitará a entre tres y cinco señas aisladas, frecuentes y aprobadas para este propósito. El catálogo exacto deberá estar visible en la aplicación y documentado antes de iniciar el piloto.

El piloto no incluirá reconocimiento general de LSM, traducción de frases, conversaciones, evaluación de expresiones faciales ni calificación de vocabulario fuera de su catálogo explícito.

#### EXP-V2-02. Interacción y salida segura del piloto

**Prioridad:** EXP

Para cada seña piloto, el sistema analizará una secuencia temporal de la práctica y ofrecerá retroalimentación de coincidencia aproximada, intento no reconocido o necesidad de mejorar el encuadre.

El usuario siempre podrá abandonar el piloto y usar la práctica guiada del RFV2-24. No se exigirá completar una validación dinámica experimental para desbloquear lecciones, obtener una racha o conservar progreso.

#### EXP-V2-03. Habilitación condicionada del piloto

**Prioridad:** EXP

La función solo podrá exponerse a usuarios después de cumplir los criterios de calidad, privacidad y validación LSM definidos en RNFV2-21 a RNFV2-24. Mientras no los cumpla, deberá mantenerse deshabilitada o identificada como prueba limitada.

### 3.8 Operación local primero y conectividad opcional

#### RFV2-25. Uso sin conexión del contenido esencial

**Prioridad:** P0

Después de instalar la aplicación, el usuario podrá consultar el contenido base, reproducir recursos incluidos, completar ejercicios, usar el perfil y practicar con cámara sin conexión a Internet.

Cuando no haya conexión, la aplicación mostrará un estado discreto y continuará guardando el progreso localmente. No mostrará errores que impidan acceder a contenido ya instalado.

#### RFV2-26. Respaldo y sincronización voluntarios

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

El usuario podrá crear o vincular una cuenta opcional exclusivamente para respaldar y restaurar datos de progreso y preferencias permitidas. El flujo explicará qué datos se sincronizan, con qué finalidad y cómo desactivar la función.

No se solicitará cuenta durante el primer acceso ni como condición para aprender. El usuario podrá conservar el perfil local sin usar ningún servicio en línea.

#### RFV2-27. Sincronización no regresiva

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

Cuando un usuario elija sincronizar, el sistema combinará el progreso de forma que una lección marcada como completada no vuelva a estado no iniciado por un conflicto entre dispositivos.

Antes de sustituir datos locales por una copia remota, el sistema explicará la acción y solicitará confirmación. Si no puede resolver un conflicto automáticamente, mostrará las alternativas de conservar el dispositivo, restaurar el respaldo o posponer la decisión.

#### RFV2-28. Paquetes y actualizaciones de contenido

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

El sistema podrá ofrecer nuevos módulos o correcciones de contenido como paquetes descargables opcionales. Cada paquete indicará nombre, tamaño, versión, contenido incluido y si requiere conexión para descargarlo.

La aplicación no eliminará ni reemplazará recursos descargados sin informar al usuario. Un paquete incompleto o fallido podrá reanudarse, cancelarse o eliminarse sin dañar el contenido base ni el progreso local.

#### RFV2-29. Estado de conectividad y cola de cambios

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

Si el usuario habilitó sincronización y realiza actividades sin conexión, el sistema conservará los cambios localmente y mostrará de forma comprensible que hay un respaldo pendiente. Al recuperar conexión, solicitará o ejecutará la sincronización según la preferencia elegida.

La aplicación deberá permitir revisar la fecha del último respaldo correcto y reintentar una operación fallida.

#### RFV2-30. Desconexión y eliminación de datos remotos

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

El usuario podrá desconectar su cuenta, dejar de sincronizar y solicitar la eliminación de sus datos remotos desde la aplicación. Antes de confirmar, el sistema explicará qué datos locales permanecerán y qué datos dejarán de estar disponibles en otros dispositivos.

### 3.9 Datos opcionales para mejora

#### RFV2-31. Consentimiento separado para analítica y mejora de modelos

**Prioridad:** P1

Si se propone recopilar analítica de uso o datos para mejorar los modelos de reconocimiento, el sistema solicitará un consentimiento separado del consentimiento de respaldo. El usuario podrá rechazarlo, retirarlo posteriormente y seguir utilizando las funciones esenciales.

Por defecto, la aplicación no enviará imágenes, video, audio, fotogramas ni puntos de referencia de la cámara. Cualquier futura recopilación de este tipo requerirá un flujo de consentimiento específico, explicará el propósito, periodo de conservación, medidas de seguridad y opción de revocación.

## 4. Requisitos no funcionales

### 4.1 Calidad y pertinencia del contenido LSM

#### RNFV2-01. Validación lingüística y cultural

**Prioridad:** P0

Antes de publicar o actualizar un elemento de aprendizaje, su seña, descripción, demostración, contexto y actividad asociada deberán haber sido revisados y aprobados por al menos una persona sorda usuaria competente de LSM y una persona especialista o responsable de contenido LSM designada por el proyecto.

La evidencia de esa revisión incluirá identificador del recurso, versión, fecha, personas o institución responsable, observaciones y estado de aprobación.

#### RNFV2-02. Variantes, contexto y derechos de recursos

**Prioridad:** P0

El catálogo conservará metadatos sobre variante, contexto de uso, fuente, licencia y consentimiento de imagen o video de cada recurso. Si existen variantes relevantes, la aplicación las explicará sin presentarlas como errores de otras comunidades o regiones.

No se publicará un recurso cuyo archivo, etiqueta, descripción y seña demostrada no coincidan.

### 4.2 Compatibilidad y plataformas

#### RNFV2-03. Compatibilidad móvil

**Prioridad:** P0

La versión V2 deberá estar disponible como aplicación nativa para Android e iOS. Como propuesta técnica inicial, el soporte mínimo será Android 8.0 e iOS 15, sujeto a confirmación mediante la matriz de pruebas antes de aprobar la versión final.

Los flujos esenciales de inicio, lecciones, perfil, preferencias, multimedia, progreso y práctica de cámara deberán ofrecer funcionalidad equivalente en ambas plataformas, salvo limitaciones de hardware comunicadas claramente.

#### RNFV2-04. Integración segura con iOS

**Prioridad:** P0

La versión para iOS incluirá descripciones claras de permiso de cámara, respetará las áreas seguras de pantalla, funcionará en orientación vertical y no dependerá de comportamientos exclusivos de Android.

Las funciones de cámara, reproducción de video, hápticos y notificaciones se verificarán en dispositivos iPhone físicos además de simuladores cuando correspondan.

### 4.3 Accesibilidad y experiencia inclusiva

#### RNFV2-05. Accesibilidad visual e interacción

**Prioridad:** P0

Las pantallas nuevas y modificadas deberán cumplir como objetivo WCAG 2.2 nivel AA para contraste, foco visible, nombres accesibles, orden de navegación y estados de controles.

Los controles táctiles principales tendrán una zona objetivo mínima de 44 por 44 puntos lógicos o equivalente. La interfaz permitirá aumento de texto del sistema sin superponer información esencial ni dejar controles inaccesibles.

#### RNFV2-06. Lectores de pantalla y alternativas textuales

**Prioridad:** P0

Los controles, iconos, progreso, estados de juego y mensajes de cámara deberán disponer de etiquetas comprensibles para VoiceOver y TalkBack. Las imágenes decorativas no deberán añadir ruido a los lectores de pantalla.

Todo color, icono, animación o sonido usado para comunicar un estado tendrá una alternativa textual equivalente.

#### RNFV2-07. Movimiento, sonido y hápticos

**Prioridad:** P0

La aplicación respetará la preferencia del sistema para reducir movimiento y la preferencia interna definida en RFV2-06. Al reducirse el movimiento, las transiciones decorativas se simplificarán o detendrán sin ocultar información.

Los sonidos y hápticos serán breves, distinguibles, opcionales y no se activarán de forma repetitiva o inesperada.

### 4.4 Privacidad, seguridad y datos

#### RNFV2-08. Procesamiento local de cámara

**Prioridad:** P0

Los fotogramas de cámara usados para la práctica normal se procesarán localmente, no se guardarán de forma permanente y no se transmitirán a servidores por defecto.

La aplicación solicitará el permiso justo antes de usar la cámara y dejará de capturar al salir de la actividad, perder el foco de la aplicación o revocar el permiso.

#### RNFV2-09. Minimización y control de datos

**Prioridad:** P0

El sistema solo almacenará los datos necesarios para ofrecer perfil, progreso, preferencias y repasos. El usuario deberá poder consultar, borrar o restablecer dichos datos locales.

La eliminación requerirá confirmación explícita e informará que el progreso local no podrá recuperarse si no existe un respaldo voluntario.

#### RNFV2-10. Protección de datos sincronizados

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

Toda comunicación con servicios remotos utilizará cifrado en tránsito. Las credenciales o tokens de una cuenta opcional se guardarán mediante los mecanismos seguros de cada sistema operativo y no se incluirán en registros de diagnóstico.

El servicio remoto aplicará controles de acceso por cuenta, conservará solo los datos aprobados y ofrecerá un mecanismo de eliminación verificable.

#### RNFV2-11. Integridad de paquetes de contenido

**Prioridad:** P1, condicionado a la aprobación de conectividad local primero

Los paquetes descargables deberán verificar versión, origen e integridad antes de ponerse a disposición de las lecciones. Un archivo corrupto, incompleto o no verificable no sustituirá el contenido instalado.

### 4.5 Operación sin conexión, rendimiento y confiabilidad

#### RNFV2-12. Resiliencia sin conexión

**Prioridad:** P0

La ausencia, pérdida o recuperación de conexión no deberá cerrar una lección, borrar progreso ni detener una práctica de cámara que use recursos instalados. El sistema usará mensajes comprensibles y ofrecerá reintentos para operaciones opcionales que requieran red.

#### RNFV2-13. Rendimiento de interfaz

**Prioridad:** P0

En los dispositivos objetivo, las acciones de navegación y respuesta visual a una pulsación deberán ocurrir en menos de 500 ms en condiciones normales, excluyendo el inicio de cámara y la carga inicial de recursos pesados.

La aplicación no deberá bloquear la interfaz por operaciones de sincronización, descarga o análisis de cámara. Las operaciones prolongadas mostrarán estado de carga, opción de cancelar cuando sea seguro y mensajes de error recuperables.

#### RNFV2-14. Rendimiento de cámara

**Prioridad:** P0

La práctica de cámara mostrará una vista previa o un error recuperable en un máximo de ocho segundos después de conceder permiso en los dispositivos objetivo. Durante la práctica, deberá proporcionar retroalimentación suficiente para que el usuario perciba que la detección sigue activa sin congelar la navegación.

El procesamiento reducirá resolución, frecuencia de análisis o complejidad cuando sea necesario para conservar estabilidad y temperatura razonable del dispositivo. El uso de la cámara se pausará al enviar la aplicación a segundo plano.

#### RNFV2-15. Tamaño y disponibilidad de medios

**Prioridad:** P0

El contenido base seguirá disponible sin conexión y la compilación instalable de cada plataforma no superará 300 MB, salvo que se apruebe explícitamente una excepción documentada. Los módulos adicionales se distribuirán como paquetes opcionales si fueran necesarios para conservar ese límite.

Los recursos multimedia deberán tener manejo visible de carga, error y ausencia de archivo; un recurso faltante no deberá dejar la pantalla bloqueada.

#### RNFV2-16. Persistencia y recuperación

**Prioridad:** P0

El guardado de progreso, preferencias e historial de repaso será atómico o recuperable ante cierre inesperado. Las actualizaciones de la aplicación migrarán los datos existentes sin eliminar nombre, tema, progreso ni estados de actividad ya guardados.

Antes de publicar una actualización que cambie el modelo de datos, se ejecutará una prueba de migración desde una instalación con datos reales de prueba.

### 4.6 Calidad de práctica con cámara y piloto dinámico

#### RNFV2-17. Límites honestos de la detección estática

**Prioridad:** P0

La validación automática se limitará a posturas estáticas cuyo comportamiento haya sido probado. El sistema distinguirá entre falta de mano, mala calidad de imagen, postura no reconocida y coincidencia suficiente; no deberá etiquetar todos los casos como “incorrecto”.

Los umbrales de detección se calibrarán con diversidad de manos, mano dominante, iluminación, distancia, dispositivos y orientaciones relevantes para el contenido aprobado.

#### RNFV2-18. Validación del piloto dinámico

**Prioridad:** EXP

Antes de habilitar una seña en el piloto de movimiento, el proyecto deberá disponer de un protocolo de prueba documentado con recursos consentidos, separación entre datos de ajuste y evaluación, diversidad de participantes y revisión por personas expertas en LSM.

El protocolo definirá previamente los umbrales de aceptación para coincidencias correctas, falsos aciertos, falsos rechazos y rendimiento por dispositivo. Si una seña no supera esos umbrales, se mantendrá únicamente como práctica guiada.

#### RNFV2-19. No certificación ni automatización general

**Prioridad:** P0

La interfaz no afirmará que el modelo certifica la corrección lingüística, traduce LSM ni evalúa una conversación completa. Los mensajes deberán describir la función como apoyo de práctica y coincidencia aproximada.

### 4.7 Calidad de ingeniería y liberación

#### RNFV2-20. Arquitectura mantenible

**Prioridad:** P0

Los catálogos de contenido, reglas de repaso, preferencias, historial y estados de perfil se mantendrán separados de las vistas. Las reglas de detección de cámara y los catálogos de señas no deberán quedar duplicados entre pantallas.

Los componentes equivalentes de video, actividades, perfil y retroalimentación reutilizarán una implementación común cuando sea posible.

#### RNFV2-21. Pruebas y matriz de dispositivos

**Prioridad:** P0

Antes de liberar V2, el equipo ejecutará pruebas funcionales en al menos:

- Una versión mínima, una intermedia y una reciente de Android soportado.
- Un iPhone compatible con la versión mínima de iOS, uno de tamaño estándar y uno de tamaño o generación reciente.
- Escenarios con y sin permiso de cámara, sin conexión, con almacenamiento limitado, modo claro y oscuro, texto ampliado, reducción de movimiento, audio silenciado y hápticos no disponibles.

También realizará pruebas de accesibilidad con VoiceOver y TalkBack, y pruebas de usabilidad con personas del público objetivo.

#### RNFV2-22. Criterio de liberación

**Prioridad:** P0

La V2 será candidata a entrega cuando:

- Los requisitos P0 aplicables estén implementados y verificados.
- Las revisiones de contenido LSM y derechos de recursos estén documentadas.
- No existan defectos críticos abiertos en inicio, progreso, privacidad, multimedia o cámara.
- Las pruebas de plataforma, accesibilidad, modo sin conexión y migración de datos hayan sido aprobadas.
- Las funciones P1 condicionadas y EXP estén claramente deshabilitadas o etiquetadas si aún no cuentan con aprobación, infraestructura o calidad suficiente.

## 5. Reglas de negocio V2

| ID | Regla |
|---|---|
| RBV2-01 | El usuario puede aprender con perfil local sin cuenta, correo ni conexión a Internet. |
| RBV2-02 | Una lección completada y un logro guardado no se perderán al repetir una actividad, actualizar la aplicación o sincronizar entre dispositivos. |
| RBV2-03 | El estado “dominado” es una ayuda de repaso; no equivale a certificación de competencia en LSM. |
| RBV2-04 | Un error de reconocimiento técnico, permiso denegado o mala iluminación no impedirá consultar contenido ni completar el flujo alternativo de práctica visual. |
| RBV2-05 | Los efectos de acierto y error serán, respectivamente, un pulso y dos pulsos como máximo por intento cuando los hápticos estén habilitados; nunca se usarán como única retroalimentación. |
| RBV2-06 | Las actividades nuevas podrán repetirse y conservarán el primer estado de completada junto con el historial necesario para el repaso. |
| RBV2-07 | El contenido dinámico se ofrecerá siempre con práctica guiada; la validación automática de movimiento será opcional y limitada al piloto aprobado. |
| RBV2-08 | Los fotogramas, videos y puntos de referencia de cámara no se enviarán fuera del dispositivo por defecto. |
| RBV2-09 | La sincronización, respaldo, paquetes descargables y analítica solo operarán tras una acción o consentimiento explícito del usuario. |
| RBV2-10 | Ante un conflicto de sincronización, el progreso completado no retrocederá automáticamente. |
| RBV2-11 | Ningún recurso nuevo se publicará sin trazabilidad de revisión LSM, fuente, licencia y consistencia entre archivo, etiqueta y descripción. |
| RBV2-12 | El usuario podrá desactivar sonido, hápticos, animaciones, metas, recordatorios y conectividad opcional sin perder acceso al aprendizaje esencial. |

## 6. Trazabilidad con la línea base

| Necesidad propuesta | Requisitos V2 | Requisitos base que amplía o modifica |
|---|---|---|
| Retroalimentación sonora y háptica | RFV2-06 a RFV2-09, RBV2-05 | RF24, RF35 y RNF06 |
| Recursos animados y multimedia mejorada | RFV2-10 a RFV2-12 | RF09 a RF12 y RNF13 |
| Perfil y avance | RFV2-01 a RFV2-05 | RF37 a RF41 y brecha PR-01 |
| Repaso adaptativo | RFV2-13 a RFV2-15 | RF17, RF20, RF24 y RF37 a RF40 |
| Actividades nuevas | RFV2-16 a RFV2-20 | RF19 y RF20 |
| Cámara estática mejorada | RFV2-21 a RFV2-23 | RF31 a RF36 |
| Práctica de movimiento | RFV2-24, EXP-V2-01 a EXP-V2-03 | RF14, RF16, RF23, RF27, RF30 y RB05 |
| iOS y accesibilidad | RNFV2-03 a RNFV2-07 | RNF01 a RNF08 y RNF22 |
| Conectividad local primero | RFV2-25 a RFV2-30, RNFV2-10 y RNFV2-11 | Sustituye RF41 y ajusta RNF09 a RNF11 solo si se aprueba |
| Validación de contenido LSM | RNFV2-01 y RNFV2-02 | RF10, RNF12 y RB06 |

## 7. Decisiones necesarias antes de aprobar la versión final

1. Confirmar si el modelo de conectividad local primero, con respaldo opcional, se aprueba para V2 o se mantiene exclusivamente el modo offline.
2. Confirmar la versión mínima definitiva de iOS y la matriz de iPhone objetivo después de las pruebas de cámara y multimedia.
3. Definir si las metas, rachas y recordatorios serán P1 de V2 o se moverán a una actualización posterior.
4. Elegir el catálogo exacto de las nuevas actividades y de las señas del piloto dinámico.
5. Definir los umbrales de calidad, el protocolo de consentimiento y el responsable de validación para el piloto de reconocimiento de movimiento.
6. Establecer el proveedor, costos, política de privacidad, retención, exportación y borrado antes de implementar respaldo o sincronización.
7. Corregir y validar el catálogo actual del abecedario antes de usarlo como fuente para nuevas actividades o modelos de reconocimiento.

## 8. Elementos explícitamente fuera de alcance de V2

- Traducción automática de conversaciones o frases completas de LSM.
- Evaluación lingüística definitiva de una seña mediante cámara.
- Reconocimiento automático general de todas las señas dinámicas.
- Subida automática de cámara o entrenamiento de modelos con datos de usuario.
- Clasificaciones públicas, red social o competencia entre usuarios.
- Cuenta obligatoria o pérdida de contenido por no tener conexión.

