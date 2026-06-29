import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from '../components/HandTracker';

const contenidoLecciones = {
  abecedario: {
    titulo: 'Abecedario en LSM',
    descripcion: 'Haz la seña de cada letra frente a la cámara.',
    letras: ['A', 'B', 'C'] // Luego pondremos todas
  },
  dias: {
    titulo: 'Días de la semana',
    descripcion: 'Próximamente...'
  },
  meses: {
    titulo: 'Meses del año',
    descripcion: 'Próximamente...'
  },
  numeros: {
    titulo: 'Números',
    descripcion: 'Próximamente...'
  }
};

const Leccion = () => {
  const { id } = useParams();           // 'abecedario', 'dias', etc.
  const navigate = useNavigate();
  const leccion = contenidoLecciones[id];

  const [indiceLetra, setIndiceLetra] = useState(0);
  const [aciertoLocal, setAciertoLocal] = useState(false);
  const [completado, setCompletado] = useState(false);

  // Reiniciar al cambiar de lección
  useEffect(() => {
    setIndiceLetra(0);
    setAciertoLocal(false);
    setCompletado(false);
  }, [id]);

  if (!leccion) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p>Lección no encontrada</p>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  const letras = leccion.letras || [];
  const letraActual = letras.length > 0 ? letras[indiceLetra] : null;

  // Cuando el HandTracker avisa de un acierto
  const manejarAcierto = async (letra) => {
    if (!aciertoLocal) {
      setAciertoLocal(true);
      // Guardar progreso
      const { value } = await Preferences.get({ key: `progreso_${id}` });
      const progreso = value ? JSON.parse(value) : [];
      if (!progreso.includes(letra)) {
        progreso.push(letra);
        await Preferences.set({ key: `progreso_${id}`, value: JSON.stringify(progreso) });
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

  // Si la lección no tiene letras todavía (dias, meses...)
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

  // Lección completada
  if (completado) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <h1>{leccion.titulo}</h1>
        <h2>🎉 ¡Lección completada!</h2>
        <button onClick={() => navigate('/menu')} style={{ padding: 10, fontSize: 16 }}>Volver al menú</button>
      </div>
    );
  }

  // Lección en curso
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>{leccion.titulo}</h1>
      <p>{leccion.descripcion}</p>

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
          color: 'white',
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