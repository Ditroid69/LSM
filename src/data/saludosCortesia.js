const crearContenido = (id, nombre, descripcion, expresiones) => ({
  id,
  nombre,
  descripcion,
  expresiones: expresiones.map(([texto, archivo, detalle]) => ({
    texto,
    video: `/assets/saludos/videos/${archivo}.mp4`,
    descripcion: detalle,
  })),
});

export const modulosSaludos = [
  crearContenido(1, 'Saludos formales e informales', 'Inicia y cierra conversaciones cotidianas.', [
    ['Hola', 'hola', 'Levanta la mano dominante abierta a un lado de la frente, con los dedos juntos y la palma hacia el frente. Muévela hacia afuera en un arco corto mientras mantienes contacto visual y una expresión amable.'],
    ['Adiós', 'adios', 'Levanta la mano dominante a la altura del rostro, con la palma hacia la otra persona. Abre y cierra los dedos hacia la palma dos veces, o realiza el movimiento breve de despedida mostrado en el video.'],
    ['Buenos días', 'buenos_dias', 'Primero realiza BUENO: lleva la mano dominante abierta a la barbilla y muévela hacia adelante. Después realiza DÍA: coloca el antebrazo de apoyo horizontal y eleva el índice dominante desde detrás de este, como la salida del sol.'],
    ['Buenas tardes', 'buenas_tardes', 'Realiza BUENO llevando la mano dominante abierta desde la barbilla hacia adelante. Luego forma la letra T, apóyala sobre el antebrazo contrario y deslízala en línea recta hacia tu cuerpo para expresar TARDE.'],
    ['Buenas noches', 'buenas_noches', 'Realiza BUENO llevando la mano dominante abierta desde la barbilla hacia adelante. Después forma la letra G frente a la frente y bájala para representar NOCHE.'],
  ]),
  crearContenido(2, 'Cortesía básica', 'Usa expresiones respetuosas en situaciones comunes.', [
    ['Por favor', 'por_favor', 'Coloca la mano dominante abierta sobre el centro del pecho, con la palma tocándolo. Haz uno o dos círculos suaves sin separar la mano y acompaña la seña con una expresión cortés.'],
    ['Gracias', 'gracias', 'Toca la barbilla o los labios con las yemas de la mano dominante, con los dedos juntos. Lleva la mano hacia adelante y ligeramente hacia abajo, con la palma terminando hacia arriba.'],
    ['De nada', 'de_nada', 'Coloca ambas manos abiertas frente al torso y realiza el movimiento de negación o neutralización mostrado en el video, separándolas suavemente hacia los lados. Mantén una expresión amable.'],
    ['Perdón', 'perdon', 'Forma un puño con la mano dominante, colócalo sobre el centro del pecho y realiza círculos pequeños. Inclina ligeramente la cabeza y usa una expresión facial de disculpa.'],
    ['¿Cómo estás?', 'como_estas', 'Realiza primero CÓMO con ambas manos frente al torso, girándolas desde una posición cerrada hasta presentar las palmas. Después dirige la seña hacia la otra persona y marca la pregunta levantando las cejas.'],
  ]),
  crearContenido(3, 'Presentaciones', 'Preséntate y conoce a otras personas.', [
    ['Mucho gusto', 'mucho_gusto', 'Realiza MUCHO separando ambas manos desde el centro del torso. Para GUSTO, coloca la mano dominante abierta sobre el pecho y deslízala hacia abajo. Sonríe y mantén contacto visual.'],
    ['Mi nombre es…', 'mi_nombre_es', 'Señala tu pecho con el índice para indicar MI. Después forma la configuración de NOMBRE con ambas manos y haz dos contactos cortos entre los dedos. Finaliza deletreando tu nombre.'],
    ['¿Cómo te llamas?', 'como_te_llamas', 'Realiza CÓMO con ambas manos frente al torso; señala después a la persona y ejecuta NOMBRE haciendo dos contactos entre las configuraciones de ambas manos. Levanta las cejas durante toda la pregunta.'],
  ]),
];

export const obtenerModuloSaludos = (id) =>
  modulosSaludos.find((modulo) => String(modulo.id) === String(id));

export const mezclarSaludos = (elementos) => {
  const copia = [...elementos];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[aleatorio]] = [copia[aleatorio], copia[indice]];
  }
  return copia;
};
