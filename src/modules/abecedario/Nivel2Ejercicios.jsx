import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import PantallaCelebracion from '../../components/PantallaCelebracion';

const bancoPreguntas = {
  1: [
    {
      letra: 'A',
      opciones: [
        'Puño cerrado, pulgar extendido hacia arriba',
        'Mano abierta con dedos juntos',
        'Dedos doblados, pulgar sobre el índice',
        'Puntas de los dedos juntas'
      ],
      correcta: 0
    },
    {
      letra: 'E',
      opciones: [
        'Puño cerrado, pulgar entre índice y medio',
        'Dedos doblados hacia abajo, pulgar tocando el índice',
        'Mano curvada en forma de C',
        'Índice extendido, demás doblados'
      ],
      correcta: 1
    },
    {
      letra: 'S',
      opciones: [
        'Puño cerrado, pulgar sobre los dedos',
        'Pulgar extendido, demás doblados',
        'Mano abierta, pulgar doblado sobre la palma',
        'Dedos juntos formando un círculo'
      ],
      correcta: 0
    },
    {
      letra: 'T',
      opciones: [
        'Puño cerrado, pulgar extendido hacia un lado',
        'Puño cerrado, pulgar metido entre índice y medio',
        'Dedos doblados, pulgar tocando el índice',
        'Mano curvada en forma de C'
      ],
      correcta: 1
    },
    {
      letra: 'O',
      opciones: [
        'Puño cerrado, pulgar doblado sobre los dedos',
        'Dedos juntos formando un círculo',
        'Índice extendido, pulgar tocando el medio',
        'Mano abierta con dedos separados'
      ],
      correcta: 1
    }
  ]
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Nivel2Ejercicios = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();

  const todasLasPreguntas = bancoPreguntas[idBloque] || [];
  const totalPreguntas = todasLasPreguntas.length;

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
      Preferences.set({ key: `progreso_bloque_${idBloque}_nivel2`, value: 'completado' });
      setLessonComplete(true);
      return;
    }

    const randomIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
    setCurrentQuestionIdx(randomIdx);
    setSelectedAnswer(null);
    setShowResult(false);
    const pregunta = todasLasPreguntas[randomIdx];
    setShuffledOptions(shuffleArray(pregunta.opciones.map((text, idx) => ({ text, originalIndex: idx }))));
  }, [correctFlags, idBloque, todasLasPreguntas]);

  // Reiniciar al cambiar de bloque
  useEffect(() => {
    setCorrectFlags(new Array(totalPreguntas).fill(false));
    setLessonComplete(false);
    setCurrentQuestionIdx(null);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [idBloque, totalPreguntas]);

  // Elegir la primera pregunta al cargar (solo si no hay pregunta actual)
  useEffect(() => {
    if (totalPreguntas > 0 && currentQuestionIdx === null && !lessonComplete) {
      pickNextQuestion();
    }
  }, [totalPreguntas, currentQuestionIdx, lessonComplete, pickNextQuestion]);

  const handleSelectAnswer = (opcionIndex) => {
    if (showResult) return;
    setSelectedAnswer(opcionIndex);
    setShowResult(true);

    const pregunta = todasLasPreguntas[currentQuestionIdx];
    if (opcionIndex === pregunta.correcta) {
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
      <PantallaCelebracion
        mensaje="¡Has completado todos los ejercicios!"
        onVolver={() => navigate(`/bloque/${idBloque}`)}
      />
    );
  }

  if (currentQuestionIdx === null) {
    return <p style={{ textAlign: 'center', padding: 40 }}>⏳ Preparando ejercicios...</p>;
  }

  const pregunta = todasLasPreguntas[currentQuestionIdx];

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque} – Practicar</h2>
      <p>Elige la descripción correcta para la seña</p>

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

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '30px auto',
        width: 150,
        height: 150,
        borderRadius: '50%',
        backgroundColor: '#FF9800',
        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
        color: 'white',
        fontSize: 96,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        {pregunta.letra}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {shuffledOptions.map((opcion, idx) => {
          const esCorrecta = opcion.originalIndex === pregunta.correcta;
          const esSeleccionada = selectedAnswer === opcion.originalIndex;
          let borderStyle = '2px solid #ddd';
          if (showResult) {
            if (esCorrecta) borderStyle = '2px solid #4CAF50';
            else if (esSeleccionada && !esCorrecta) borderStyle = '2px solid #f44336';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(opcion.originalIndex)}
              style={{
                padding: 16,
                fontSize: 16,
                borderRadius: 12,
                border: borderStyle,
                backgroundColor: showResult
                  ? esCorrecta
                    ? '#c8f7c5'
                    : esSeleccionada && !esCorrecta
                    ? '#f7c5c5'
                    : '#f9f9f9'
                  : '#f9f9f9',
                cursor: showResult ? 'default' : 'pointer',
                transition: '0.2s',
                textAlign: 'left'
              }}
              disabled={showResult}
            >
              {opcion.text}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ marginTop: 20 }}>
          <p style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: selectedAnswer === pregunta.correcta ? 'green' : 'red'
          }}>
            {selectedAnswer === pregunta.correcta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </p>
        </div>
      )}

      {showResult && (
        <button
          onClick={handleNext}
          style={{
            marginTop: 10,
            padding: '12px 24px',
            fontSize: 16,
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Siguiente →
        </button>
      )}
    </div>
  );
};

export default Nivel2Ejercicios;