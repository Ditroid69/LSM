import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/CaminoNiveles.module.css';

const bloques = {
  1: { letras: ['A','E','S','T','O'] },
  2: { letras: ['B','C','D','F','U'] },
  3: { letras: ['I','P','V','W'] },
  4: { letras: ['L','M','N','R'] },
  5: { letras: ['G','H','X','Y'] },
  6: { letras: ['K','Ñ','Z','Q'], niveles: 2 }
};

const CaminoNiveles = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [estadoNiveles, setEstadoNiveles] = useState([]);
  const bloque = bloques[idBloque];
  const totalNiveles = bloque?.niveles || 3;

  useEffect(() => {
    const cargarProgreso = async () => {
      const niveles = [];
      for (let i = 1; i <= totalNiveles; i++) {
        const key = `progreso_bloque_${idBloque}_nivel${i}`;
        const { value } = await Preferences.get({ key });
        niveles.push(value === 'completado');
      }
      setEstadoNiveles(niveles);
    };
    cargarProgreso();
  }, [idBloque, totalNiveles]);

  if (!bloque) return <p>Bloque no encontrado</p>;

  const nivelDesbloqueado = (nivelIndex) => {
    if (nivelIndex === 0) return true; // nivel 1 siempre disponible
    return estadoNiveles[nivelIndex - 1]; // necesita el anterior completado
  };

  const irANivel = (nivel) => {
    if (!nivelDesbloqueado(nivel - 1)) return;
    // Navegar según nivel
    if (nivel === 1) navigate(`/bloque/${idBloque}/nivel1`);
    else if (nivel === 2) navigate(`/bloque/${idBloque}/nivel2`);
    else if (nivel === 3) navigate(`/bloque/${idBloque}/nivel3`);
  };

  const burbujas = [
    {
      nivel: 1,
      label: 'Demostración',
      descripcion: 'Conoce las señas',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
        </svg>
      )
    },
    {
      nivel: 2,
      label: 'Ejercicio',
      descripcion: 'Pon a prueba lo aprendido',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 11 2 2 4-5" />
          <path d="M19 13a7 7 0 1 1-2.05-4.95" />
        </svg>
      )
    },
    {
      nivel: 3,
      label: 'Práctica',
      descripcion: 'Practica con la cámara',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.5 5 13 3h-2L9.5 5H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z" />
          <circle cx="12" cy="12.5" r="3.5" />
        </svg>
      )
    }
  ].slice(0, totalNiveles);

  const completados = estadoNiveles.filter(Boolean).length;
  const siguienteNivel = estadoNiveles.findIndex((completado) => !completado);
  const cssVars = {
    '--path-card': theme.tarjeta,
    '--path-text': theme.tarjetaTexto || theme.texto,
    '--path-muted': theme.texto2,
    '--path-border': theme.borde,
    '--path-primary': theme.boton2,
    '--path-primary-shadow': '#24a997',
    '--path-accent': theme.boton1,
    '--path-accent-shadow': '#d5ad00',
    '--path-complete': theme.correcto,
    '--path-complete-shadow': '#087f5b',
    '--path-locked': theme.gris,
    '--path-icon': theme.icono || theme.texto,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <div className={styles.summary}>
        <div className={styles.summaryText}>
          <span className={styles.eyebrow}>Abecedario · Bloque {idBloque}</span>
          <h1 className={styles.title}>Continúa tu camino</h1>
          <p className={styles.letters}>
            Aprende las letras <strong>{bloque.letras.join(' · ')}</strong>
          </p>
        </div>

        <div
          className={styles.progressBadge}
          aria-label={`${completados} de ${totalNiveles} niveles completados`}
        >
          <span className={styles.progressNumber}>{completados}/{totalNiveles}</span>
          <span className={styles.progressLabel}>completados</span>
        </div>
      </div>

      <div className={styles.path} aria-label="Camino de niveles">
        {burbujas.map((b, idx) => {
          const completado = estadoNiveles[idx];
          const desbloqueado = nivelDesbloqueado(idx);
          const esActual = idx === siguienteNivel && desbloqueado;
          const estado = completado
            ? 'Completado'
            : desbloqueado
              ? 'Disponible'
              : 'Bloqueado';

          return (
            <div
              key={b.nivel}
              className={`${styles.step} ${idx % 2 === 0 ? styles.stepLeft : styles.stepRight}`}
            >
              {idx < burbujas.length - 1 && (
                <span
                  className={`${styles.connector} ${
                    estadoNiveles[idx] ? styles.connectorComplete : ''
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => irANivel(b.nivel)}
                disabled={!desbloqueado}
                className={`${styles.levelButton} ${
                  completado
                    ? styles.levelComplete
                    : desbloqueado
                      ? styles.levelAvailable
                      : styles.levelLocked
                } ${esActual ? styles.levelCurrent : ''}`}
                aria-label={`Nivel ${b.nivel}: ${b.label}. ${estado}`}
              >
                <span className={styles.levelInner}>
                  {completado ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m5 12 4.5 4.5L19 7" />
                    </svg>
                  ) : desbloqueado ? (
                    b.icono
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  )}
                </span>
              </button>

              <div className={styles.stepInfo}>
                <span className={styles.levelNumber}>Nivel {b.nivel}</span>
                <h2>{b.label}</h2>
                <p>{b.descripcion}</p>
                <span
                  className={`${styles.status} ${
                    completado
                      ? styles.statusComplete
                      : desbloqueado
                        ? styles.statusAvailable
                        : styles.statusLocked
                  }`}
                >
                  {estado}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CaminoNiveles;
