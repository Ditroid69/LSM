import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/ActividadesAbecedario.module.css';

const actividades = [
  { id: 'relacionar', numero: 1, titulo: 'Relaciona las señas', descripcion: 'Une cada seña con la letra que representa.', icono: '↔' },
  { id: 'deletreo', numero: 2, titulo: 'Deletreo de palabras', descripcion: 'Ordena las señas para formar cada palabra.', icono: 'ABC' },
];

const ActividadesAbecedario = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [completadas, setCompletadas] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const estados = await Promise.all(actividades.map(({ id }) =>
        Preferences.get({ key: `progreso_abecedario_actividad_${id}` })));
      setCompletadas(actividades.filter((_, i) => estados[i].value === 'completado').map(({ id }) => id));
    };
    cargar();
  }, []);

  const cssVars = {
    '--activity-card': theme.tarjeta,
    '--activity-text': theme.tarjetaTexto || theme.texto,
    '--activity-muted': theme.texto2,
    '--activity-border': theme.borde,
    '--activity-primary': theme.boton2,
    '--activity-accent': theme.boton1,
    '--activity-success': theme.correcto,
    '--activity-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.hero}>
        <span className={styles.heroIcon}>✦</span>
        <div><span>Práctica general</span><h1>Refuerza el abecedario</h1><p>Combina lo aprendido en todos los módulos.</p></div>
        <strong>{completadas.length}/2</strong>
      </header>

      <div className={styles.path}>
        <span className={styles.pathLine} aria-hidden="true" />
        {actividades.map((actividad, indice) => {
          const completada = completadas.includes(actividad.id);
          const bloqueada = indice > 0 && !completadas.includes(actividades[indice - 1].id);
          return (
            <button
              key={actividad.id}
              type="button"
              className={`${styles.activity} ${completada ? styles.completed : ''} ${bloqueada ? styles.locked : ''}`}
              onClick={() => !bloqueada && navigate(`/abecedario/actividades/${actividad.id}`)}
              disabled={bloqueada}
            >
              <span className={styles.node}>{bloqueada ? '🔒' : actividad.icono}</span>
              <span className={styles.copy}>
                <small>Actividad {actividad.numero}</small>
                <strong>{actividad.titulo}</strong>
                <span>{bloqueada ? 'Completa la actividad anterior' : actividad.descripcion}</span>
              </span>
              <span className={styles.status}>{completada ? '✓' : '›'}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ActividadesAbecedario;
