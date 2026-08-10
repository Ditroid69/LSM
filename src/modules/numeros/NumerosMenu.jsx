import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from '../abecedario/styles/AbecedarioMenu.module.css';
import { modulosNumeros } from '../../data/numeros';

const bloques = modulosNumeros.map((modulo) => ({
  ...modulo,
  contenidos: modulo.numeros.map(({ numero }) => numero),
  disponible: true,
}));

const NumerosMenu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [animandoId, setAnimandoId] = useState(null);
  const temporizadorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    };
  }, []);

  const manejarClick = (bloque) => {
    if (!bloque.disponible || animandoId !== null) return;
    setAnimandoId(bloque.id);
    temporizadorRef.current = setTimeout(() => {
      navigate(`/numeros/bloque/${bloque.id}`);
    }, 150);
  };

  const cssVars = {
    '--modules-card': theme.tarjeta,
    '--modules-text': theme.tarjetaTexto || theme.texto,
    '--modules-muted': theme.texto2,
    '--modules-border': theme.borde,
    '--modules-primary': theme.boton2,
    '--modules-primary-shadow': '#24a997',
    '--modules-accent': theme.boton1,
    '--modules-accent-shadow': '#d5ad00',
    '--modules-success': theme.correcto,
    '--modules-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.hero} data-decoration="123">
        <div className={styles.heroIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 4v16M4 7l3-3 3 3" />
            <path d="M13 8a3.5 3.5 0 1 1 7 0c0 4.5-7 5.5-7 11h7" />
          </svg>
        </div>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Curso de LSM</span>
          <h1>Números</h1>
          <p>Aprende a expresar cantidades con tus manos.</p>
        </div>
        <div className={styles.heroCount}>
          <strong>{bloques.length}</strong>
          <span>módulos</span>
        </div>
      </header>

      <div className={styles.sectionHeading}>
        <div>
          <span>Tu recorrido</span>
          <h2>Selecciona un módulo</h2>
        </div>
        <span className={styles.totalLetters}>{bloques.length} disponibles</span>
      </div>

      <div className={styles.grid}>
        {bloques.map((bloque) => {
          const estaAnimando = animandoId === bloque.id;
          return (
            <button
              key={bloque.id}
              type="button"
              onClick={() => manejarClick(bloque)}
              disabled={!bloque.disponible}
              className={`${styles.moduleCard} ${estaAnimando ? styles.moduleCardActive : ''}`}
              aria-label={
                bloque.disponible
                  ? `Módulo ${bloque.id}: ${bloque.nombre}`
                  : `Módulo ${bloque.id}: ${bloque.nombre}. Próximamente`
              }
            >
              <span className={styles.moduleTop}>
                <span className={styles.moduleNumber}>{bloque.id}</span>
                <span className={styles.moduleMeta}>
                  <small>Módulo {bloque.id}</small>
                  <strong>{bloque.nombre}</strong>
                </span>
                {!bloque.disponible && (
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                )}
              </span>

              <span className={styles.letterList}>
                {bloque.contenidos.map((contenido) => (
                  <span key={contenido} className={styles.letterChip}>{contenido}</span>
                ))}
              </span>

              <span className={styles.cardFooter}>
                <span className={styles.cardLine} />
                <span>{bloque.disponible ? bloque.descripcion : 'Próximamente'}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default NumerosMenu;
