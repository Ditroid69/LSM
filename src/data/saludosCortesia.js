const crearContenido = (id, nombre, descripcion, expresiones) => ({
  id,
  nombre,
  descripcion,
  expresiones: expresiones.map(([texto, archivo, detalle]) => ({
    texto,
    imagen: `/assets/saludos/${archivo}.png`,
    descripcion: detalle,
  })),
});

export const modulosSaludos = [
  crearContenido(1, 'Saludos formales e informales', 'Inicia y cierra conversaciones cotidianas.', [
    ['Hola', 'hola', 'Observa la expresión facial, la orientación de la mano y el movimiento completo.'],
    ['Adiós', 'adios', 'Observa cómo se realiza el movimiento antes de practicarlo.'],
    ['Buenos días', 'buenos_dias', 'Aprende la expresión completa sin separar su intención comunicativa.'],
    ['Buenas tardes', 'buenas_tardes', 'Observa la secuencia y el ritmo natural de la expresión.'],
    ['Buenas noches', 'buenas_noches', 'Observa la secuencia completa y la expresión facial que la acompaña.'],
  ]),
  crearContenido(2, 'Cortesía básica', 'Usa expresiones respetuosas en situaciones comunes.', [
    ['Por favor', 'por_favor', 'Observa el movimiento, la postura corporal y el contexto de cortesía.'],
    ['Gracias', 'gracias', 'Observa el recorrido de la mano y la expresión facial.'],
    ['De nada', 'de_nada', 'Aprende la respuesta completa dentro de una conversación.'],
    ['Perdón', 'perdon', 'Observa el movimiento y la expresión facial que comunica disculpa.'],
    ['¿Cómo estás?', 'como_estas', 'Observa la secuencia completa y su componente interrogativo.'],
  ]),
  crearContenido(3, 'Presentaciones', 'Preséntate y conoce a otras personas.', [
    ['Mucho gusto', 'mucho_gusto', 'Observa la expresión completa y el contacto visual.'],
    ['Mi nombre es…', 'mi_nombre_es', 'Observa la secuencia y completa la frase con tu nombre.'],
    ['¿Cómo te llamas?', 'como_te_llamas', 'Observa la secuencia y la expresión facial interrogativa.'],
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
