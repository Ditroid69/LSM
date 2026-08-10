import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from "../../components/HandTracker";
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/Leccion.module.css';

// Definimos los bloques del abecedario (igual que en AbecedarioMenu)
const bloquesAbecedario = {
  1: ['A', 'E', 'S', 'T', 'O'],
  2: ['B', 'C', 'D', 'F', 'U'],
  3: ['I', 'P', 'V', 'W'],
  4: ['L', 'M', 'N', 'R'],
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

  const [pendientes, setPendientes] = useState(() => mezclar(letras));
  const [completadas, setCompletadas] = useState([]);
  const [aciertoLocal, setAciertoLocal] = useState(false);

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

  const letraActual = pendientes[0];
  const secuenciaVisible = [...completadas, ...pendientes];
  const progreso = ((completadas.length + (aciertoLocal ? 1 : 0)) / letras.length) * 100;
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
    '--camera-error': '#ef5b72',
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
    if (pendientes.length > 1) {
      setCompletadas((actuales) => [...actuales, letraActual]);
      setPendientes((actuales) => actuales.slice(1));
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

  const saltarLetra = () => {
    if (aciertoLocal || pendientes.length <= 1) return;
    setPendientes((actuales) => [...actuales.slice(1), actuales[0]]);
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
        <div className={styles.counter} aria-label={`${completadas.length + 1} de ${letras.length} letras completadas`}>
          <strong>{completadas.length + 1}</strong>
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
        {secuenciaVisible.map((letra, posicion) => (
          <span
            key={letra}
            className={`${styles.letterStep} ${
              posicion < completadas.length || (posicion === completadas.length && aciertoLocal)
                ? styles.letterStepComplete
                : posicion === completadas.length
                  ? styles.letterStepCurrent
                  : ''
            }`}
          >
            {posicion < completadas.length || (posicion === completadas.length && aciertoLocal) ? '✓' : letra}
          </span>
        ))}
      </div>

      <div className={styles.cameraActions}>
        <button type="button" onClick={saltarLetra} disabled={aciertoLocal || pendientes.length <= 1} className={styles.skipButton}>Saltar por ahora</button>
        <button type="button" onClick={siguienteLetra} disabled={!aciertoLocal} className={styles.nextButton}>
          <span>{aciertoLocal ? 'Siguiente letra' : 'Completa la seña para continuar'}</span>
        </button>
      </div>
    </section>
  );
};

const mezclar = (elementos) => {
  const copia = [...elementos];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

export default Leccion;
