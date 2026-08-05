import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './Menu.module.css';

const modulos = [
  {
    nombre: 'Abecedario',
    descripcion: 'Aprende cada letra paso a paso',
    icono: '/assets/menu/icono-abecedario.png',
    ruta: '/abecedario',
    color: 'primary',
    contenido: '22 letras'
  },
  {
    nombre: 'Números',
    descripcion: 'Expresa cantidades con tus manos',
    icono: '/assets/menu/icono-numeros.png',
    ruta: '/numeros',
    color: 'accent',
    contenido: '3 módulos'
  },
  {
    nombre: 'Saludos y cortesía',
    descripcion: 'Inicia conversaciones cotidianas',
    icono: '/assets/menu/icono-saludos.png',
    ruta: '/saludos',
    color: 'success',
    contenido: '3 módulos'
  },
  {
    nombre: 'Comunicación básica',
    descripcion: 'Construye tus primeras expresiones',
    icono: '/assets/menu/icono-comunicacion.png',
    ruta: '/comunicacion',
    color: 'error',
    contenido: '3 módulos'
  }
];

const Menu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [animandoIdx, setAnimandoIdx] = useState(null);
  const temporizadorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    };
  }, []);

  const manejarClick = (ruta, indice) => {
    if (animandoIdx !== null) return;
    setAnimandoIdx(indice);
    temporizadorRef.current = setTimeout(() => navigate(ruta), 150);
  };

  const manejarErrorImagen = (event) => {
    event.currentTarget.style.display = 'none';
  };

  const cssVars = {
    '--menu-card': theme.tarjeta,
    '--menu-text': theme.tarjetaTexto || theme.texto,
    '--menu-muted': theme.texto2,
    '--menu-border': theme.borde,
    '--menu-primary': theme.boton2,
    '--menu-primary-shadow': '#24a997',
    '--menu-accent': theme.boton1,
    '--menu-accent-shadow': '#d5ad00',
    '--menu-success': theme.correcto,
    '--menu-success-shadow': '#087f5b',
    '--menu-error': theme.incorrecto,
    '--menu-error-shadow': '#c75012',
    '--menu-soft': theme.gris,
  };

  return (
    <section
      className={styles.page}
      style={cssVars}
      aria-label="Módulos de aprendizaje"
    >
      <header className={styles.hero} data-decoration="LSM">
        <div className={styles.heroIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 11V6a2 2 0 0 1 4 0v4-6a2 2 0 0 1 4 0v6-4a2 2 0 0 1 4 0v7c0 5-3 8-8 8h-1c-3 0-5-1.5-7-4l-2-3a2 2 0 0 1 3-2l3 3" />
          </svg>
        </div>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Tu espacio de aprendizaje</span>
          <h1>¿Qué aprenderemos hoy?</h1>
          <p>Elige una categoría y continúa avanzando en Lengua de Señas Mexicana.</p>
        </div>
        <div className={styles.heroCount}>
          <strong>4</strong>
          <span>categorías</span>
        </div>
      </header>

      <div className={styles.sectionHeading}>
        <div>
          <span>Explora y aprende</span>
          <h2>Categorías</h2>
        </div>
        
      </div>

      <div className={styles.grid}>
        {modulos.map((modulo, indice) => {
          const estaAnimando = animandoIdx === indice;
          return (
            <button
              key={modulo.ruta}
              type="button"
              onClick={() => manejarClick(modulo.ruta, indice)}
              disabled={animandoIdx !== null}
              className={`${styles.card} ${styles[modulo.color]} ${
                estaAnimando ? styles.cardActive : ''
              }`}
              aria-label={`Abrir módulo ${modulo.nombre}`}
            >
              <span className={styles.cardTop}>
                <span className={styles.imageFrame}>
                  <img
                    src={modulo.icono}
                    alt=""
                    onError={manejarErrorImagen}
                    draggable="false"
                  />
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>

              <span className={styles.cardContent}>
                <small>{modulo.contenido}</small>
                <strong>{modulo.nombre}</strong>
                <span>{modulo.descripcion}</span>
              </span>

              <span className={styles.cardFooter}>
                <span />
                Explorar
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Menu;
