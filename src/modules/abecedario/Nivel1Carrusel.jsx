import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const contenidoBloque = {
  1: [
    { letra: 'A', descripcion: 'Puño cerrado, pulgar extendido hacia arriba pegado al índice.' },
    { letra: 'E', descripcion: 'Dedos doblados hacia abajo, pulgar tocando el índice.' },
    { letra: 'S', descripcion: 'Puño cerrado, pulgar doblado sobre los dedos.' },
    { letra: 'T', descripcion: 'Puño cerrado, pulgar metido entre índice y medio.' },
    { letra: 'O', descripcion: 'Puntas de los dedos juntas formando un círculo.' },
  ],
  2: [
    { letra: 'B', descripcion: 'Mano abierta, dedos juntos, pulgar doblado sobre la palma.' },
    { letra: 'C', descripcion: 'Mano curvada en forma de C.' },
    // ... completaremos cuando lleguemos a ese bloque
  ],
  // Los demás bloques se llenarán después
};

const Nivel1Carrusel = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);

  const bloque = contenidoBloque[idBloque];
  if (!bloque) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <p>Contenido no disponible aún.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const item = bloque[indice];
  const esUltimo = indice === bloque.length - 1;

  const siguiente = () => {
    if (esUltimo) {
      // Marcar nivel como completado
      Preferences.set({ key: `progreso_bloque_${idBloque}_nivel1`, value: 'completado' });
      navigate(`/bloque/${idBloque}`); // volver al camino de niveles
    } else {
      setIndice(indice + 1);
    }
  };

  const anterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque} - Aprender</h2>
      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 30,
        margin: '20px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: 80, margin: 20 }}>{item.letra}</div>
        <p style={{ fontSize: 18, maxWidth: 300 }}>{item.descripcion}</p>
        {/* Aquí más adelante podemos añadir una imagen o GIF de la seña */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={anterior} disabled={indice === 0}
          style={{ padding: '10px 20px', fontSize: 16 }}>
          ← Anterior
        </button>
        <span>{indice + 1} / {bloque.length}</span>
        <button onClick={siguiente}
          style={{ padding: '10px 20px', fontSize: 16, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 8 }}>
          {esUltimo ? 'Finalizar' : 'Siguiente →'}
        </button>
      </div>
      <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: 10, marginTop: 20, height: 10 }}>
        <div style={{ width: `${((indice + 1) / bloque.length) * 100}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: 10 }}></div>
      </div>
    </div>
  );
};

export default Nivel1Carrusel;