import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/AbecedarioMenu.module.css';

const bloques = [
  { id: 1, letras: ['A', 'E', 'S', 'T', 'O'] },
  { id: 2, letras: ['B', 'C', 'D', 'F', 'U'] },
  { id: 3, letras: ['I', 'P', 'V', 'W'] },
  { id: 4, letras: ['L', 'M', 'Ñ', 'R'] },
  { id: 5, letras: ['G', 'H', 'X', 'Y'] },
];

const AbecedarioMenu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [animandoId, setAnimandoId] = useState(null);
  const temporizadorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    };
  }, []);

  const manejarClick = (id) => {
    if (animandoId !== null) return;
    setAnimandoId(id);
    temporizadorRef.current = setTimeout(() => {
      navigate(`/bloque/${id}`);
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
      <header className={styles.hero} data-decoration="ABC">
        <div className={styles.heroIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
          </svg>
        </div>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Curso de LSM</span>
          <h1>Abecedario</h1>
          <p>Elige un módulo y aprende cada seña paso a paso.</p>
        </div>
        <div className={styles.heroCount}>
          <strong>5</strong>
          <span>módulos</span>
        </div>
      </header>

      <div className={styles.sectionHeading}>
        <div>
          <span>Tu recorrido</span>
          <h2>Selecciona un módulo</h2>
        </div>
        <span className={styles.totalLetters}>22 letras</span>
      </div>

      <div className={styles.grid}>
        {bloques.map((bloque) => {
          const estaAnimando = animandoId === bloque.id;
          return (
            <button
              key={bloque.id}
              type="button"
              onClick={() => manejarClick(bloque.id)}
              className={`${styles.moduleCard} ${estaAnimando ? styles.moduleCardActive : ''}`}
              aria-label={`Módulo ${bloque.id}: letras ${bloque.letras.join(', ')}`}
            >
              <span className={styles.moduleTop}>
                <span className={styles.moduleNumber}>{bloque.id}</span>
                <span className={styles.moduleMeta}>
                  <small>Módulo {bloque.id}</small>
                  <strong>{bloque.letras.length} letras</strong>
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>

              <span className={styles.letterList}>
                {bloque.letras.map((letra) => (
                  <span key={letra} className={styles.letterChip}>{letra}</span>
                ))}
              </span>

              <span className={styles.cardFooter}>
                <span className={styles.cardLine} />
                <span>Comenzar</span>
              </span>
            </button>
          );
        })}
      </div>

      <section className={styles.practiceSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span>Después de los módulos</span>
            <h2>Práctica general</h2>
          </div>
          <span className={styles.totalLetters}>3 actividades</span>
        </div>
        <button type="button" className={styles.practiceCard} onClick={() => navigate('/abecedario/actividades')}>
          <span className={styles.practiceIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 6h8M8 12h8M8 18h5"/><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/></svg>
          </span>
          <span className={styles.practiceCopy}>
            <small>Nuevo recorrido</small>
            <strong>Practica todo el abecedario</strong>
            <span>Relaciona señas, deletrea palabras y encuentra parejas en el memorama.</span>
            <span className={styles.practiceTags}><i>Relacionar</i><i>Deletrear</i><i>Memorama</i></span>
          </span>
          <span className={styles.practiceArrow} aria-hidden="true">›</span>
        </button>
      </section>
    </section>
  );
};

export default AbecedarioMenu;
