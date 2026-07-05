import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const bloques = {
  1: { letras: ['A','E','S','T','O'] },
  2: { letras: ['B','C','D','F','U'] },
  3: { letras: ['I','K','P','V','W'] },
  4: { letras: ['L','M','Ñ','R'] },
  5: { letras: ['G','H','X','Y','Z'] }
};

const CaminoNiveles = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();
  const [estadoNiveles, setEstadoNiveles] = useState([false, false, false]); // nivel1, nivel2, nivel3 completados
  const bloque = bloques[idBloque];

  useEffect(() => {
    const cargarProgreso = async () => {
      const niveles = [];
      for (let i = 1; i <= 3; i++) {
        const key = `progreso_bloque_${idBloque}_nivel${i}`;
        const { value } = await Preferences.get({ key });
        niveles.push(value === 'completado');
      }
      setEstadoNiveles(niveles);
    };
    cargarProgreso();
  }, [idBloque]);

  if (!bloque) return <p>Bloque no encontrado</p>;

  const nivelDesbloqueado = (nivelIndex) => {
    if (nivelIndex === 0) return true; // nivel 1 siempre disponible
    return estadoNiveles[nivelIndex - 1]; // necesita el anterior completado
  };

  const irANivel = (nivel) => {
    if (!nivelDesbloqueado(nivel - 1)) return;
    // Navegar según nivel
    if (nivel === 1) navigate(`/bloque/${idBloque}/nivel1`);
    else if (nivel === 2) navigate(`/bloque/${idBloque}/nivel2`);
    else if (nivel === 3) navigate(`/bloque/${idBloque}/nivel3`);
  };

  const burbujas = [
    { nivel: 1, label: 'Aprender', icono: '📖' },
    { nivel: 2, label: 'Practicar', icono: '🎮' },
    { nivel: 3, label: 'Evaluación', icono: '📷' }
  ];

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, marginTop: 40 }}>
        {burbujas.map((b, idx) => {
          const completado = estadoNiveles[idx];
          const desbloqueado = nivelDesbloqueado(idx);
          return (
            <div key={b.nivel} style={{ textAlign: 'center' }}>
              <button
                onClick={() => irANivel(b.nivel)}
                disabled={!desbloqueado}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: completado ? '#4CAF50' : desbloqueado ? '#FF9800' : '#ccc',
                  border: '3px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  fontSize: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: desbloqueado ? 'pointer' : 'not-allowed',
                  margin: '0 auto'
                }}
              >
                {completado ? '✓' : b.icono}
              </button>
              <p style={{ marginTop: 8, fontWeight: 'bold' }}>{b.label}</p>
              {completado && <span style={{ color: 'green' }}>✔️</span>}
              {!desbloqueado && <span style={{ color: 'gray' }}>🔒</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaminoNiveles;