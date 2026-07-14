import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const contenidoBloque = {
  1: [
    { letra: 'A', descripcion: 'Puño cerrado, pulgar extendido hacia arriba pegado al índice.', imagen: '/assets/abecedario/imagen_a.jpeg' },    
    { letra: 'E', descripcion: 'Dedos doblados hacia abajo, pulgar tocando el índice.', imagen: '/assets/abecedario/imagen_e.jpg' },
    { letra: 'S', descripcion: 'Puño cerrado, pulgar doblado sobre los dedos.', imagen: '/assets/abecedario/imagen_s.jpg' },
    { letra: 'T', descripcion: 'Puño cerrado, pulgar metido entre índice y medio.', imagen: '/assets/abecedario/imagen_t.jpg' },
    { letra: 'O', descripcion: 'Puntas de los dedos juntas formando un círculo.', imagen: '/assets/abecedario/imagen_o.jpg' },
  ],
  2: [
    { letra: 'B', descripcion: 'Mano abierta, dedos juntos, pulgar doblado sobre la palma.', imagen: '/assets/abecedario/imagen_b.jpg' },
    { letra: 'C', descripcion: 'Mano curvada en forma de C, dedos juntos.', imagen: '/assets/abecedario/imagen_c.jpg' },
    { letra: 'D', descripcion: 'Índice extendido hacia arriba, demás dedos doblados, pulgar tocando el medio.', imagen: '/assets/abecedario/imagen_d.jpg' },
    { letra: 'F', descripcion: 'Índice flexionado tocando el pulgar, demás dedos extendidos.', imagen: '/assets/abecedario/imagen_f.jpg' },
    { letra: 'U', descripcion: 'Índice y medio juntos extendidos, anular y meñique doblados, pulgar tocando el anular.', imagen: '/assets/abecedario/imagen_u.jpg' },
  ],
  3: [
    { letra: 'I', descripcion: 'Meñique extendido hacia arriba, demás dedos flexionados, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_i.jpg' },
    { letra: 'K', descripcion: 'Índice y medio extendidos en V, pulgar entre ellos (con movimiento).', imagen: '/assets/abecedario/imagen_k.jpg' },
    { letra: 'P', descripcion: 'Índice y medio extendidos en V, pulgar entre ellos (sin movimiento).', imagen: '/assets/abecedario/imagen_p.jpg' },
    { letra: 'V', descripcion: 'Índice y medio extendidos y juntos, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_v.jpg' },
    { letra: 'W', descripcion: 'Índice, medio y anular extendidos y separados, meñique doblado.', imagen: '/assets/abecedario/imagen_w.jpg' },
  ],
  4: [
    { letra: 'L', descripcion: 'Índice extendido, pulgar extendido formando una L.', imagen: '/assets/abecedario/imagen_l.jpg' },
    { letra: 'M', descripcion: 'Índice, medio y anular extendidos y juntos, meñique doblado, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_m.jpg' },
    { letra: 'Ñ', descripcion: 'Índice y medio juntos, pulgar entre los dedos (similar a H).', imagen: '/assets/abecedario/imagen_ñ.jpg' },
    { letra: 'R', descripcion: 'Índice y medio juntos, pulgar tocando la base del índice.', imagen: '/assets/abecedario/imagen_r.jpg' },
  ],
  5: [
    { letra: 'G', descripcion: 'Índice extendido, demás flexionados, pulgar doblado sobre la palma.', imagen: '/assets/abecedario/imagen_g.jpg' },
    { letra: 'H', descripcion: 'Índice y medio juntos extendidos, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_h.jpg' },
    { letra: 'X', descripcion: '(Descripción pendiente)', imagen: '/assets/abecedario/imagen_x.jpg' },
    { letra: 'Y', descripcion: '(Descripción pendiente)', imagen: '/assets/abecedario/imagen_y.jpg' },
    { letra: 'Z', descripcion: '(Descripción pendiente)', imagen: '/assets/abecedario/imagen_z.jpg' },
  ]
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
  {/* Imagen de la seña */}
  {item.imagen && (
          <img
            src={item.imagen}
            alt={`Seña de ${item.letra}`}
            style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 10 }}
            onError={(e) => { e.target.style.display = 'none'; }} // oculta si no carga
          />
        )}
        <div style={{ fontSize: 80, margin: 20 }}>{item.letra}</div>
        <p style={{ fontSize: 18, maxWidth: 300 }}>{item.descripcion}</p>
      </div>
        {/* Aquí más adelante podemos añadir una imagen o GIF de la seña */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={anterior} disabled={indice === 0}
          style={{ padding: '10px 20px', fontSize: 16 }}>
          ← Anterior
        </button>
        <span>{indice + 1} / {bloque.length}</span>
        <button onClick={siguiente}
          style={{ padding: '10px 20px', fontSize: 16, backgroundColor: '#4CAF50', color: 'black', border: 'none', borderRadius: 8 }}>
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