import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import styles from './Layout.module.css';

const Layout = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { modo, theme, toggleModo } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [salidaPendiente, setSalidaPendiente] = useState(null);

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const { value } = await Preferences.get({ key: 'nombre' });
        if (value) setNombre(value);
      } catch (error) {
        console.error('Error al obtener el nombre:', error);
      }
    };
    cargarNombre();
  }, []);

  const esNivel =
    location.pathname.includes('/nivel1') ||
    location.pathname.includes('/nivel2') ||
    location.pathname.includes('/nivel3');
  const esInicio = location.pathname === '/';
  const esMenu = location.pathname === '/menu';
  const mostrarBotonAtras = !esNivel && !esInicio && !esMenu;

  const obtenerClaveNivelActual = () => {
    const nivelAbecedario = location.pathname.match(/^\/bloque\/([^/]+)\/nivel([1-3])$/);
    if (nivelAbecedario) {
      return `progreso_bloque_${nivelAbecedario[1]}_nivel${nivelAbecedario[2]}`;
    }

    const nivelNumeros = location.pathname.match(/^\/numeros\/bloque\/([^/]+)\/nivel([1-3])$/);
    if (nivelNumeros) {
      return `progreso_numeros_bloque_${nivelNumeros[1]}_nivel${nivelNumeros[2]}`;
    }

    return null;
  };

  const solicitarNavegacion = async (ruta) => {
    const claveNivel = obtenerClaveNivelActual();
    setMenuAbierto(false);

    if (claveNivel) {
      const { value } = await Preferences.get({ key: claveNivel });
      if (value !== 'completado') {
        setSalidaPendiente(ruta);
        return;
      }
    }

    navigate(ruta);
  };

  const handleBack = async () => {
    const path = location.pathname;
    if (path.startsWith('/numeros/bloque/')) {
      await solicitarNavegacion('/numeros');
      return;
    }
    if (path.startsWith('/bloque/')) {
      await solicitarNavegacion('/abecedario');
      return;
    }
    if (path === '/abecedario' || path === '/numeros' || path === '/practica') {
      await solicitarNavegacion('/menu');
      return;
    }
    await solicitarNavegacion('/menu');
  };

  const cssVars = {
    '--app-background': theme.fondo,
    '--header-background': theme.barra,
    '--app-text': theme.texto,
    '--app-muted': theme.texto2,
    '--app-icon': theme.icono || theme.texto,
    '--app-card': theme.tarjeta,
    '--app-card-text': theme.tarjetaTexto || theme.texto,
    '--app-border': theme.borde,
    '--app-primary': theme.boton2,
    '--app-accent': theme.boton1,
    '--app-success': theme.correcto,
    '--app-soft': theme.gris,
  };

  return (
    <div className={styles.layout} style={cssVars}>
      <header className={styles.header}>
        <span className={styles.headerGlow} aria-hidden="true" />

        <div className={styles.actionsLeft}>
          {mostrarBotonAtras && (
            <button type="button" className={styles.button} onClick={handleBack} aria-label="Regresar" title="Regresar">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.brand}>
          <img src={logo} alt="Logo de Kinesseña" className={styles.logo} />
          <div className={styles.info}>
            <span className={styles.title}>Kinesseña</span>
            <span className={styles.user}>
              {nombre ? `Hola, ${nombre}` : 'Aprendiz'}
            </span>
          </div>
        </div>

        <div className={styles.actionsRight}>
          <button type="button" className={styles.button} onClick={() => setMenuAbierto(true)} aria-label="Abrir menú lateral" title="Abrir menú">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {menuAbierto && (
        <>
          <div className={styles.overlay} onClick={() => setMenuAbierto(false)} aria-hidden="true" />
          <aside className={styles.drawer} aria-label="Menú principal">
            <div className={styles.drawerTopBar}>
              <div className={styles.drawerBrand}>
                <img src={logo} alt="" className={styles.drawerLogo} />
                <span>Kinesseña</span>
              </div>
              <button
                className={styles.iconButton}
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className={styles.drawerContent}>
              <div className={styles.profile}>
                <span className={styles.avatar} aria-hidden="true">
                  {nombre ? nombre.trim().charAt(0).toUpperCase() : 'A'}
                </span>
                <div>
                  <span className={styles.profileGreeting}>Hola,</span>
                  <strong>{nombre || 'Aprendiz'}</strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.themeControl}
                onClick={toggleModo}
                aria-label={modo === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                <span className={styles.themeIcon}>
                  {modo === 'claro' ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                    </svg>
                  )}
                </span>
                <span>
                  <strong>{modo === 'claro' ? 'Modo oscuro' : 'Modo claro'}</strong>
                  <small>Cambiar apariencia</small>
                </span>
                <span className={styles.themeSwitch} aria-hidden="true">
                  <span />
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {salidaPendiente && (
        <div className={styles.confirmOverlay}>
          <div
            className={styles.confirmDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-salida"
            aria-describedby="mensaje-salida"
          >
            <span className={styles.confirmIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3 2.8 19h18.4z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </span>
            <h2 id="titulo-salida">¿Quieres salir del nivel?</h2>
            <p id="mensaje-salida">
              Tu avance de este nivel todavía no se ha guardado. Si sales ahora,
              tendrás que comenzarlo de nuevo.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.stayButton}
                onClick={() => setSalidaPendiente(null)}
                autoFocus
              >
                Seguir aprendiendo
              </button>
              <button
                type="button"
                className={styles.exitButton}
                onClick={() => {
                  const destino = salidaPendiente;
                  setSalidaPendiente(null);
                  navigate(destino);
                }}
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
