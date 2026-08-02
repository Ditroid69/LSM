import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { modulosSaludos } from '../../data/saludosCortesia';
import styles from '../abecedario/styles/AbecedarioMenu.module.css';

const SaludosMenu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [animandoId, setAnimandoId] = useState(null);
  const temporizadorRef = useRef(null);

  useEffect(() => () => clearTimeout(temporizadorRef.current), []);

  const abrirModulo = (id) => {
    if (animandoId !== null) return;
    setAnimandoId(id);
    temporizadorRef.current = setTimeout(() => navigate(`/saludos/modulo/${id}`), 150);
  };

  const cssVars = {
    '--modules-card': theme.tarjeta, '--modules-text': theme.tarjetaTexto || theme.texto,
    '--modules-muted': theme.texto2, '--modules-border': theme.borde,
    '--modules-primary': theme.boton2, '--modules-primary-shadow': '#24a997',
    '--modules-accent': theme.boton1, '--modules-accent-shadow': '#d5ad00',
    '--modules-success': theme.correcto, '--modules-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.hero} data-decoration="HOLA">
        <div className={styles.heroIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></svg>
        </div>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Curso de LSM</span>
          <h1>Saludos y cortesía</h1>
          <p>Aprende a iniciar conversaciones, expresarte con cortesía y presentarte.</p>
        </div>
        <div className={styles.heroCount}><strong>3</strong><span>módulos</span></div>
      </header>

      <div className={styles.sectionHeading}>
        <div><span>Contextos situacionales</span><h2>Selecciona un módulo</h2></div>
        <span className={styles.totalLetters}>3 disponibles</span>
      </div>

      <div className={styles.grid}>
        {modulosSaludos.map((modulo) => (
          <button key={modulo.id} type="button" onClick={() => abrirModulo(modulo.id)} className={`${styles.moduleCard} ${animandoId === modulo.id ? styles.moduleCardActive : ''}`}>
            <span className={styles.moduleTop}>
              <span className={styles.moduleNumber}>{modulo.id}</span>
              <span className={styles.moduleMeta}><small>Módulo {modulo.id}</small><strong>{modulo.nombre}</strong></span>
              <span className={styles.arrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </span>
            <span className={styles.letterList}>
              {modulo.expresiones.map(({ texto }) => <span key={texto} className={styles.letterChip}>{texto}</span>)}
            </span>
            <span className={styles.cardFooter}><span className={styles.cardLine} /><span>{modulo.descripcion}</span></span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SaludosMenu;
