import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { mezclarComunicacion, obtenerModuloComunicacion } from '../../data/comunicacionBasica';
import VideoExpresion from '../../components/VideoExpresion';
import styles from '../abecedario/styles/Nivel2Ejercicios.module.css';

const prepararPregunta = (expresiones, indice) =>
  mezclarComunicacion(expresiones.filter((_, posicion) => posicion !== indice))
    .slice(0, 3).concat(expresiones[indice]).sort(() => Math.random() - 0.5);

const Nivel2Comunicacion = () => {
  const { idModulo } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const modulo = obtenerModuloComunicacion(idModulo);
  const expresiones = useMemo(() => modulo?.expresiones || [], [modulo]);
  const [superadas, setSuperadas] = useState(() => new Array(expresiones.length).fill(false));
  const [indice, setIndice] = useState(() => Math.floor(Math.random() * expresiones.length));
  const [opciones, setOpciones] = useState(() => prepararPregunta(expresiones, indice));
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const continuar = useCallback(async () => {
    const pendientes = superadas.reduce((lista, valor, posicion) => { if (!valor) lista.push(posicion); return lista; }, []);
    if (pendientes.length === 0) {
      await Preferences.set({ key: `progreso_comunicacion_modulo_${idModulo}_nivel2`, value: 'completado' });
      navigate(`/comunicacion/modulo/${idModulo}`, { replace: true });
      return;
    }
    const siguiente = pendientes[Math.floor(Math.random() * pendientes.length)];
    setIndice(siguiente); setOpciones(prepararPregunta(expresiones, siguiente)); setSeleccionada(null); setMostrarResultado(false);
  }, [expresiones, idModulo, navigate, superadas]);

  if (!modulo || !expresiones.length) return null;
  const correcta = expresiones[indice];
  const acertadas = superadas.filter(Boolean).length;
  const seleccionar = (opcion) => {
    if (mostrarResultado) return;
    setSeleccionada(opcion.texto); setMostrarResultado(true);
    if (opcion.texto === correcta.texto) setSuperadas((actual) => actual.map((valor, posicion) => posicion === indice ? true : valor));
  };
  const cssVars = {
    '--quiz-card': theme.tarjeta, '--quiz-text': theme.tarjetaTexto || theme.texto,
    '--quiz-muted': theme.texto2, '--quiz-border': theme.borde, '--quiz-primary': theme.boton2,
    '--quiz-primary-shadow': '#24a997', '--quiz-accent': theme.boton1, '--quiz-accent-shadow': '#d5ad00',
    '--quiz-success': theme.correcto, '--quiz-success-shadow': '#087f5b', '--quiz-error': theme.incorrecto, '--quiz-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.quizHeader}><div><span className={styles.eyebrow}>Comunicación básica · Módulo {idModulo}</span><h1>Reconoce la expresión</h1></div><div className={styles.score}><strong>{acertadas}</strong><span>/ {expresiones.length}</span></div></header>
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round((acertadas / expresiones.length) * 100)} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${(acertadas / expresiones.length) * 100}%` }} /></div>
      <div className={styles.challenge}><div className={styles.prompt}><span className={styles.promptNumber}>Pregunta</span><h2>¿Qué expresión representa esta seña?</h2><p>Observa la demostración y elige su significado.</p></div><div className={styles.signFrame}><span className={styles.signGlow} aria-hidden="true" /><VideoExpresion src={correcta.video} texto={correcta.texto} ocultarTexto /><span className={styles.signHint}>Seña objetivo</span></div>
        <div className={styles.answers} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{opciones.map((opcion) => { const esCorrecta = opcion.texto === correcta.texto; const clase = mostrarResultado ? esCorrecta ? styles.answerCorrect : seleccionada === opcion.texto ? styles.answerWrong : styles.answerDimmed : ''; return <button key={opcion.texto} type="button" onClick={() => seleccionar(opcion)} disabled={mostrarResultado} className={`${styles.answerButton} ${clase}`}><span style={{ fontSize: 'clamp(.75rem, 2.8vw, 1rem)' }}>{opcion.texto}</span></button>; })}</div>
      </div>
      {mostrarResultado && <div className={`${styles.feedback} ${seleccionada === correcta.texto ? styles.feedbackCorrect : styles.feedbackWrong}`} role="status"><span className={styles.feedbackIcon}><svg viewBox="0 0 24 24"><path d={seleccionada === correcta.texto ? 'm5 12 4.5 4.5L19 7' : 'M6 6l12 12M18 6 6 18'} /></svg></span><div><strong>{seleccionada === correcta.texto ? 'Respuesta correcta' : 'Sigue practicando'}</strong><p>La expresión es “{correcta.texto}”.</p></div><button type="button" onClick={continuar}>Continuar<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button></div>}
    </section>
  );
};

export default Nivel2Comunicacion;
