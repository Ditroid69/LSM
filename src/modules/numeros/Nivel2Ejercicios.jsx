import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';

// Bloque 1 de números (estáticos del 1 al 8)
const numerosBloque1 = ['1', '2', '3', '4', '5', '6', '7', '8'];

// Función para desordenar array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Nivel2NumerosEjercicios = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();

  // Por ahora solo el bloque 1 tiene ejercicios
  const letrasBloque = idBloque === '1' ? numerosBloque1 : [];
  const totalPreguntas = letrasBloque.length;

  const [correctFlags, setCorrectFlags] = useState(new Array(totalPreguntas).fill(false));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const pickNextQuestion = useCallback(() => {
    const incorrectIndices = correctFlags.reduce((acc, flag, idx) => {
      if (!flag) acc.push(idx);
      return acc;
    }, []);

    if (incorrectIndices.length === 0) {
      Preferences.set({ key: `progreso_numeros_bloque_${idBloque}_nivel2`, value: 'completado' });
      setLessonComplete(true);
      return;
    }

    const randomIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
    setCurrentQuestionIdx(randomIdx);
    setSelectedAnswer(null);
    setShowResult(false);

    const numeroCorrecto = letrasBloque[randomIdx];
    // Generar opciones: 3 números incorrectos + el correcto
    const otrosNumeros = letrasBloque.filter(n => n !== numeroCorrecto);
    const opcionesIncorrectas = shuffleArray(otrosNumeros).slice(0, 3);
    const todasOpciones = [...opcionesIncorrectas, numeroCorrecto];
    setShuffledOptions(shuffleArray(todasOpciones));
  }, [correctFlags, idBloque, letrasBloque]);

  useEffect(() => {
    setCorrectFlags(new Array(totalPreguntas).fill(false));
    setLessonComplete(false);
    setCurrentQuestionIdx(null);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [idBloque, totalPreguntas]);

  useEffect(() => {
    if (totalPreguntas > 0 && currentQuestionIdx === null && !lessonComplete) {
      pickNextQuestion();
    }
  }, [totalPreguntas, currentQuestionIdx, lessonComplete, pickNextQuestion]);

  const handleSelectAnswer = (numeroSeleccionado) => {
    if (showResult) return;
    setSelectedAnswer(numeroSeleccionado);
    setShowResult(true);

    const numeroCorrecto = letrasBloque[currentQuestionIdx];
    if (numeroSeleccionado === numeroCorrecto) {
      setCorrectFlags(prev => {
        const updated = [...prev];
        updated[currentQuestionIdx] = true;
        return updated;
      });
    }
  };

  const handleNext = () => {
    if (lessonComplete) return;
    pickNextQuestion();
  };

  const superadas = correctFlags.filter(Boolean).length;
  const progreso = totalPreguntas > 0 ? (superadas / totalPreguntas) * 100 : 0;

  if (totalPreguntas === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p>No hay ejercicios para este bloque todavía.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (lessonComplete) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h2>🎉 ¡Nivel 2 completado!</h2>
        <p>Has acertado todas las señas numéricas.</p>
        <button onClick={() => navigate(`/bloque-numeros/${idBloque}`)}>Volver al camino</button>
      </div>
    );
  }

  if (currentQuestionIdx === null) {
    return <p style={{ textAlign: 'center', padding: 40 }}>⏳ Preparando ejercicios...</p>;
  }

  const numeroCorrecto = letrasBloque[currentQuestionIdx];
  const imagenSrc = `/assets/numeros/imagen_${numeroCorrecto}.png`; // Ajusta la ruta según tu carpeta de imágenes

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque} – Practicar números</h2>
      <p>¿Qué número representa esta seña?</p>

      {/* Barra de progreso */}
      <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: 10, margin: '20px 0', height: 12 }}>
        <div
          style={{
            width: `${progreso}%`,
            backgroundColor: '#FF9800',
            height: '100%',
            borderRadius: 10,
            transition: 'width 0.3s'
          }}
        ></div>
      </div>
      <span style={{ fontSize: 14 }}>{superadas} / {totalPreguntas} superadas</span>

      {/* Imagen de la seña (la pregunta) */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <img
          src={imagenSrc}
          alt={`Seña del número ${numeroCorrecto}`}
          style={{ width: 150, height: 150, objectFit: 'contain', border: '3px solid #ccc', borderRadius: 16 }}
          onError={(e) => { e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="80"%3E${numeroCorrecto}%3C/text%3E%3C/svg%3E`; }}
        />
      </div>

      {/* Opciones (números) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 20 }}>
        {shuffledOptions.map((numero, idx) => {
          const esCorrecta = numero === numeroCorrecto;
          const esSeleccionada = selectedAnswer === numero;
          let borderStyle = '2px solid #ddd';
          let bgColor = '#f9f9f9';
          if (showResult) {
            if (esCorrecta) {
              borderStyle = '2px solid #4CAF50';
              bgColor = '#c8f7c5';
            } else if (esSeleccionada && !esCorrecta) {
              borderStyle = '2px solid #f44336';
              bgColor = '#f7c5c5';
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(numero)}
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                border: borderStyle,
                backgroundColor: bgColor,
                fontSize: 36,
                fontWeight: 'bold',
                color: 'black',
                cursor: showResult ? 'default' : 'pointer',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={showResult}
            >
              {numero}
            </button>
          );
        })}
      </div>

      {/* Retroalimentación y botón siguiente */}
      {showResult && (
        <div style={{ marginTop: 20 }}>
          <p style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: selectedAnswer === numeroCorrecto ? 'green' : 'red'
          }}>
            {selectedAnswer === numeroCorrecto ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </p>
          <button
            onClick={handleNext}
            style={{
              marginTop: 10,
              padding: '12px 24px',
              fontSize: 16,
              backgroundColor: '#FF9800',
              color: 'black',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default Nivel2NumerosEjercicios;