import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const modulos = [
  {
    nombre: 'Abecedario',
    color: '#FF7043',
    icono: '/assets/menu/icono-abecedario.png',
    ruta: '/abecedario'
  },
  {
    nombre: 'Números',
    color: '#42A5F5',
    icono: '/assets/menu/icono-numeros.png',
    ruta: '/numeros'
  },
  {
    nombre: 'Saludos y cortesía',
    color: '#66BB6A',
    icono: '/assets/menu/icono-saludos.png',
    ruta: '/leccion/saludos'
  },
  {
    nombre: 'Comunicación básica',
    color: '#AB47BC',
    icono: '/assets/menu/icono-comunicacion.png',
    ruta: '/leccion/comunicacion'
  }
];

const Menu = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [animandoIdx, setAnimandoIdx] = useState(null);
  const temporizadorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current);
      }
    };
  }, []);

  const manejarClick = (ruta, idx) => {
    if (animandoIdx !== null) return;

    setAnimandoIdx(idx);

    temporizadorRef.current = setTimeout(() => {
      navigate(ruta);
    }, 150);
  };

  const manejarErrorImagen = (event) => {
    event.currentTarget.style.display = 'none';
  };

  return (
    <>
      <style>
        {`
          .menu-page {
            width: 100%;
            max-width: 1300px;
            margin: 0 auto;
            padding: clamp(6px, 1.5vw, 20px);
            box-sizing: border-box;
          }

          .menu-grid {
            width: 100%;

            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));

            gap: clamp(14px, 2vw, 24px);
          }

          .menu-card {
            position: relative;

            width: 100%;
            min-width: 0;
            aspect-ratio: 1 / 1;

            padding: clamp(12px, 2vw, 22px);

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            gap: clamp(8px, 1vw, 14px);

            border-width: 3px;
            border-style: solid;
            border-radius: clamp(16px, 2vw, 24px);

            background-color: var(--menu-card-background);
            color: var(--menu-card-text);

            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

            text-align: center;
            font-family: inherit;
            font-weight: 700;

            cursor: pointer;
            overflow: hidden;

            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease,
              filter 0.15s ease;
          }

          .menu-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
          }

          .menu-card:active,
          .menu-card.menu-card--active {
            transform: scale(0.95);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
          }

          .menu-card:focus-visible {
            outline: 4px solid var(--menu-card-border);
            outline-offset: 4px;
          }

          .menu-card:disabled {
            cursor: default;
          }

          .menu-card-image {
            width: clamp(95px, 65%, 210px);
            height: clamp(95px, 65%, 210px);

            max-width: 70%;
            max-height: 70%;

            object-fit: contain;
            flex-shrink: 1;

            pointer-events: none;
            user-select: none;
          }

          .menu-card-title {
            width: 100%;

            font-size: clamp(1rem, 1.7vw, 1.35rem);
            line-height: 1.2;

            overflow-wrap: break-word;
          }

          /*
           * Pantallas medianas y tablets.
           * Se muestran dos tarjetas por fila.
           */
          @media (max-width: 1000px) {
            .menu-page {
              max-width: 850px;
            }

            .menu-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .menu-card-image {
              width: clamp(125px, 55%, 210px);
              height: clamp(125px, 55%, 210px);
            }

            .menu-card-title {
              font-size: clamp(1.05rem, 3vw, 1.3rem);
            }
          }

          /*
           * Teléfonos.
           * Se mantienen dos columnas, pero con espacios y elementos menores.
           */
          @media (max-width: 600px) {
            .menu-page {
              padding: 6px 2px 16px;
            }

            .menu-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: clamp(10px, 3vw, 16px);
            }

            .menu-card {
              border-width: 2px;
              border-radius: 16px;
              padding: clamp(8px, 3vw, 14px);
            }

            .menu-card-image {
              width: clamp(75px, 62%, 130px);
              height: clamp(75px, 62%, 130px);
              max-width: 68%;
              max-height: 68%;
            }

            .menu-card-title {
              font-size: clamp(0.82rem, 4vw, 1rem);
            }
          }

          /*
           * Teléfonos muy pequeños.
           * Una sola columna para evitar tarjetas demasiado estrechas.
           */
          @media (max-width: 340px) {
            .menu-page {
              max-width: 280px;
            }

            .menu-grid {
              grid-template-columns: 1fr;
            }

            .menu-card-image {
              width: clamp(110px, 58%, 160px);
              height: clamp(110px, 58%, 160px);
            }

            .menu-card-title {
              font-size: 1rem;
            }
          }

          /*
           * Teléfonos colocados horizontalmente.
           * Se aprovecha el ancho mostrando cuatro tarjetas.
           */
          @media (
            min-width: 600px
          ) and (
            max-height: 500px
          ) and (
            orientation: landscape
          ) {
            .menu-page {
              max-width: 1100px;
              padding: 4px 8px 12px;
            }

            .menu-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 12px;
            }

            .menu-card {
              padding: 8px;
              border-radius: 14px;
            }

            .menu-card-image {
              width: clamp(70px, 55%, 120px);
              height: clamp(70px, 55%, 120px);
            }

            .menu-card-title {
              font-size: clamp(0.75rem, 1.6vw, 0.95rem);
            }
          }

          /*
           * En dispositivos táctiles se elimina el hover,
           * porque puede quedarse visualmente activado.
           */
          @media (hover: none) {
            .menu-card:hover {
              transform: none;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .menu-card:active,
            .menu-card.menu-card--active {
              transform: scale(0.95);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
            }
          }

          /*
           * Respeta la configuración del dispositivo para reducir animaciones.
           */
          @media (prefers-reduced-motion: reduce) {
            .menu-card {
              transition: none;
            }
          }
        `}
      </style>

      <section
        className="menu-page"
        style={{
          '--menu-card-background': theme.tarjeta,
          '--menu-card-text': theme.tarjetaTexto
        }}
        aria-label="Módulos de aprendizaje"
      >
        <div className="menu-grid">
          {modulos.map((mod, idx) => {
            const estaAnimando = animandoIdx === idx;

            return (
              <button
                key={mod.ruta}
                type="button"
                className={`menu-card ${
                  estaAnimando ? 'menu-card--active' : ''
                }`}
                style={{
                  '--menu-card-border': mod.color,
                  borderColor: mod.color
                }}
                onClick={() => manejarClick(mod.ruta, idx)}
                disabled={animandoIdx !== null}
                aria-label={`Abrir módulo ${mod.nombre}`}
              >
                <img
                  src={mod.icono}
                  alt=""
                  className="menu-card-image"
                  onError={manejarErrorImagen}
                  draggable="false"
                />

                <span className="menu-card-title">
                  {mod.nombre}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Menu;