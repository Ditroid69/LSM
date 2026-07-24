import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from '../../components/HandTracker';

// Bloques de números (solo el bloque 1 por ahora)
const bloquesNumeros = {
  1: ['1', '2', '3', '4', '5', '6', '7', '8'],
  // Los demás bloques (9-15, 16-20) no usarán cámara
};

const LeccionNumeros = ({ id: idProp, bloque: bloqueProp } = {}) => {
  const params = useParams();
  const id = idProp || params.id;
  const bloque = bloqueProp || params.bloque;
  const navigate = useNavigate();

  let letras = [];
  if (id === 'numeros' && bloque && bloquesNumeros[bloque]) {
    letras = bloquesNumeros[bloque];
  }

  const [indiceLetra, setIndiceLetra] = useState(0);
  const [aciertoLocal, setAciertoLocal] = useState(false);
  const [completado, setCompletado] = useState(false);

  useEffect(() => {
    setIndiceLetra(0);
    setAciertoLocal(false);
    setCompletado(false);
  }, [id, bloque]);

  if (!letras.length) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p>Contenido no disponible aún.</p>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  const letraActual = letras[indiceLetra];

  const manejarAcierto = async (letra) => {
    if (!aciertoLocal) {
      setAciertoLocal(true);
      const key = `progreso_numeros_bloque_${bloque}`;
      const { value } = await Preferences.get({ key });
      const progreso = value ? JSON.parse(value) : [];
      if (!progreso.includes(letra)) {
        progreso.push(letra);
        await Preferences.set({ key, value: JSON.stringify(progreso) });
      }
    }
  };

  const siguienteLetra = () => {
    if (indiceLetra < letras.length - 1) {
      setIndiceLetra(indiceLetra + 1);
      setAciertoLocal(false);
    } else {
      setCompletado(true);
    }
  };

  if (completado) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <h2>🎉 ¡Lección completada!</h2>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Números – Bloque {bloque}</h2>
      <p>Haz la seña del número frente a la cámara</p>

      <h2>Número: {letraActual}</h2>
      {aciertoLocal && (
        <p style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>✅ ¡Correcto!</p>
      )}

      <HandTracker letraObjetivo={letraActual} onAcierto={manejarAcierto} />

      <button
        onClick={siguienteLetra}
        disabled={!aciertoLocal}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: aciertoLocal ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: aciertoLocal ? 'pointer' : 'not-allowed'
        }}
      >
        Siguiente número ➡️
      </button>
    </div>
  );
};

export default LeccionNumeros;