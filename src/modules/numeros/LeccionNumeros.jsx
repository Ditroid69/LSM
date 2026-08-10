import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import HandTracker from '../../components/HandTracker';
import { useTheme } from '../../context/ThemeContext';
import styles from '../abecedario/styles/Leccion.module.css';

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
  const { theme } = useTheme();

  let letras = [];
  if (id === 'numeros' && bloque && bloquesNumeros[bloque]) {
    letras = bloquesNumeros[bloque];
  }

  const [pendientes, setPendientes] = useState(() => mezclar(letras));
  const [completadas, setCompletadas] = useState([]);
  const [aciertoLocal, setAciertoLocal] = useState(false);

  if (!letras.length) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p>Contenido no disponible aún.</p>
        <button onClick={() => navigate('/menu')}>Volver al menú</button>
      </div>
    );
  }

  const letraActual = pendientes[0];
  const secuenciaVisible = [...completadas, ...pendientes];
  const progresoVisual = ((completadas.length + (aciertoLocal ? 1 : 0)) / letras.length) * 100;
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
      const key = `progreso_numeros_bloque_${bloque}`;
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
      await Preferences.set({
        key: `progreso_numeros_bloque_${bloque}_nivel3`,
        value: 'completado'
      });
      navigate(`/numeros/bloque/${bloque}`, { replace: true });
    }
  };

  const saltarNumero = () => {
    if (aciertoLocal || pendientes.length <= 1) return;
    setPendientes((actuales) => [...actuales.slice(1), actuales[0]]);
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.lessonHeader}>
        <div>
          <span className={styles.eyebrow}>Números · Módulo {bloque}</span>
          <h1>Practica con la cámara</h1>
        </div>
        <div className={styles.counter} aria-label={`${completadas.length + 1} de ${letras.length} números completados`}>
          <strong>{completadas.length + 1}</strong><span>/ {letras.length}</span>
        </div>
      </header>

      <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(progresoVisual)} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: `${progresoVisual}%` }} />
      </div>

      <div className={styles.cameraCard}>
        <div className={styles.instructions}>
          <span className={styles.targetLabel}>Número objetivo</span>
          <span className={styles.targetLetter}>{letraActual}</span>
          <div><h2>Coloca tu mano frente a la cámara</h2><p>Haz la seña del número y mantenla por un momento.</p></div>
        </div>
        <div className={styles.trackerArea}>
          <HandTracker letraObjetivo={letraActual} onAcierto={manejarAcierto} />
        </div>
      </div>

      <div className={styles.letterSteps} aria-label="Progreso por números">
        {secuenciaVisible.map((numero, posicion) => (
          <span
            key={numero}
            className={`${styles.letterStep} ${
              posicion < completadas.length || (posicion === completadas.length && aciertoLocal)
                ? styles.letterStepComplete
                : posicion === completadas.length
                  ? styles.letterStepCurrent
                  : ''
            }`}
          >
            {posicion < completadas.length || (posicion === completadas.length && aciertoLocal) ? '✓' : numero}
          </span>
        ))}
      </div>

      <div className={styles.cameraActions}>
        <button type="button" onClick={saltarNumero} disabled={aciertoLocal || pendientes.length <= 1} className={styles.skipButton}>Saltar por ahora</button>
        <button type="button" onClick={siguienteLetra} disabled={!aciertoLocal} className={styles.nextButton}>
          <span>{aciertoLocal ? 'Siguiente número' : 'Completa la seña para continuar'}</span>
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

export default LeccionNumeros;
