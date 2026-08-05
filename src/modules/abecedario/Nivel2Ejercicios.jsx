import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/Nivel2Ejercicios.module.css';
import VideoNumero from '../numeros/VideoNumero';
import { letrasConMovimiento, obtenerLetraConMovimiento } from '../../data/abecedarioMovimiento';

// Bloques del abecedario (igual que en Leccion.jsx)
const bloquesAbecedario = {
  1: ['A', 'E', 'S', 'T', 'O'],
  2: ['B', 'C', 'D', 'F', 'U'],
  3: ['I', 'P', 'V', 'W'],
  4: ['L', 'M', 'Ñ', 'R'],
  5: ['G', 'H', 'X', 'Y'],
  6: letrasConMovimiento.map(({ letra }) => letra)
};
const bloqueVacio = [];

// Función para desordenar array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function crearPreguntaInicial(letras) {
  if (letras.length === 0) {
    return { indice: null, opciones: [] };
  }

  const indice = Math.floor(Math.random() * letras.length);
  const letraCorrecta = letras[indice];
  const opcionesIncorrectas = shuffleArray(
    letras.filter((_, posicion) => posicion !== indice)
  ).slice(0, 3);

  return {
    indice,
    opciones: shuffleArray([...opcionesIncorrectas, letraCorrecta])
  };
}

const Nivel2EjerciciosContenido = ({ idBloque }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Letras del bloque actual
  const letrasBloque = bloquesAbecedario[idBloque] || bloqueVacio;
  const totalPreguntas = letrasBloque.length;
  const [preguntaInicial] = useState(() => crearPreguntaInicial(letrasBloque));

  // Estado: seguimiento de aciertos por letra (true = acertada)
  const [correctFlags, setCorrectFlags] = useState(new Array(totalPreguntas).fill(false));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(preguntaInicial.indice);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // letra seleccionada
  const [showResult, setShowResult] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState(preguntaInicial.opciones); // letras (texto) desordenadas

  // Elegir siguiente pregunta entre las no superadas
  const pickNextQuestion = useCallback(async () => {
    const incorrectIndices = correctFlags.reduce((acc, flag, idx) => {
      if (!flag) acc.push(idx);
      return acc;
    }, []);

    if (incorrectIndices.length === 0) {
      await Preferences.set({ key: `progreso_bloque_${idBloque}_nivel2`, value: 'completado' });
      navigate(`/bloque/${idBloque}`, { replace: true });
      return;
    }

    const randomIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
    setCurrentQuestionIdx(randomIdx);
    setSelectedAnswer(null);
    setShowResult(false);

    const letraCorrecta = letrasBloque[randomIdx];
    // Generar opciones: 3 letras incorrectas + la correcta
    const otrasLetras = letrasBloque.filter((_, idx) => idx !== randomIdx);
    const opcionesIncorrectas = shuffleArray(otrasLetras).slice(0, 3); // máximo 3 incorrectas
    const todasOpciones = [...opcionesIncorrectas, letraCorrecta];
    setShuffledOptions(shuffleArray(todasOpciones));
  }, [correctFlags, idBloque, letrasBloque, navigate]);

  const handleSelectAnswer = (letraSeleccionada) => {
    if (showResult) return;
    setSelectedAnswer(letraSeleccionada);
    setShowResult(true);

    const letraCorrecta = letrasBloque[currentQuestionIdx];
    if (letraSeleccionada === letraCorrecta) {
      setCorrectFlags(prev => {
        const updated = [...prev];
        updated[currentQuestionIdx] = true;
        return updated;
      });
    }
  };

  const handleNext = () => {
    pickNextQuestion();
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
        <p>No hay ejercicios para este bloque todavía.</p>
        <button type="button" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (currentQuestionIdx === null) {
    return (
      <div className={styles.loading} style={cssVars}>
        <span />
        <p>Preparando ejercicios...</p>
      </div>
    );
  }

  const letraCorrecta = letrasBloque[currentQuestionIdx];
  const nombreImagen = letraCorrecta === 'Ñ' ? 'n' : letraCorrecta.toLowerCase();
  const imagenSrc = `/assets/abecedario/imagen_${nombreImagen}.png`;
  const letraEnMovimiento = idBloque === '6' ? obtenerLetraConMovimiento(letraCorrecta) : null;

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.quizHeader}>
        <div>
          <span className={styles.eyebrow}>Abecedario · Bloque {idBloque}</span>
          <h1>Reconoce la seña</h1>
        </div>
        <div className={styles.score} aria-label={`${superadas} de ${totalPreguntas} superadas`}>
          <strong>{superadas}</strong>
          <span>/ {totalPreguntas}</span>
        </div>
      </header>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Progreso del ejercicio"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progreso)}
      >
        <span style={{ width: `${progreso}%` }} />
      </div>

      <div className={styles.challenge}>
        <div className={styles.prompt}>
          <span className={styles.promptNumber}>Pregunta</span>
          <h2>¿Qué letra representa esta seña?</h2>
          <p>Observa {letraEnMovimiento ? 'el video completo' : 'la posición de la mano'} y elige una respuesta.</p>
        </div>

        <div className={`${styles.signFrame} ${letraEnMovimiento ? styles.videoFrame : ''}`}>
          <span className={styles.signGlow} aria-hidden="true" />
          {letraEnMovimiento ? (
            <VideoNumero key={letraEnMovimiento.recurso} src={letraEnMovimiento.recurso} valor={letraCorrecta} etiqueta="letra" ocultarNumero />
          ) : (
            <img
              src={imagenSrc}
              alt={`Seña de ${letraCorrecta}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className={styles.signHint}>Seña objetivo</span>
        </div>

        <div className={styles.answers} aria-label="Opciones de respuesta">
          {shuffledOptions.map((letra) => {
            const esCorrecta = letra === letraCorrecta;
            const esSeleccionada = selectedAnswer === letra;
            const claseResultado = showResult
              ? esCorrecta
                ? styles.answerCorrect
                : esSeleccionada
                  ? styles.answerWrong
                  : styles.answerDimmed
              : '';

            return (
              <button
                key={letra}
                type="button"
                onClick={() => handleSelectAnswer(letra)}
                className={`${styles.answerButton} ${claseResultado}`}
                disabled={showResult}
                aria-label={`Letra ${letra}`}
              >
                <span>{letra}</span>
                {showResult && esCorrecta && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                )}
                {showResult && esSeleccionada && !esCorrecta && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div
          className={`${styles.feedback} ${
            selectedAnswer === letraCorrecta ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
          role="status"
        >
          <span className={styles.feedbackIcon} aria-hidden="true">
            {selectedAnswer === letraCorrecta ? (
              <svg viewBox="0 0 24 24">
                <path d="m5 12 4.5 4.5L19 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            )}
          </span>
          <div>
            <strong>
              {selectedAnswer === letraCorrecta ? '¡Respuesta correcta!' : 'Sigue practicando'}
            </strong>
            <p>
              {selectedAnswer === letraCorrecta
                ? `Reconociste la seña de la letra ${letraCorrecta}.`
                : `La respuesta correcta era la letra ${letraCorrecta}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNext}
          >
            Continuar
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

const Nivel2Ejercicios = () => {
  const { idBloque } = useParams();
  return <Nivel2EjerciciosContenido key={idBloque} idBloque={idBloque} />;
};

export default Nivel2Ejercicios;
