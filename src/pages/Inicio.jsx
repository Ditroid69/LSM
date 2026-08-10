import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import styles from './Inicio.module.css';

const Inicio = ({ onCompletar }) => {
  const [nombre, setNombre] = useState('');
  const [modo, setModo] = useState('inicial');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const timerRef = useRef(null);

  useEffect(() => {
    const verificar = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) {
        setModo('loading');
        timerRef.current = setTimeout(() => {
          onCompletar();
          navigate('/menu', { replace: true });
        }, 1500);
      } else {
        setModo('input');
      }
    };
    verificar();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate, onCompletar]);

  const manejarEntrar = async () => {
    if (nombre.trim() === '') return;
    setModo('loading');
    await Preferences.set({ key: 'nombre', value: nombre.trim() });

    timerRef.current = setTimeout(() => {
      onCompletar();
      navigate('/menu', { replace: true });
    }, 1500);
  };

  const cssVars = {
    '--welcome-background': theme.fondo,
    '--welcome-card': theme.tarjeta,
    '--welcome-text': theme.tarjetaTexto || theme.texto,
    '--welcome-muted': theme.texto2,
    '--welcome-border': theme.borde,
    '--welcome-primary': theme.boton2,
    '--welcome-primary-shadow': '#24a997',
    '--welcome-accent': theme.boton1,
    '--welcome-soft': theme.gris,
  };

  if (modo === 'inicial') {
    return (
      <main className={styles.page} style={cssVars}>
        <div className={styles.splash}>
          <span className={styles.logoHalo} aria-hidden="true" />
          <img src={logo} alt="Kineseña" />
        </div>
      </main>
    );
  }

  if (modo === 'loading') {
    return (
      <main className={styles.page} style={cssVars}>
        <section className={styles.card} aria-live="polite">
          <div className={styles.brand}>
            <span className={styles.logoHalo} aria-hidden="true" />
            <img src={logo} alt="Kineseña" />
          </div>
          <span className={styles.eyebrow}>Preparando tu aprendizaje</span>
          <h1>¡Todo listo!</h1>
          <p>Estamos preparando tus módulos de Lengua de Señas Mexicana.</p>
          <div className={styles.loadingTrack} aria-hidden="true"><span /></div>
          <div className={styles.loadingStatus}>
            <span><i /><i /><i /></span>
            Cargando
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page} style={cssVars}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logoHalo} aria-hidden="true" />
          <img src={logo} alt="Kineseña" />
        </div>

        <span className={styles.eyebrow}>Bienvenido a Kineseña</span>
        <h1>Comencemos a aprender</h1>
        <p>Dinos cómo te llamas para personalizar tu experiencia.</p>

        <div className={styles.field}>
          <label htmlFor="nombre-usuario">Tu nombre</label>
          <div className={styles.inputWrapper}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            <input
              id="nombre-usuario"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Escribe tu nombre"
              autoComplete="name"
              maxLength={40}
              autoFocus
            />
          </div>
        </div>

        <button type="button" onClick={manejarEntrar} disabled={nombre.trim() === ''}>
          Comenzar
        </button>

        <small>Tu nombre se guarda únicamente en este dispositivo.</small>
      </section>
    </main>
  );
};

export default Inicio;
