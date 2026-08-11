import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/Nivel1Carrusel.module.css';
import VideoNumero from '../numeros/VideoNumero';
import { letrasConMovimiento } from '../../data/abecedarioMovimiento';

const contenidoBloque = {
  1: [
    { letra: 'A', descripcion: 'Puño cerrado, pulgar extendido hacia arriba pegado al índice.', imagen: '/assets/abecedario/imagen_a.png' },    
    { letra: 'E', descripcion: 'Dedos doblados hacia abajo, pulgar tocando el índice.', imagen: '/assets/abecedario/imagen_e.png' },
    { letra: 'S', descripcion: 'Puño cerrado, pulgar doblado sobre los dedos.', imagen: '/assets/abecedario/imagen_s.png' },
    { letra: 'T', descripcion: 'Puño cerrado, pulgar metido entre índice y medio.', imagen: '/assets/abecedario/imagen_t.png' },
    { letra: 'O', descripcion: 'Puntas de los dedos juntas formando un círculo.', imagen: '/assets/abecedario/imagen_o.png' },
  ],
  2: [
    { letra: 'B', descripcion: 'Mano abierta, dedos juntos, pulgar doblado sobre la palma.', imagen: '/assets/abecedario/imagen_b.png' },
    { letra: 'C', descripcion: 'Mano curvada en forma de C, dedos juntos.', imagen: '/assets/abecedario/imagen_c.png' },
    { letra: 'D', descripcion: 'Índice extendido hacia arriba, demás dedos doblados, pulgar tocando el medio.', imagen: '/assets/abecedario/imagen_d.png' },
    { letra: 'F', descripcion: 'Índice flexionado tocando el pulgar, demás dedos extendidos.', imagen: '/assets/abecedario/imagen_f.png' },
    { letra: 'U', descripcion: 'Índice y medio juntos extendidos, anular y meñique doblados, pulgar tocando el anular.', imagen: '/assets/abecedario/imagen_u.png' },
  ],
  3: [
    { letra: 'I', descripcion: 'Meñique extendido hacia arriba, demás dedos flexionados, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_i.png' },
    { letra: 'P', descripcion: 'Índice y medio extendidos en V, pulgar entre ellos (sin movimiento).', imagen: '/assets/abecedario/imagen_p.png' },
    { letra: 'V', descripcion: 'Índice y medio extendidos y juntos, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_v.png' },
    { letra: 'W', descripcion: 'Índice, medio y anular extendidos y separados, meñique doblado.', imagen: '/assets/abecedario/imagen_w.png' },
  ],
  4: [
    { letra: 'L', descripcion: 'Índice extendido, pulgar extendido formando una L.', imagen: '/assets/abecedario/imagen_l.png' },
    { letra: 'M', descripcion: 'Índice, medio y anular extendidos y juntos, meñique doblado, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_m.png' },
    { letra: 'N', descripcion: 'Índice y medio juntos, pulgar entre los dedos (similar a H).', imagen: '/assets/abecedario/imagen_n.png' },
    { letra: 'R', descripcion: 'Índice y medio juntos, pulgar tocando la base del índice.', imagen: '/assets/abecedario/imagen_r.png' },
  ],
  5: [
    { letra: 'G', descripcion: 'Índice extendido, demás flexionados, pulgar doblado sobre la palma.', imagen: '/assets/abecedario/imagen_g.png' },
    { letra: 'H', descripcion: 'Índice y medio juntos extendidos, pulgar sobre la palma.', imagen: '/assets/abecedario/imagen_h.png' },
    { letra: 'X', descripcion: 'Mantén el índice levantado y flexiona su punta para formar un gancho. Cierra el medio, el anular y el meñique sobre la palma, y apoya el pulgar sobre el dedo medio.', imagen: '/assets/abecedario/imagen_x.png' },
    { letra: 'Y', descripcion: 'Pulgar y meñique extendidos y separados; índice, medio y anular doblados sobre la palma.', imagen: '/assets/abecedario/imagen_y.png' },
  ],
  6: letrasConMovimiento.map((item) => ({ ...item, video: item.recurso })),
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
    <section className={`${styles.page} ${item.video ? styles.fullVideoPage : ''}`} style={cssVars}>
      <header className={styles.lessonHeader}>
        <div>
          <span className={styles.eyebrow}>Abecedario · Bloque {idBloque}</span>
          <h1>{item.video ? 'Letras en movimiento' : 'Aprende la seña'}</h1>
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

      {item.video ? (
        <article className={styles.fullVideoLesson} key={item.letra}>
          <div className={styles.videoNumberBlock}>
            <span className={styles.signTag}>Letra</span>
            <div className={styles.videoNumber}>{item.letra}</div>
          </div>
          <div className={styles.fullVideoFrame}>
            <VideoNumero src={item.video} valor={item.letra} etiqueta="letra" />
          </div>
          <div className={styles.videoDescription}>
            <h2>¿Cómo se hace?</h2>
            <p>{item.descripcion}</p>
            <div className={styles.tip}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 22h4" /><path d="M8.2 14.5A7 7 0 1 1 15.8 14.5 4 4 0 0 0 15 16H9a4 4 0 0 0-.8-1.5z" /></svg>
              <span>Observa la forma de la mano y la trayectoria completa antes de practicar.</span>
            </div>
          </div>
        </article>
      ) : (
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
          <h2>¿Cómo se hace?</h2>
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
      )}

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
          <span>{esUltimo ? 'Finalizar' : 'Siguiente'}</span>
          {esUltimo && (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default Nivel1Carrusel;
