import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import PantallaCelebracion from '../../components/PantallaCelebracion'; // si no lo tienes, crea un componente simple o elimina esta línea

// Bloques del abecedario (igual que en Leccion.jsx)
const bloquesAbecedario = {
  1: ['A', 'E', 'S', 'T', 'O'],
  2: ['B', 'C', 'D', 'F', 'U'],
  3: ['I', 'K', 'P', 'V', 'W'],
  4: ['L', 'M', 'Ñ', 'R'],
  5: ['G', 'H', 'X', 'Y', 'Z']
};

// Función para desordenar array
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

  // Letras del bloque actual
  const letrasBloque = bloquesAbecedario[idBloque] || [];
  const totalPreguntas = letrasBloque.length;

  // Estado: seguimiento de aciertos por letra (true = acertada)
  const [correctFlags, setCorrectFlags] = useState(new Array(totalPreguntas).fill(false));
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // letra seleccionada
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]); // letras (texto) desordenadas

  // Elegir siguiente pregunta entre las no superadas
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

    const letraCorrecta = letrasBloque[randomIdx];
    // Generar opciones: 3 letras incorrectas + la correcta
    const otrasLetras = letrasBloque.filter((_, idx) => idx !== randomIdx);
    const opcionesIncorrectas = shuffleArray(otrasLetras).slice(0, 3); // máximo 3 incorrectas
    const todasOpciones = [...opcionesIncorrectas, letraCorrecta];
    setShuffledOptions(shuffleArray(todasOpciones));
  }, [correctFlags, idBloque, letrasBloque]);

  // Reiniciar al cambiar de bloque
  useEffect(() => {
    setCorrectFlags(new Array(totalPreguntas).fill(false));
    setLessonComplete(false);
    setCurrentQuestionIdx(null);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [idBloque, totalPreguntas]);

  // Elegir la primera pregunta al cargar
  useEffect(() => {
    if (totalPreguntas > 0 && currentQuestionIdx === null && !lessonComplete) {
      pickNextQuestion();
    }
  }, [totalPreguntas, currentQuestionIdx, lessonComplete, pickNextQuestion]);

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

  const letraCorrecta = letrasBloque[currentQuestionIdx];
  const imagenSrc = `/assets/abecedario/imagen_${letraCorrecta.toLowerCase()}.jpg`;

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque} – Practicar</h2>
      <p>¿Qué letra representa esta seña?</p>

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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0'
      }}>
        <img
          src={imagenSrc}
          alt={`Seña de ${letraCorrecta}`}
          style={{ width: 150, height: 150, objectFit: 'contain', border: '3px solid #ccc', borderRadius: 16 }}
          onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="80"%3E' + letraCorrecta + '%3C/text%3E%3C/svg%3E'; }}
        />
      </div>

      {/* Opciones (letras) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 20 }}>
        {shuffledOptions.map((letra, idx) => {
          const esCorrecta = letra === letraCorrecta;
          const esSeleccionada = selectedAnswer === letra;
          let borderStyle = '2px solid #ddd';
          let bgColor = '#000000';
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
              onClick={() => handleSelectAnswer(letra)}
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                border: borderStyle,
                backgroundColor: bgColor,
                fontSize: 36,
                fontWeight: 'bold',
                cursor: showResult ? 'default' : 'pointer',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={showResult}
            >
              {letra}
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
            color: selectedAnswer === letraCorrecta ? 'green' : 'red'
          }}>
            {selectedAnswer === letraCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
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

export default Nivel2Ejercicios;