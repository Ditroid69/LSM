const descripcionesNumerosEnVideo = {
  9: 'Coloca la mano a la altura del pecho con la palma hacia ti. Empieza con la mano abierta, los cuatro dedos juntos y extendidos, y el pulgar doblado sobre la palma, como la letra B. Después cierra los dedos alrededor del pulgar hasta formar un puño.',
  10: 'Coloca la mano a la altura del pecho con la palma hacia arriba y todos los dedos extendidos y separados, como el número 5. Gira rápidamente la muñeca hasta dejar la palma hacia abajo.',
  11: 'Forma un puño con el pulgar extendido hacia arriba y la palma orientada hacia ti, como la letra A. Sin cambiar la posición de los dedos, gira la mano hacia arriba y hacia un lado.',
  12: 'Extiende el índice y el pulgar, mantén los demás dedos doblados e inclina la mano, como la letra G y el número 7. Conserva esa forma y mueve la mano hacia arriba y hacia un lado.',
  13: 'Extiende y separa el pulgar, el índice y el medio; mantén el anular y el meñique doblados, como el número 8. Sin cambiar la posición, gira la mano hacia arriba y hacia un lado.',
  14: 'Extiende juntos el índice, el medio, el anular y el meñique, y mantén el pulgar doblado. Conserva esa forma y mueve la mano hacia arriba y hacia un lado.',
  15: 'Abre la mano con todos los dedos extendidos y separados, como el número 5. Sin cambiar la posición, gira la mano hacia arriba y hacia un lado.',
  16: 'Forma un puño con el pulgar extendido, como la letra A y el número 6, y orienta la palma hacia abajo. Mantén la posición de los dedos y desplaza la mano hacia adelante.',
  17: 'Extiende el índice y el pulgar, mantén los demás dedos doblados e inclina la mano, como la letra G y el número 7. Orienta la palma hacia abajo y desplaza la mano hacia adelante.',
  18: 'Extiende y separa el pulgar, el índice y el medio; mantén el anular y el meñique doblados, como el número 8. Dirige las puntas de los dedos hacia el frente y desplaza la mano hacia adelante.',
  19: 'Extiende juntos el índice, el medio, el anular y el meñique, con las puntas dirigidas hacia el frente y el pulgar doblado. Mantén la posición y desplaza la mano hacia adelante.',
  20: 'Cierra la mano y une las puntas del índice y del pulgar. Mantén los demás dedos doblados y abre y cierra varias veces el contacto entre el índice y el pulgar.',
};

const crearNumeros = (inicio, fin, tipo = 'video') =>
  Array.from({ length: fin - inicio + 1 }, (_, indice) => {
    const numero = String(inicio + indice);
    return {
      numero,
      tipo,
      recurso: `/assets/numeros/${tipo === 'video' ? 'video' : 'imagen'}_${numero}.${tipo === 'video' ? 'mp4' : 'png'}`,
      descripcion: tipo === 'video' ? descripcionesNumerosEnVideo[numero] : '',
    };
  });

export const modulosNumeros = [
  { id: 1, nombre: 'Números estáticos', descripcion: 'Aprende las señas del 1 al 8', numeros: crearNumeros(1, 8, 'imagen'), niveles: 3 },
  { id: 2, nombre: 'Números del 9 al 14', descripcion: 'Observa el movimiento de cada seña', numeros: crearNumeros(9, 14), niveles: 2 },
  { id: 3, nombre: 'Números del 15 al 20', descripcion: 'Continúa aprendiendo con demostraciones en video', numeros: crearNumeros(15, 20), niveles: 2 },
];

export const obtenerModuloNumeros = (id) =>
  modulosNumeros.find((modulo) => String(modulo.id) === String(id));

export const mezclarNumeros = (elementos) => {
  const copia = [...elementos];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[aleatorio]] = [copia[aleatorio], copia[indice]];
  }
  return copia;
};
