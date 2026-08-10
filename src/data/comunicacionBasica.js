const crearModulo = (id, nombre, descripcion, carpeta, expresiones) => ({
  id,
  nombre,
  descripcion,
  expresiones: expresiones.map(([texto, archivo, detalle]) => ({
    texto,
    video: `/assets/comunicacion/${carpeta}/${archivo}.mp4`,
    descripcion: detalle,
  })),
});

export const modulosComunicacion = [
  crearModulo(1, 'Necesidades fisiológicas y comida', 'Comunica necesidades urgentes de alimentación y bienestar.', 'necesidades', [
    ['Tengo hambre', 'tengo_hambre', 'Coloca ambas manos abiertas a la altura del estómago y tócalo con las puntas de los dedos. Mueve las manos hacia adelante mientras cierras los dedos; acompaña el movimiento con una expresión de necesidad.'],
    ['Tengo sed', 'tengo_sed', 'Forma la letra A con la mano dominante. Toca la parte alta del cuello con la punta del pulgar y recórrelo hacia abajo, como indicando la garganta seca.'],
    ['¿Dónde está el baño?', 'donde_esta_el_bano', 'Primero pregunta DÓNDE moviendo el índice dominante de un lado a otro y levantando las cejas. Después forma la letra B, colócala sobre el pecho y muévela de arriba abajo para BAÑO.'],
    ['¿Quieres agua?', 'quieres_agua', 'Dirige primero la pregunta hacia la otra persona y realiza AGUA con el movimiento de la mano mostrado en el video. Mantén las cejas levantadas.'],
    ['Quiero comer', 'quiero_comer', 'Señala tu intención y lleva después la mano dominante hacia la boca para representar COMER, repitiendo el movimiento mostrado en el video.'],
    ['Tengo sueño', 'tengo_sueno', 'Señala tu cuerpo y realiza SUEÑO cerca del rostro siguiendo el cierre y descenso de la mano que se muestra en el video. Acompaña con expresión de cansancio.'],
    ['¿Tienes dudas?', 'tienes_dudas', 'Dirige la pregunta hacia la otra persona y realiza DUDA frente al rostro o torso como se muestra en el video. Levanta las cejas durante la pregunta.'],
  ]),
  crearModulo(2, 'Información de contacto y ayuda', 'Solicita orientación o apoyo en situaciones cotidianas.', 'informacion_contacto', [
    ['Ayúdame', 'ayudame', 'Forma un puño con el pulgar levantado, apóyalo sobre la palma contraria y mueve ambas manos hacia ti para solicitar ayuda.'],
    ['¿Qué hora es?', 'que_hora_es', 'Señala la muñeca como si indicaras un reloj y realiza después la seña interrogativa QUÉ. Inclina ligeramente el cuerpo hacia adelante y levanta las cejas.'],
    ['Estoy perdido', 'estoy_perdido', 'Señala primero tu pecho. Después coloca ambas manos frente al torso y sepáralas con un movimiento de desorientación, cambiando ligeramente su dirección; acompaña con ceño fruncido y mirada de búsqueda.'],
    ['¿Necesitas ayuda?', 'necesitas_ayuda', 'Dirige la pregunta hacia la otra persona y termina con AYUDA: apoya el puño con el pulgar levantado sobre la palma contraria y realiza el movimiento mostrado en el video.'],
  ]),
  crearModulo(3, 'Interacción básica', 'Mantén una conversación y pide aclaraciones.', 'interaccion_basica', [
    ['Sí', 'si', 'Forma un puño con la mano dominante y haz un movimiento corto hacia arriba y abajo, como si la mano asintiera. Acompaña con un asentimiento de cabeza.'],
    ['No', 'no', 'Extiende juntos el índice y el medio de la mano dominante y acércalos al pulgar una o dos veces. Refuerza la negación moviendo ligeramente la cabeza.'],
    ['No entiendo', 'no_entiendo', 'Realiza primero NO juntando el índice y el medio con el pulgar. Después lleva el índice dominante a la frente y muévelo hacia afuera; usa ceño fruncido y niega con la cabeza.'],
    ['¿Puedes repetirlo lento?', 'puedes_repetirlo_lento', 'Dirige PUEDES hacia la otra persona, realiza REPETIR y termina reduciendo deliberadamente la velocidad del movimiento para expresar LENTO. Levanta las cejas.'],
    ['Bien', 'bien', 'Realiza la posición y el movimiento afirmativo mostrado en el video frente al torso y acompáñalo con una expresión facial positiva.'],
    ['Mal', 'mal', 'Realiza la posición de MAL y el cambio de orientación mostrado en el video. Acompaña la seña con una expresión facial negativa.'],
    ['Más o menos', 'mas_o_menos', 'Coloca la mano a la altura del torso y realiza el movimiento alternado mostrado en el video para indicar un estado intermedio.'],
  ]),
];

export const obtenerModuloComunicacion = (id) =>
  modulosComunicacion.find((modulo) => String(modulo.id) === String(id));

export const mezclarComunicacion = (elementos) => {
  const copia = [...elementos];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[aleatorio]] = [copia[aleatorio], copia[indice]];
  }
  return copia;
};
