const crearNumeros = (inicio, fin, tipo = 'video') =>
  Array.from({ length: fin - inicio + 1 }, (_, indice) => {
    const numero = String(inicio + indice);
    return {
      numero,
      tipo,
      recurso: `/assets/numeros/${tipo === 'video' ? 'video' : 'imagen'}_${numero}.${tipo === 'video' ? 'mp4' : 'png'}`,
      descripcion: tipo === 'video'
        ? `Coloca la mano a la altura del pecho y copia la configuración inicial del número ${numero}. Mantén la orientación de la palma que aparece en el video y reproduce la trayectoria completa, sin cortar el movimiento. Termina en la misma posición que muestra la demostración.`
        : '',
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
