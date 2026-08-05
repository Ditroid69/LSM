import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { obtenerModuloComunicacion } from '../../data/comunicacionBasica';
import VideoExpresion from '../../components/VideoExpresion';
import styles from '../abecedario/styles/Nivel1Carrusel.module.css';

const Nivel1Comunicacion = () => {
  const { idModulo } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const modulo = obtenerModuloComunicacion(idModulo);
  const [indice, setIndice] = useState(0);
  if (!modulo) return null;

  const item = modulo.expresiones[indice];
  const esUltimo = indice === modulo.expresiones.length - 1;
  const siguiente = async () => {
    if (!esUltimo) return setIndice((actual) => actual + 1);
    await Preferences.set({ key: `progreso_comunicacion_modulo_${idModulo}_nivel1`, value: 'completado' });
    navigate(`/comunicacion/modulo/${idModulo}`, { replace: true });
  };
  const cssVars = {
    '--lesson-card': theme.tarjeta, '--lesson-text': theme.tarjetaTexto || theme.texto,
    '--lesson-muted': theme.texto2, '--lesson-border': theme.borde, '--lesson-primary': theme.boton2,
    '--lesson-primary-shadow': '#24a997', '--lesson-accent': theme.boton1, '--lesson-accent-shadow': '#d5ad00',
    '--lesson-success': theme.correcto, '--lesson-success-shadow': '#087f5b', '--lesson-soft': theme.gris,
  };
  const progreso = ((indice + 1) / modulo.expresiones.length) * 100;

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.lessonHeader}><div><span className={styles.eyebrow}>Comunicación básica · Módulo {idModulo}</span><h1>Aprende la expresión</h1></div><div className={styles.counter}><strong>{indice + 1}</strong><span>/ {modulo.expresiones.length}</span></div></header>
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin="0" aria-valuemax="100"><span className={styles.progressFill} style={{ width: `${progreso}%` }} /></div>
      <article className={styles.signCard} key={item.texto}>
        <div className={styles.imageColumn}><span className={styles.imageLabel}>Observa la demostración</span><div className={styles.imageFrame}><span className={styles.imageGlow} aria-hidden="true" /><VideoExpresion src={item.video} texto={item.texto} /></div></div>
        <div className={styles.contentColumn}><span className={styles.signTag}>Expresión</span><div className={styles.letter} style={{ fontSize: item.texto.length > 12 ? 'clamp(1.5rem, 5vw, 2.4rem)' : 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1.05 }}>{item.texto}</div><h2>¿Cómo aprenderla?</h2><p>{item.descripcion}</p><div className={styles.tip}><svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4" /><path d="M8.2 14.5A7 7 0 1 1 15.8 14.5 4 4 0 0 0 15 16H9a4 4 0 0 0-.8-1.5z" /></svg><span>Estas señas pueden incluir movimiento, postura y expresión facial.</span></div></div>
      </article>
      <div className={styles.dots} aria-hidden="true">{modulo.expresiones.map((expresion, posicion) => <span key={expresion.texto} className={`${styles.dot} ${posicion === indice ? styles.dotCurrent : posicion < indice ? styles.dotVisited : ''}`} />)}</div>
      <div className={styles.controls}><button type="button" onClick={() => setIndice((actual) => actual - 1)} disabled={indice === 0} className={styles.previousButton}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg><span>Anterior</span></button><button type="button" onClick={siguiente} className={`${styles.nextButton} ${esUltimo ? styles.finishButton : ''}`}><span>{esUltimo ? 'Finalizar nivel' : 'Siguiente'}</span><svg viewBox="0 0 24 24"><path d={esUltimo ? 'm5 12 4.5 4.5L19 7' : 'M5 12h14M13 6l6 6-6 6'} /></svg></button></div>
    </section>
  );
};

export default Nivel1Comunicacion;
