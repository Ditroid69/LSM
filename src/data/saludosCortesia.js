const crearContenido = (id, nombre, descripcion, carpeta, expresiones) => ({
  id,
  nombre,
  descripcion,
  expresiones: expresiones.map(([texto, archivo, detalle]) => ({
    texto,
    video: `/assets/saludos/${carpeta}/${archivo}.mp4`,
    descripcion: detalle,
  })),
});

export const modulosSaludos = [
  crearContenido(1, 'Saludos formales e informales', 'Inicia y cierra conversaciones cotidianas.', 'saludos_formales_informales', [
    ['Hola', 'hola', 'Levanta la mano dominante abierta a un lado de la frente, con los dedos juntos y la palma hacia el frente. Muévela hacia afuera en un arco corto mientras mantienes contacto visual y una expresión amable.'],
    ['Adiós', 'adios', 'Levanta la mano dominante a la altura del rostro, con la palma hacia la otra persona. Abre y cierra los dedos hacia la palma dos veces, o realiza el movimiento breve de despedida mostrado en el video.'],
    ['Buenos días', 'buenos_dias', 'Primero realiza BUENO: lleva la mano dominante abierta a la barbilla y muévela hacia adelante. Después realiza DÍA: coloca el antebrazo de apoyo horizontal y eleva el índice dominante desde detrás de este, como la salida del sol.'],
    ['Buenas tardes', 'buenas_tardes', 'Realiza BUENO llevando la mano dominante abierta desde la barbilla hacia adelante. Luego forma la letra T, apóyala sobre el antebrazo contrario y deslízala en línea recta hacia tu cuerpo para expresar TARDE.'],
    ['Buenas noches', 'buenas_noches', 'Realiza BUENO llevando la mano dominante abierta desde la barbilla hacia adelante. Después forma la letra G frente a la frente y bájala para representar NOCHE.'],
  ]),
  crearContenido(2, 'Cortesía básica', 'Usa expresiones respetuosas en situaciones comunes.', 'cortesia_basica', [
    ['Por favor', 'por_favor', 'Coloca la mano dominante abierta sobre el centro del pecho, con la palma tocándolo. Haz uno o dos círculos suaves sin separar la mano y acompaña la seña con una expresión cortés.'],
    ['Muchas gracias', 'muchas_gracias', 'Realiza GRACIAS desde la barbilla o los labios hacia adelante y refuerza la expresión con el movimiento adicional mostrado en el video. Mantén una expresión amable.'],
    ['De nada', 'de_nada', 'Coloca ambas manos abiertas frente al torso y realiza el movimiento de negación o neutralización mostrado en el video, separándolas suavemente hacia los lados. Mantén una expresión amable.'],
    ['Perdón', 'perdon', 'Forma un puño con la mano dominante, colócalo sobre el centro del pecho y realiza círculos pequeños. Inclina ligeramente la cabeza y usa una expresión facial de disculpa.'],
    ['¿Cómo estás?', 'como_estas', 'Realiza primero CÓMO con ambas manos frente al torso, girándolas desde una posición cerrada hasta presentar las palmas. Después dirige la seña hacia la otra persona y marca la pregunta levantando las cejas.'],
    ['Con permiso', 'con_permiso', 'Realiza la seña frente al torso y acompáñala con una inclinación breve del cuerpo, como se muestra en el video. Mantén contacto visual y una expresión respetuosa.'],
    ['Cuídate mucho', 'cuidate_mucho', 'Dirige la expresión hacia la otra persona y enlaza las señas CUIDAR y MUCHO siguiendo el orden y movimiento del video. Finaliza con una expresión cordial.'],
  ]),
  crearContenido(3, 'Presentaciones y despedidas', 'Preséntate y cierra conversaciones de forma cordial.', 'presentaciones', [
    ['Mucho gusto en conocerte', 'mucho_gusto_conocerte', 'Realiza MUCHO y GUSTO frente al torso, dirige después la expresión hacia la otra persona y completa CONOCER como se observa en el video. Sonríe y mantén contacto visual.'],
    ['¿Cuál es tu nombre?', 'cual_es_tu_nombre', 'Marca la pregunta con las cejas levantadas, dirige la seña hacia la otra persona y realiza NOMBRE con ambas manos siguiendo los contactos mostrados en el video.'],
    ['Hasta luego', 'hasta_luego', 'Realiza HASTA y continúa con LUEGO en un movimiento fluido dirigido hacia la otra persona. Acompaña la despedida con una expresión amable.'],
    ['Hasta pronto', 'hasta_pronto', 'Realiza HASTA y enlaza la seña PRONTO con el movimiento mostrado en el video. Mantén la mirada hacia la persona a quien te despides.'],
    ['Nos vemos', 'nos_vemos', 'Señala de forma inclusiva a las personas involucradas y continúa con VER, orientando la seña entre ambos interlocutores como se muestra en el video.'],
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
