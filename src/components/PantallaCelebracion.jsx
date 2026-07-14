import { useState, useEffect } from 'react';

const frases = [
  '¡Excelente trabajo!',
  '¡Sigue así!',
  '¡Eres increíble!',
  '¡Cada vez mejor!',
  '¡Domina las señas!',
  '¡Qué bien lo hiciste!',
  '¡Vas por buen camino!'
];

const PantallaCelebracion = ({ mensaje, onVolver }) => {
  const [mostrar, setMostrar] = useState(false);
  const [frase] = useState(() => frases[Math.floor(Math.random() * frases.length)]);

  useEffect(() => {
    const timer = setTimeout(() => setMostrar(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#fef9e7',
      transition: 'opacity 0.5s',
      opacity: mostrar ? 1 : 0
    }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>
        🎉🎊🎉
      </div>
      <h1 style={{ color: '#4CAF50', fontSize: 32, margin: 20 }}>{frase}</h1>
      <p style={{ fontSize: 20, color: '#555' }}>{mensaje || '¡Nivel completado!'}</p>
      <div style={{ fontSize: 40, margin: 20 }}>
        ⭐✨🌟
      </div>
      <button
        onClick={onVolver}
        style={{
          marginTop: 30,
          padding: '15px 30px',
          fontSize: 18,
          backgroundColor: '#FF9800',
          color: 'black',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        Volver al camino
      </button>
    </div>
  );
};

export default PantallaCelebracion;