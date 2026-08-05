import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { obtenerModuloComunicacion } from '../../data/comunicacionBasica';
import styles from '../abecedario/styles/CaminoNiveles.module.css';

const niveles = [
  { nivel: 1, label: 'Demostración', descripcion: 'Observa cada seña en contexto' },
  { nivel: 2, label: 'Ejercicios', descripcion: 'Reconoce las expresiones aprendidas' },
];

const CaminoNivelesComunicacion = () => {
  const { idModulo } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const modulo = obtenerModuloComunicacion(idModulo);
  const [completados, setCompletados] = useState([false, false]);

  useEffect(() => {
    Promise.all([1, 2].map((nivel) => Preferences.get({ key: `progreso_comunicacion_modulo_${idModulo}_nivel${nivel}` })))
      .then((resultados) => setCompletados(resultados.map(({ value }) => value === 'completado')));
  }, [idModulo]);

  if (!modulo) return <div><p>Módulo no disponible.</p><button onClick={() => navigate('/comunicacion')}>Volver</button></div>;
  const siguiente = completados.findIndex((valor) => !valor);
  const cssVars = {
    '--path-card': theme.tarjeta, '--path-text': theme.tarjetaTexto || theme.texto,
    '--path-muted': theme.texto2, '--path-border': theme.borde, '--path-primary': theme.boton2,
    '--path-primary-shadow': '#24a997', '--path-accent': theme.boton1, '--path-accent-shadow': '#d5ad00',
    '--path-complete': theme.correcto, '--path-complete-shadow': '#087f5b', '--path-locked': theme.gris,
    '--path-icon': theme.icono || theme.texto,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <div className={styles.summary}><div className={styles.summaryText}><span className={styles.eyebrow}>Comunicación básica · Módulo {idModulo}</span><h1 className={styles.title}>{modulo.nombre}</h1><p className={styles.letters}><strong>{modulo.expresiones.map(({ texto }) => texto).join(' · ')}</strong></p></div><div className={styles.progressBadge}><span className={styles.progressNumber}>{completados.filter(Boolean).length}/2</span><span className={styles.progressLabel}>completados</span></div></div>
      <div className={styles.path} aria-label="Camino de aprendizaje de comunicación básica">
        {niveles.map((item, indice) => {
          const disponible = indice === 0 || completados[indice - 1];
          const terminado = completados[indice];
          const estado = terminado ? 'Completado' : disponible ? 'Disponible' : 'Bloqueado';
          return <div key={item.nivel} className={`${styles.step} ${indice % 2 === 0 ? styles.stepLeft : styles.stepRight}`}>
            {indice === 0 && <span className={`${styles.connector} ${terminado ? styles.connectorComplete : ''}`} aria-hidden="true" />}
            <button type="button" disabled={!disponible} onClick={() => navigate(`/comunicacion/modulo/${idModulo}/nivel${item.nivel}`)} className={`${styles.levelButton} ${terminado ? styles.levelComplete : disponible ? styles.levelAvailable : styles.levelLocked} ${indice === siguiente && disponible ? styles.levelCurrent : ''}`}><span className={styles.levelInner}>{terminado ? <svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7" /></svg> : disponible ? <svg viewBox="0 0 24 24"><path d={item.nivel === 1 ? 'M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z' : 'm9 11 2 2 4-5 M19 13a7 7 0 1 1-2.05-4.95'} /></svg> : <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>}</span></button>
            <div className={styles.stepInfo}><span className={styles.levelNumber}>Nivel {item.nivel}</span><h2>{item.label}</h2><p>{item.descripcion}</p><span className={`${styles.status} ${terminado ? styles.statusComplete : disponible ? styles.statusAvailable : styles.statusLocked}`}>{estado}</span></div>
          </div>;
        })}
      </div>
    </section>
  );
};

export default CaminoNivelesComunicacion;
