import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Layout = () => {
  const [nombre, setNombre] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const { modo, theme, toggleModo } = useTheme();

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const { value } = await Preferences.get({ key: 'nombre' });

        if (value) {
          setNombre(value);
        }
      } catch (error) {
        console.error('Error al obtener el nombre:', error);
      }
    };

    cargarNombre();
  }, []);

  // Rutas donde no debe mostrarse el botón de retroceso
  const esNivel =
    location.pathname.includes('/nivel1') ||
    location.pathname.includes('/nivel2') ||
    location.pathname.includes('/nivel3');

  const esInicio = location.pathname === '/';
  const esMenu = location.pathname === '/menu';

  const mostrarBotonAtras = !esNivel && !esInicio && !esMenu;

  const handleBack = () => {
    const path = location.pathname;

    if (path.startsWith('/bloque-numeros/')) {
      navigate('/numeros');
      return;
    }

    if (path.startsWith('/bloque/')) {
      navigate('/abecedario');
      return;
    }

    if (
      path === '/abecedario' ||
      path === '/numeros' ||
      path === '/practica'
    ) {
      navigate('/menu');
      return;
    }

    navigate('/menu');
  };

  return (
    <>
      {/* Estilos del componente dentro del mismo archivo */}
      <style>
        {`
          .app-layout {
            --header-height: 110px;

            min-height: 100vh;
            width: 100%;
            background-color: var(--app-background);
            color: var(--app-text);
          }

          /* Encabezado siempre visible */
          .app-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;

            z-index: 1000;

            height: calc(
              var(--header-height) + env(safe-area-inset-top, 0px)
            );

            padding:
              env(safe-area-inset-top, 0px)
              clamp(12px, 3vw, 30px)
              0;

            box-sizing: border-box;

            display: grid;
            grid-template-columns:
              minmax(90px, 1fr)
              minmax(0, auto)
              minmax(90px, 1fr);

            align-items: center;

            background-color: var(--header-background);
            color: var(--app-text);

            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.16);
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .header-actions-left {
            justify-self: start;
          }

          .header-actions-right {
            justify-self: end;
          }

          .header-button {
            width: 44px;
            height: 44px;

            padding: 9px;
            border: none;
            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            color: var(--app-icon);
            background-color: transparent;

            cursor: pointer;

            transition:
              background-color 0.2s ease,
              transform 0.15s ease;
          }

          .header-button:hover {
            background-color: rgba(255, 255, 255, 0.14);
          }

          .header-button:active {
            transform: scale(0.92);
          }

          .header-button:focus-visible {
            outline: 3px solid currentColor;
            outline-offset: 2px;
          }

          .header-button svg {
            width: 25px;
            height: 25px;

            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          /* Información central */
          .header-brand {
            min-width: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            gap: clamp(7px, 1.5vw, 14px);

            text-align: center;
          }

          .header-logo {
            width: auto;
            height: clamp(52px, 6vw, 72px);

            flex-shrink: 0;
            object-fit: contain;
          }

          .header-information {
            min-width: 0;

            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .header-title {
            font-size: clamp(2rem, 4.4vw, 3.125rem);
            font-weight: 700;
            line-height: 1.05;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .header-user {
            margin-top: 3px;

            font-size: clamp(0.75rem, 1.5vw, 0.9rem);
            line-height: 1.2;

            color: var(--app-text);
            opacity: 0.85;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* Espacio superior para evitar que el encabezado cubra el contenido */
          .app-main {
            min-height: 100vh;
            box-sizing: border-box;

            padding-top: calc(
              var(--header-height) +
              env(safe-area-inset-top, 0px) +
              clamp(12px, 2vw, 24px)
            );

            padding-right: clamp(12px, 3vw, 30px);

            padding-bottom: calc(
              clamp(16px, 3vw, 32px) +
              env(safe-area-inset-bottom, 0px)
            );

            padding-left: clamp(12px, 3vw, 30px);

            background-color: var(--app-background);
          }

          /* Tablets */
          @media (max-width: 900px) {
            .app-layout {
              --header-height: 96px;
            }

            .app-header {
              grid-template-columns:
                minmax(85px, 1fr)
                minmax(0, auto)
                minmax(85px, 1fr);
            }

            .header-logo {
              height: 56px;
            }

            .header-title {
              font-size: clamp(1.8rem, 5vw, 2.5rem);
            }
          }

          /* Teléfonos */
          @media (max-width: 600px) {
            .app-layout {
              --header-height: 80px;
            }

            .app-header {
              padding-left: 8px;
              padding-right: 8px;

              grid-template-columns:
                minmax(76px, 1fr)
                minmax(0, auto)
                minmax(44px, 1fr);
            }

            .header-actions {
              gap: 0;
            }

            .header-button {
              width: 38px;
              height: 38px;
              padding: 8px;
            }

            .header-button svg {
              width: 22px;
              height: 22px;
            }

            .header-brand {
              gap: 6px;
            }

            .header-logo {
              height: 45px;
            }

            .header-title {
              font-size: clamp(1.35rem, 7vw, 1.9rem);
            }

            .header-user {
              max-width: 130px;
              font-size: 0.72rem;
            }
          }

          /* Teléfonos pequeños */
          @media (max-width: 400px) {
            .app-header {
              grid-template-columns:
                minmax(70px, 1fr)
                minmax(0, auto)
                minmax(38px, 1fr);
            }

            .header-logo {
              height: 38px;
            }

            .header-title {
              font-size: 1.25rem;
            }

            .header-user {
              max-width: 100px;
              font-size: 0.68rem;
            }

            .header-button {
              width: 34px;
              height: 34px;
              padding: 7px;
            }

            .header-button svg {
              width: 20px;
              height: 20px;
            }
          }

          /* Pantallas muy anchas */
          @media (min-width: 1400px) {
            .app-layout {
              --header-height: 120px;
            }

            .header-logo {
              height: 80px;
            }

            .header-title {
              font-size: 3.4rem;
            }

            .app-main {
              padding-left: 45px;
              padding-right: 45px;
            }
          }

          /* Orientación horizontal en teléfonos */
          @media (max-height: 500px) and (orientation: landscape) {
            .app-layout {
              --header-height: 64px;
            }

            .header-logo {
              height: 38px;
            }

            .header-title {
              font-size: 1.35rem;
            }

            .header-user {
              font-size: 0.68rem;
            }

            .header-button {
              width: 36px;
              height: 36px;
            }
          }
        `}
      </style>

      <div
        className="app-layout"
        style={{
          '--app-background': theme.fondo,
          '--header-background': theme.barra,
          '--app-text': theme.texto,
          '--app-icon': theme.icono
        }}
      >
        {/* Encabezado fijo */}
        <header className="app-header">
          {/* Botones izquierdos */}
          <div className="header-actions header-actions-left">
            {mostrarBotonAtras && (
              <button
                type="button"
                className="header-button"
                onClick={handleBack}
                aria-label="Regresar"
                title="Regresar"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="header-button"
              onClick={toggleModo}
              aria-label={
                modo === 'claro'
                  ? 'Cambiar a modo oscuro'
                  : 'Cambiar a modo claro'
              }
              title={
                modo === 'claro'
                  ? 'Cambiar a modo oscuro'
                  : 'Cambiar a modo claro'
              }
            >
              {modo === 'claro' ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line
                    x1="18.36"
                    y1="18.36"
                    x2="19.78"
                    y2="19.78"
                  />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line
                    x1="4.22"
                    y1="19.78"
                    x2="5.64"
                    y2="18.36"
                  />
                  <line
                    x1="18.36"
                    y1="5.64"
                    x2="19.78"
                    y2="4.22"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo, nombre de la aplicación y usuario */}
          <div className="header-brand">
            <img
              src={logo}
              alt="Logo de Kinesseña"
              className="header-logo"
            />

            <div className="header-information">
              <span className="header-title">
                Kinesseña
              </span>

              <span className="header-user">
                {nombre ? `Hola, ${nombre}` : 'Aprendiz'}
              </span>
            </div>
          </div>

          {/* Botón derecho */}
          <div className="header-actions header-actions-right">
            <button
              type="button"
              className="header-button"
              onClick={() => alert('Menú lateral próximamente')}
              aria-label="Abrir menú lateral"
              title="Abrir menú"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Contenido de las rutas */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;