const crearModulo = (id, nombre, descripcion, expresiones) => ({
  id,
  nombre,
  descripcion,
  expresiones: expresiones.map(([texto, archivo, detalle]) => ({
    texto,
    video: `/assets/comunicacion/videos/${archivo}.mp4`,
    descripcion: detalle,
  })),
});

export const modulosComunicacion = [
  crearModulo(1, 'Necesidades fisiológicas y comida', 'Comunica necesidades urgentes de alimentación y bienestar.', [
    ['Tengo hambre', 'tengo_hambre', 'Coloca ambas manos abiertas a la altura del estómago y tócalo con las puntas de los dedos. Mueve las manos hacia adelante mientras cierras los dedos; acompaña el movimiento con una expresión de necesidad.'],
    ['Tengo sed', 'tengo_sed', 'Forma la letra A con la mano dominante. Toca la parte alta del cuello con la punta del pulgar y recórrelo hacia abajo, como indicando la garganta seca.'],
    ['¿Dónde está el baño?', 'donde_esta_el_bano', 'Primero pregunta DÓNDE moviendo el índice dominante de un lado a otro y levantando las cejas. Después forma la letra B, colócala sobre el pecho y muévela de arriba abajo para BAÑO.'],
    ['¿Dónde está el agua?', 'donde_esta_el_agua', 'Pregunta DÓNDE moviendo el índice dominante de un lado a otro. Luego extiende el índice y flexiónalo y estíralo de forma repetida para AGUA; mantén las cejas levantadas.'],
  ]),
  crearModulo(2, 'Información de contacto y ayuda', 'Solicita orientación o apoyo en situaciones cotidianas.', [
    ['Ayuda', 'ayuda', 'Forma un puño con el pulgar levantado en la mano no dominante. Coloca debajo la palma de la mano dominante y eleva ambas manos juntas; dirige el movimiento hacia la persona que recibe la ayuda.'],
    ['¿Qué hora es?', 'que_hora_es', 'Señala la muñeca como si indicaras un reloj y realiza después la seña interrogativa QUÉ. Inclina ligeramente el cuerpo hacia adelante y levanta las cejas.'],
    ['Estoy perdido', 'estoy_perdido', 'Señala primero tu pecho. Después coloca ambas manos frente al torso y sepáralas con un movimiento de desorientación, cambiando ligeramente su dirección; acompaña con ceño fruncido y mirada de búsqueda.'],
    ['¿Me puedes ayudar?', 'me_puedes_ayudar', 'Señala a la otra persona, realiza PUEDES con ambas manos frente al torso y termina con AYUDAR: apoya un puño con el pulgar levantado sobre la palma contraria y mueve ambas manos hacia ti. Levanta las cejas.'],
  ]),
  crearModulo(3, 'Interacción básica', 'Mantén una conversación y pide aclaraciones.', [
    ['Sí', 'si', 'Forma un puño con la mano dominante y haz un movimiento corto hacia arriba y abajo, como si la mano asintiera. Acompaña con un asentimiento de cabeza.'],
    ['No', 'no', 'Extiende juntos el índice y el medio de la mano dominante y acércalos al pulgar una o dos veces. Refuerza la negación moviendo ligeramente la cabeza.'],
    ['No entiendo', 'no_entiendo', 'Realiza primero NO juntando el índice y el medio con el pulgar. Después lleva el índice dominante a la frente y muévelo hacia afuera; usa ceño fruncido y niega con la cabeza.'],
    ['¿Puedes repetir?', 'puedes_repetir', 'Señala a la otra persona y realiza PUEDES con ambas manos frente al torso. Para REPETIR, haz que la mano dominante vuelva a contactar o recorrer la palma de apoyo; levanta las cejas.'],
    ['Despacio', 'despacio', 'Coloca ambas manos abiertas frente al torso, con las palmas hacia abajo. Muévelas lenta y simultáneamente hacia abajo y ligeramente hacia adelante para pedir que disminuya la velocidad.'],
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
