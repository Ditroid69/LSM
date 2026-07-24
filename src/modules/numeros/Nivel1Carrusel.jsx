import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';

// Datos para el Bloque 1 (números estáticos). Amplía según los números que quieras.
const contenidoBloque = {
  1: [
    { numero: '1', descripcion: 'Índice extendido hacia arriba.', imagen: '/assets/numeros/imagen_1.png' },
    { numero: '2', descripcion: 'Índice y medio extendidos hacia arriba.', imagen: '/assets/numeros/imagen_2.png' },
    { numero: '3', descripcion: 'Índice, medio y anular extendidos.', imagen: '/assets/numeros/imagen_3.png' },
    { numero: '4', descripcion: 'Todos los dedos extendidos, pulgar doblado.', imagen: '/assets/numeros/imagen_4.png' },
    { numero: '5', descripcion: 'Mano abierta con todos los dedos extendidos.', imagen: '/assets/numeros/imagen_5.png' },
    { numero: '6', descripcion: 'Índice, medio y anular extendidos, pulgar doblado.', imagen: '/assets/numeros/imagen_6.png' },
    { numero: '7', descripcion: 'Índice y medio extendidos, pulgar doblado.', imagen: '/assets/numeros/imagen_7.png' },
    { numero: '8', descripcion: 'Índice extendido, pulgar doblado.', imagen: '/assets/numeros/imagen_8.png' },
  ],
  // Los demás bloques estarán vacíos por ahora
};

const Nivel1CarruselNumeros = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);

  const bloque = contenidoBloque[idBloque];
  if (!bloque || bloque.length === 0) {
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
      Preferences.set({ key: `progreso_numeros_bloque_${idBloque}_nivel1`, value: 'completado' });
      navigate(`/numeros/bloque/${idBloque}`);
    } else {
      setIndice(indice + 1);
    }
  };

  const anterior = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Bloque {idBloque} - Aprender Números</h2>
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
        {item.imagen && (
          <img
            src={item.imagen}
            alt={`Seña del número ${item.numero}`}
            style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 10 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div style={{ fontSize: 80, margin: 20 }}>{item.numero}</div>
        <p style={{ fontSize: 18, maxWidth: 300 }}>{item.descripcion}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={anterior} disabled={indice === 0} style={{ padding: '10px 20px', fontSize: 16 }}>
          ← Anterior
        </button>
        <span>{indice + 1} / {bloque.length}</span>
        <button onClick={siguiente} style={{ padding: '10px 20px', fontSize: 16, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 8 }}>
          {esUltimo ? 'Finalizar' : 'Siguiente →'}
        </button>
      </div>
      <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: 10, marginTop: 20, height: 10 }}>
        <div style={{ width: `${((indice + 1) / bloque.length) * 100}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: 10 }}></div>
      </div>
    </div>
  );
};

export default Nivel1CarruselNumeros;