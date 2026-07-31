import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from '../abecedario/Nivel1Carrusel.module.css';

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
  const { theme } = useTheme();
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

  const siguiente = async () => {
    if (esUltimo) {
      await Preferences.set({ key: `progreso_numeros_bloque_${idBloque}_nivel1`, value: 'completado' });
      navigate(`/numeros/bloque/${idBloque}`);
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
          <span className={styles.eyebrow}>Números · Módulo {idBloque}</span>
          <h1>Aprende la seña</h1>
        </div>
        <div className={styles.counter} aria-label={`Número ${indice + 1} de ${bloque.length}`}>
          <strong>{indice + 1}</strong>
          <span>/ {bloque.length}</span>
        </div>
      </header>

      <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin="0" aria-valuemax="100">
        <span className={styles.progressFill} style={{ width: `${progreso}%` }} />
      </div>

      <article className={styles.signCard} key={item.numero}>
        <div className={styles.imageColumn}>
          <span className={styles.imageLabel}>Observa la posición</span>
          <div className={styles.imageFrame}>
            <span className={styles.imageGlow} aria-hidden="true" />
            <img
              src={item.imagen}
              alt={`Demostración de la seña para el número ${item.numero}`}
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        <div className={styles.contentColumn}>
          <span className={styles.signTag}>Número</span>
          <div className={styles.letter}>{item.numero}</div>
          <h2>¿Cómo hacerlo?</h2>
          <p>{item.descripcion}</p>
          <div className={styles.tip}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18h6M10 22h4" />
              <path d="M8.2 14.5A7 7 0 1 1 15.8 14.5 4 4 0 0 0 15 16H9a4 4 0 0 0-.8-1.5z" />
            </svg>
            <span>Observa los dedos y practica con calma.</span>
          </div>
        </div>
      </article>

      <div className={styles.dots} aria-hidden="true">
        {bloque.map((seña, posicion) => (
          <span
            key={seña.numero}
            className={`${styles.dot} ${posicion === indice ? styles.dotCurrent : posicion < indice ? styles.dotVisited : ''}`}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={anterior} disabled={indice === 0} className={styles.previousButton}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          <span>Anterior</span>
        </button>

        <button type="button" onClick={siguiente} className={`${styles.nextButton} ${esUltimo ? styles.finishButton : ''}`}>
          <span>{esUltimo ? 'Finalizar nivel' : 'Siguiente'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {esUltimo ? <path d="m5 12 4.5 4.5L19 7" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Nivel1CarruselNumeros;
