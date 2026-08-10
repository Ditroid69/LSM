import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from '../abecedario/styles/Nivel2Ejercicios.module.css';
import { obtenerModuloNumeros } from '../../data/numeros';
import VideoNumero from './VideoNumero';

function shuffleArray(array) {
  const resultado = [...array];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

function crearPreguntaInicial(numeros) {
  if (numeros.length === 0) return { indice: null, opciones: [] };

  const indice = Math.floor(Math.random() * numeros.length);
  const numeroCorrecto = numeros[indice];
  const opcionesIncorrectas = shuffleArray(
    numeros.filter((_, posicion) => posicion !== indice)
  ).slice(0, 3);

  return {
    indice,
    opciones: shuffleArray([...opcionesIncorrectas, numeroCorrecto])
  };
}

const Nivel2NumerosContenido = ({ idBloque }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const modulo = obtenerModuloNumeros(idBloque);
  const numeros = useMemo(() => modulo?.numeros.map(({ numero }) => numero) || [], [modulo]);
  const totalPreguntas = numeros.length;
  const [preguntaInicial] = useState(() => crearPreguntaInicial(numeros));

  const [correctFlags, setCorrectFlags] = useState(new Array(totalPreguntas).fill(false));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(preguntaInicial.indice);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState(preguntaInicial.opciones);

  const pickNextQuestion = useCallback(async () => {
    const pendientes = correctFlags.reduce((indices, completado, posicion) => {
      if (!completado) indices.push(posicion);
      return indices;
    }, []);

    if (pendientes.length === 0) {
      await Preferences.set({
        key: `progreso_numeros_bloque_${idBloque}_nivel2`,
        value: 'completado'
      });
      navigate(`/numeros/bloque/${idBloque}`, { replace: true });
      return;
    }

    const indice = pendientes[Math.floor(Math.random() * pendientes.length)];
    const numeroCorrecto = numeros[indice];
    const incorrectas = shuffleArray(numeros.filter((numero) => numero !== numeroCorrecto)).slice(0, 3);

    setCurrentQuestionIdx(indice);
    setSelectedAnswer(null);
    setShowResult(false);
    setShuffledOptions(shuffleArray([...incorrectas, numeroCorrecto]));
  }, [correctFlags, idBloque, navigate, numeros]);

  const handleSelectAnswer = (numero) => {
    if (showResult) return;
    setSelectedAnswer(numero);
    setShowResult(true);

    if (numero === numeros[currentQuestionIdx]) {
      setCorrectFlags((actuales) => {
        const actualizados = [...actuales];
        actualizados[currentQuestionIdx] = true;
        return actualizados;
      });
    }
  };

  const superadas = correctFlags.filter(Boolean).length;
  const progreso = totalPreguntas > 0 ? (superadas / totalPreguntas) * 100 : 0;
  const cssVars = {
    '--quiz-card': theme.tarjeta,
    '--quiz-text': theme.tarjetaTexto || theme.texto,
    '--quiz-muted': theme.texto2,
    '--quiz-border': theme.borde,
    '--quiz-primary': theme.boton2,
    '--quiz-primary-shadow': '#24a997',
    '--quiz-accent': theme.boton1,
    '--quiz-accent-shadow': '#d5ad00',
    '--quiz-success': theme.correcto,
    '--quiz-success-shadow': '#087f5b',
    '--quiz-error': theme.incorrecto,
    '--quiz-soft': theme.gris,
  };

  if (totalPreguntas === 0) {
    return (
      <div className={styles.emptyState} style={cssVars}>
        <p>No hay ejercicios para este módulo todavía.</p>
        <button type="button" onClick={() => navigate('/numeros')}>Volver</button>
      </div>
    );
  }

  const numeroCorrecto = numeros[currentQuestionIdx];
  const usaVideo = modulo.numeros[currentQuestionIdx].tipo === 'video';
  const recursoSrc = modulo.numeros[currentQuestionIdx].recurso;

  return (
    <section className={`${styles.page} ${usaVideo ? styles.videoQuizPage : ''}`} style={cssVars}>
      <header className={styles.quizHeader}>
        <div>
          <span className={styles.eyebrow}>Números · Módulo {idBloque}</span>
          <h1>Reconoce la seña</h1>
        </div>
        <div className={styles.score} aria-label={`${superadas} de ${totalPreguntas} superados`}>
          <strong>{superadas}</strong><span>/ {totalPreguntas}</span>
        </div>
      </header>

      <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: `${progreso}%` }} />
      </div>

      <div className={`${styles.challenge} ${usaVideo ? styles.videoChallenge : ''}`}>
        <div className={styles.prompt}>
          <span className={styles.promptNumber}>Pregunta</span>
          <h2>¿Qué número representa esta seña?</h2>
          <p>Observa {usaVideo ? 'el video completo' : 'la posición de la mano'} y elige una respuesta.</p>
        </div>

        <div className={`${styles.signFrame} ${usaVideo ? styles.videoFrame : ''}`}>
          <span className={styles.signGlow} aria-hidden="true" />
          {usaVideo ? (
            <VideoNumero key={recursoSrc} src={recursoSrc} numero={numeroCorrecto} ocultarNumero />
          ) : (
            <img
              src={recursoSrc}
              alt={`Seña del número ${numeroCorrecto}`}
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          )}
          <span className={styles.signHint}>Seña objetivo</span>
        </div>

        <div className={styles.answers} aria-label="Opciones de respuesta">
          {shuffledOptions.map((numero) => {
            const esCorrecta = numero === numeroCorrecto;
            const esSeleccionada = selectedAnswer === numero;
            const claseResultado = showResult
              ? esCorrecta
                ? styles.answerCorrect
                : esSeleccionada
                  ? styles.answerWrong
                  : styles.answerDimmed
              : '';

            return (
              <button
                key={numero}
                type="button"
                onClick={() => handleSelectAnswer(numero)}
                className={`${styles.answerButton} ${claseResultado}`}
                disabled={showResult}
                aria-label={`Número ${numero}`}
              >
                <span>{numero}</span>
                {showResult && esCorrecta && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
                )}
                {showResult && esSeleccionada && !esCorrecta && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`${styles.feedback} ${
          selectedAnswer === numeroCorrecto ? styles.feedbackCorrect : styles.feedbackWrong
        }`} role="status">
          <span className={styles.feedbackIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              {selectedAnswer === numeroCorrecto
                ? <path d="m5 12 4.5 4.5L19 7" />
                : <path d="M6 6l12 12M18 6 6 18" />}
            </svg>
          </span>
          <div>
            <strong>{selectedAnswer === numeroCorrecto ? '¡Respuesta correcta!' : 'Sigue practicando'}</strong>
            <p>
              {selectedAnswer === numeroCorrecto
                ? `Reconociste la seña del número ${numeroCorrecto}.`
                : `La respuesta correcta era el número ${numeroCorrecto}.`}
            </p>
          </div>
          <button type="button" onClick={pickNextQuestion}>
            Continuar
          </button>
        </div>
      )}
    </section>
  );
};

const Nivel2NumerosEjercicios = () => {
  const { idBloque } = useParams();
  return <Nivel2NumerosContenido key={idBloque} idBloque={idBloque} />;
};

export default Nivel2NumerosEjercicios;
