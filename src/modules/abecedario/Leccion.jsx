import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from "../../components/HandTracker";
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/Leccion.module.css';

// Definimos los bloques del abecedario (igual que en AbecedarioMenu)
const bloquesAbecedario = {
  1: ['A', 'E', 'S', 'T', 'O'],
  2: ['B', 'C', 'D', 'F', 'U'],
  3: ['I', 'P', 'V', 'W'],
  4: ['L', 'M', 'Ñ', 'R'],
  5: ['G', 'H', 'X', 'Y']
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
  const { theme } = useTheme();

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

  useEffect(() => {
    setIndiceLetra(0);
    setAciertoLocal(false);
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
  const progreso = ((indiceLetra + (aciertoLocal ? 1 : 0)) / letras.length) * 100;
  const cssVars = {
    '--camera-card': theme.tarjeta,
    '--camera-text': theme.tarjetaTexto || theme.texto,
    '--camera-muted': theme.texto2,
    '--camera-border': theme.borde,
    '--camera-primary': theme.boton2,
    '--camera-primary-shadow': '#24a997',
    '--camera-accent': theme.boton1,
    '--camera-accent-shadow': '#d5ad00',
    '--camera-success': theme.correcto,
    '--camera-success-shadow': '#087f5b',
    '--camera-error': theme.incorrecto,
    '--camera-soft': theme.gris,
  };

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

  const siguienteLetra = async () => {
    if (indiceLetra < letras.length - 1) {
      setIndiceLetra(indiceLetra + 1);
      setAciertoLocal(false);
    } else {
      if (esAbecedario) {
        await Preferences.set({
          key: `progreso_bloque_${bloque}_nivel3`,
          value: 'completado'
        });
      }
      navigate(esAbecedario ? `/bloque/${bloque}` : '/menu', { replace: true });
    }
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.lessonHeader}>
        <div>
          <span className={styles.eyebrow}>
            {esAbecedario ? `Abecedario · Bloque ${bloque}` : leccion.titulo}
          </span>
          <h1>Practica con la cámara</h1>
        </div>
        <div className={styles.counter} aria-label={`Letra ${indiceLetra + 1} de ${letras.length}`}>
          <strong>{indiceLetra + 1}</strong>
          <span>/ {letras.length}</span>
        </div>
      </header>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Progreso de la práctica"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progreso)}
      >
        <span style={{ width: `${progreso}%` }} />
      </div>

      <div className={styles.cameraCard}>
        <div className={styles.instructions}>
          <span className={styles.targetLabel}>Seña objetivo</span>
          <span className={styles.targetLetter}>{letraActual}</span>
          <div>
            <h2>Coloca tu mano frente a la cámara</h2>
            <p>{leccion.descripcion}</p>
          </div>
        </div>

        <div className={styles.trackerArea}>
          <HandTracker letraObjetivo={letraActual} onAcierto={manejarAcierto} />
        </div>
      </div>

      <div className={styles.letterSteps} aria-label="Progreso por letras">
        {letras.map((letra, posicion) => (
          <span
            key={letra}
            className={`${styles.letterStep} ${
              posicion < indiceLetra || (posicion === indiceLetra && aciertoLocal)
                ? styles.letterStepComplete
                : posicion === indiceLetra
                  ? styles.letterStepCurrent
                  : ''
            }`}
          >
            {posicion < indiceLetra || (posicion === indiceLetra && aciertoLocal) ? '✓' : letra}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={siguienteLetra}
        disabled={!aciertoLocal}
        className={styles.nextButton}
      >
        <span>{aciertoLocal ? 'Siguiente letra' : 'Completa la seña para continuar'}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </section>
  );
};

export default Leccion;
