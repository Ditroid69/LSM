import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './Nivel1Carrusel.module.css';

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
    { letra: 'Ñ', descripcion: 'Índice y medio juntos, pulgar entre los dedos (similar a H).', imagen: '/assets/abecedario/imagen_n.jpg' },
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
  const { theme } = useTheme();
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

  const siguiente = async () => {
    if (esUltimo) {
      await Preferences.set({
        key: `progreso_bloque_${idBloque}_nivel1`,
        value: 'completado'
      });
      navigate(`/bloque/${idBloque}`);
    } else {
      setIndice((actual) => actual + 1);
    }
  };

  const anterior = () => {
    if (indice > 0) setIndice((actual) => actual - 1);
  };

  const progreso = ((indice + 1) / bloque.length) * 100;
  const cssVars = {
    '--lesson-card': theme.tarjeta,
    '--lesson-text': theme.tarjetaTexto || theme.texto,
    '--lesson-muted': theme.texto2,
    '--lesson-border': theme.borde,
    '--lesson-primary': theme.boton2,
    '--lesson-primary-shadow': '#24a997',
    '--lesson-accent': theme.boton1,
    '--lesson-accent-shadow': '#d5ad00',
    '--lesson-success': theme.correcto,
    '--lesson-success-shadow': '#087f5b',
    '--lesson-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.lessonHeader}>
        <div>
          <span className={styles.eyebrow}>Abecedario · Bloque {idBloque}</span>
          <h1>Aprende la seña</h1>
        </div>
        <div className={styles.counter} aria-label={`Seña ${indice + 1} de ${bloque.length}`}>
          <strong>{indice + 1}</strong>
          <span>/ {bloque.length}</span>
        </div>
      </header>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Progreso del nivel"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progreso)}
      >
        <span className={styles.progressFill} style={{ width: `${progreso}%` }} />
      </div>

      <article className={styles.signCard} key={item.letra}>
        <div className={styles.imageColumn}>
          <span className={styles.imageLabel}>Observa la posición</span>
          <div className={styles.imageFrame}>
            <span className={styles.imageGlow} aria-hidden="true" />
            {item.imagen && (
              <img
                src={item.imagen}
                alt={`Demostración de la seña para la letra ${item.letra}`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.contentColumn}>
          <span className={styles.signTag}>Letra</span>
          <div className={styles.letter}>{item.letra}</div>
          <h2>¿Cómo hacerla?</h2>
          <p>{item.descripcion}</p>
          <div className={styles.tip}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18h6M10 22h4" />
              <path d="M8.2 14.5A7 7 0 1 1 15.8 14.5 4 4 0 0 0 15 16H9a4 4 0 0 0-.8-1.5z" />
            </svg>
            <span>Observa bien los dedos y practica con calma.</span>
          </div>
        </div>
      </article>

      <div className={styles.dots} aria-hidden="true">
        {bloque.map((seña, posicion) => (
          <span
            key={seña.letra}
            className={`${styles.dot} ${
              posicion === indice
                ? styles.dotCurrent
                : posicion < indice
                  ? styles.dotVisited
                  : ''
            }`}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          onClick={anterior}
          disabled={indice === 0}
          className={styles.previousButton}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={siguiente}
          className={`${styles.nextButton} ${esUltimo ? styles.finishButton : ''}`}
        >
          <span>{esUltimo ? 'Finalizar nivel' : 'Siguiente'}</span>
          {esUltimo ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default Nivel1Carrusel;
