import { useParams } from 'react-router-dom';
import LeccionNumeros from './LeccionNumeros'; // lo crearemos después

const Nivel3Numeros = () => {
  const { idBloque } = useParams();
  return <LeccionNumeros id="numeros" bloque={idBloque} />;
};

export default Nivel3Numeros;