export const letrasConMovimiento = [
  {
    letra: 'K',
    recurso: '/assets/abecedario/video_k.mp4',
    descripcion: 'Coloca la mano a la altura del pecho con el índice y el medio extendidos y separados. Apoya el pulgar entre ambos dedos, cerca de la base del dedo medio, y mantén el anular y el meñique doblados. Conserva esta configuración mientras realizas un movimiento corto de arriba hacia abajo.',
  },
  {
    letra: 'Ñ',
    recurso: '/assets/abecedario/video_ñ.mp4',
    descripcion: 'Forma la letra N: dobla el índice y el medio sobre el pulgar y mantén el anular y el meñique cerrados. Con la palma orientada hacia ti, mueve la mano suavemente de un lado a otro, como si dibujaras la tilde de la Ñ.',
  },
  {
    letra: 'Z',
    recurso: '/assets/abecedario/video_z.mp4',
    descripcion: 'Extiende el dedo índice y mantén los demás dedos cerrados con el pulgar sobre ellos. Con la palma orientada de lado o ligeramente hacia el frente, dibuja en el aire una trayectoria en zigzag con la forma de la letra Z.',
  },
  {
    letra: 'Q',
    recurso: '/assets/abecedario/video_q.mp4',
    descripcion: 'Extiende el índice y el pulgar y mantén los demás dedos doblados. Orienta las puntas hacia abajo y conserva la configuración mientras haces un movimiento corto hacia ti, tal como se muestra en el video.',
  },
];

export const obtenerLetraConMovimiento = (letra) =>
  letrasConMovimiento.find((item) => item.letra === letra);
