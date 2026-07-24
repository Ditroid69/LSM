import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // ajusta la ruta según tu estructura

const bloques = [
  { id: 1, letras: ['A', 'E', 'S', 'T', 'O'] },
  { id: 2, letras: ['B', 'C', 'D', 'F', 'U'] },
  { id: 3, letras: ['I', 'K', 'P', 'V', 'W'] },
  { id: 4, letras: ['L', 'M', 'Ñ', 'R'] },
  { id: 5, letras: ['G', 'H', 'X', 'Y', 'Z'] },
];

const AbecedarioMenu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [animandoId, setAnimandoId] = useState(null);

  const manejarClick = (id) => {
    setAnimandoId(id);
    // Retrasamos la navegación para que se vea la animación
    setTimeout(() => {
      navigate(`/bloque/${id}`);
    }, 150);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center', color: theme.texto }}>Abecedario</h2>
      <p style={{ textAlign: 'center', color: theme.texto, opacity: 0.7 }}>
        Elige las letras a practicar
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
        {bloques.map((bloque) => {
          const estaAnimando = animandoId === bloque.id;
          return (
            <button
              key={bloque.id}
              onClick={() => manejarClick(bloque.id)}
              style={{
                backgroundColor: theme.tarjeta,
                color: theme.tarjetaTexto,
                padding: '20px 16px',
                borderRadius: 20,
                border: `2px solid ${theme.borde || '#CBD5E1'}`,
                boxShadow: estaAnimando
                  ? '0 2px 4px rgba(0,0,0,0.1)'
                  : '0 4px 12px rgba(0,0,0,0.15)',
                fontWeight: 'bold',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                transform: estaAnimando ? 'scale(0.97)' : 'scale(1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              <span>Módulo {bloque.id}</span>
              <span style={{ fontSize: 18, opacity: 0.9 }}>
                {bloque.letras.join(' · ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AbecedarioMenu;