export const letrasAbecedario = [
  'A', 'B', 'E', 'S', 'O',
  'C', 'D', 'F', 'U',
  'I', 'P', 'V', 'W',
  'L', 'M', 'N', 'R',
  'G', 'H', 'T', 'Y',
];

export const imagenDeLetra = (letra) => {
  const nombreImagen = letra.toLowerCase();
  return `/assets/abecedario/imagen_${nombreImagen}.png`;
};

export const mezclar = (elementos) => {
  const copia = [...elementos];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const indice = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[indice]] = [copia[indice], copia[i]];
  }
  return copia;
};
