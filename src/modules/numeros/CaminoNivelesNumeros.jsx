import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from '../abecedario/styles/CaminoNiveles.module.css';
import { obtenerModuloNumeros } from '../../data/numeros';

const CaminoNivelesNumeros = () => {
  const { idBloque } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const modulo = obtenerModuloNumeros(idBloque);
  const totalNiveles = modulo?.niveles || 0;
  const [estadoNiveles, setEstadoNiveles] = useState([]);

  useEffect(() => {
    const cargarProgreso = async () => {
      const niveles = [];
      for (let i = 1; i <= totalNiveles; i++) {
        const key = `progreso_numeros_bloque_${idBloque}_nivel${i}`;
        const { value } = await Preferences.get({ key });
        niveles.push(value === 'completado');
      }
      setEstadoNiveles(niveles);
    };
    cargarProgreso();
  }, [idBloque, totalNiveles]);

  if (!modulo) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p>Módulo no disponible.</p>
        <button type="button" onClick={() => navigate('/numeros')}>Volver a números</button>
      </div>
    );
  }

  const nivelDesbloqueado = (nivelIndex) => {
    if (nivelIndex === 0) return true;
    return estadoNiveles[nivelIndex - 1];
  };

  const irANivel = (nivel) => {
    if (!nivelDesbloqueado(nivel - 1)) return;
    navigate(`/numeros/bloque/${idBloque}/nivel${nivel}`);
  };

  const niveles = [
    {
      nivel: 1,
      label: 'Demostración',
      descripcion: 'Conoce las señas numéricas',
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
      descripcion: 'Reconoce cada número',
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
          <span className={styles.eyebrow}>Números · Módulo {idBloque}</span>
          <h1 className={styles.title}>Continúa tu camino</h1>
          <p className={styles.letters}>
            Aprende los números <strong>{modulo.numeros.map(({ numero }) => numero).join(' · ')}</strong>
          </p>
        </div>

        <div className={styles.progressBadge} aria-label={`${completados} de ${totalNiveles} niveles completados`}>
          <span className={styles.progressNumber}>{completados}/{totalNiveles}</span>
          <span className={styles.progressLabel}>completados</span>
        </div>
      </div>

      <div className={styles.path} aria-label="Camino de niveles de números">
        {niveles.map((item, idx) => {
          const completado = estadoNiveles[idx];
          const desbloqueado = nivelDesbloqueado(idx);
          const esActual = idx === siguienteNivel && desbloqueado;
          const estado = completado ? 'Completado' : desbloqueado ? 'Disponible' : 'Bloqueado';

          return (
            <div
              key={item.nivel}
              className={`${styles.step} ${idx % 2 === 0 ? styles.stepLeft : styles.stepRight}`}
            >
              {idx < niveles.length - 1 && (
                <span
                  className={`${styles.connector} ${estadoNiveles[idx] ? styles.connectorComplete : ''}`}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => irANivel(item.nivel)}
                disabled={!desbloqueado}
                className={`${styles.levelButton} ${
                  completado
                    ? styles.levelComplete
                    : desbloqueado
                      ? styles.levelAvailable
                      : styles.levelLocked
                } ${esActual ? styles.levelCurrent : ''}`}
                aria-label={`Nivel ${item.nivel}: ${item.label}. ${estado}`}
              >
                <span className={styles.levelInner}>
                  {completado ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m5 12 4.5 4.5L19 7" />
                    </svg>
                  ) : desbloqueado ? (
                    item.icono
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  )}
                </span>
              </button>

              <div className={styles.stepInfo}>
                <span className={styles.levelNumber}>Nivel {item.nivel}</span>
                <h2>{item.label}</h2>
                <p>{item.descripcion}</p>
                <span className={`${styles.status} ${
                  completado
                    ? styles.statusComplete
                    : desbloqueado
                      ? styles.statusAvailable
                      : styles.statusLocked
                }`}>
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

export default CaminoNivelesNumeros;
