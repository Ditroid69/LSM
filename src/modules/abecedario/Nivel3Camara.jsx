import { useParams } from 'react-router-dom';
import Leccion from './Leccion';

const LeccionModoBloque = () => {
  const { idBloque } = useParams();
  // Le pasamos id='abecedario' y el bloque como string
  return <Leccion id="abecedario" bloque={idBloque} />;
};

export default LeccionModoBloque;