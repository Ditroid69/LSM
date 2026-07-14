import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from "../../components/HandTracker";

// Definimos los bloques del abecedario (igual que en AbecedarioMenu)
const bloquesAbecedario = {
  1: ['A', 'E', 'S', 'T', 'O'],
  2: ['B', 'C', 'D', 'F', 'U'],
  3: ['I', 'K', 'P', 'V', 'W'],
  4: ['L', 'M', 'Ñ', 'R'],
  5: ['G', 'H', 'X', 'Y', 'Z']
};

const contenidoLecciones = {
  abecedario: { titulo: 'Abecedario en LSM', descripcion: 'Haz la seña de cada letra frente a la cámara.' },
  dias: { titulo: 'Días de la semana', descripcion: 'Próximamente...' },
  meses: { titulo: 'Meses del año', descripcion: 'Próximamente...' },
  numeros: { titulo: 'Números', descripcion: 'Próximamente...' }
};

const Leccion = ({ id: idProp, bloque: bloqueProp } = {}) => {
  const params = useParams();
const id = idProp || params.id;
const bloque = bloqueProp || params.bloque;  // id: 'abecedario', bloque: '1', etc.
  const navigate = useNavigate();

  // Determinar las letras a enseñar
  let letras = [];
  let esAbecedario = false;
  if (id === 'abecedario' && bloque && bloquesAbecedario[bloque]) {
    esAbecedario = true;
    letras = bloquesAbecedario[bloque];
  } else if (contenidoLecciones[id]?.letras) {
    letras = contenidoLecciones[id].letras;
  }

  const leccion = contenidoLecciones[id] || { titulo: 'Lección', descripcion: '' };

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
        <h1>{leccion.titulo}</h1>
        <p>{leccion.descripcion}</p>
        <p>Contenido no disponible aún.</p>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  const letraActual = letras[indiceLetra];

  const manejarAcierto = async (letra) => {
    if (!aciertoLocal) {
      setAciertoLocal(true);
      const key = esAbecedario ? `progreso_abecedario_${bloque}` : `progreso_${id}`;
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
        <h1>{leccion.titulo}</h1>
        <h2>🎉 ¡Lección completada!</h2>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>{leccion.titulo}</h1>
      <p>{leccion.descripcion}</p>
      {esAbecedario && <p>Bloque {bloque}</p>}

      <h2>Letra: {letraActual}</h2>
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
          color: 'black',
          border: 'none',
          borderRadius: 8,
          cursor: aciertoLocal ? 'pointer' : 'not-allowed'
        }}
      >
        Siguiente letra ➡️
      </button>
    </div>
  );
};

export default Leccion;