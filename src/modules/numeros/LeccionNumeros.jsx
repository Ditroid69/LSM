import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  const [indiceLetra, setIndiceLetra] = useState(0);
  const [aciertoLocal, setAciertoLocal] = useState(false);

  useEffect(() => {
    setIndiceLetra(0);
    setAciertoLocal(false);
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
  const progresoVisual = ((indiceLetra + (aciertoLocal ? 1 : 0)) / letras.length) * 100;
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
    if (indiceLetra < letras.length - 1) {
      setIndiceLetra(indiceLetra + 1);
      setAciertoLocal(false);
    } else {
      await Preferences.set({
        key: `progreso_numeros_bloque_${bloque}_nivel3`,
        value: 'completado'
      });
      navigate(`/numeros/bloque/${bloque}`, { replace: true });
    }
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.lessonHeader}>
        <div>
          <span className={styles.eyebrow}>Números · Módulo {bloque}</span>
          <h1>Practica con la cámara</h1>
        </div>
        <div className={styles.counter} aria-label={`Número ${indiceLetra + 1} de ${letras.length}`}>
          <strong>{indiceLetra + 1}</strong><span>/ {letras.length}</span>
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
        {letras.map((numero, posicion) => (
          <span
            key={numero}
            className={`${styles.letterStep} ${
              posicion < indiceLetra || (posicion === indiceLetra && aciertoLocal)
                ? styles.letterStepComplete
                : posicion === indiceLetra
                  ? styles.letterStepCurrent
                  : ''
            }`}
          >
            {posicion < indiceLetra || (posicion === indiceLetra && aciertoLocal) ? '✓' : numero}
          </span>
        ))}
      </div>

      <button type="button" onClick={siguienteLetra} disabled={!aciertoLocal} className={styles.nextButton}>
        <span>{aciertoLocal ? 'Siguiente número' : 'Completa la seña para continuar'}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </section>
  );
};

export default LeccionNumeros;
