import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles/ActividadesAbecedario.module.css';

const actividades = [
  { id: 'relacionar', numero: 1, titulo: 'Relaciona las señas', descripcion: 'Une cada seña con la letra que representa.', icono: '↔', tono: 'turquesa', detalle: 'Asociación visual' },
  { id: 'deletreo', numero: 2, titulo: 'Deletreo de palabras', descripcion: 'Ordena las señas para formar cada palabra.', icono: 'ABC', tono: 'amarillo', detalle: 'Orden y vocabulario' },
  { id: 'memorama', numero: 3, titulo: 'Memorama de señas', descripcion: 'Encuentra las parejas entre señas y letras.', icono: '2×', tono: 'verde', detalle: 'Memoria y atención' },
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
        <div><span>Práctica general</span><h1>Refuerza el abecedario</h1><p>Elige cualquier actividad y practica a tu ritmo.</p></div>
        <strong>{completadas.length}/3</strong>
      </header>

      <div className={styles.activityGrid}>
        {actividades.map((actividad) => {
          const completada = completadas.includes(actividad.id);
          return (
            <button
              key={actividad.id}
              type="button"
              className={`${styles.activity} ${styles[actividad.tono]} ${completada ? styles.completed : ''}`}
              onClick={() => navigate(`/abecedario/actividades/${actividad.id}`)}
            >
              <span className={styles.cardTop}>
                <span className={styles.activityNumber}>Actividad {actividad.numero}</span>
                <span className={styles.completion}>{completada ? '✓ Completada' : 'Disponible'}</span>
              </span>
              <span className={styles.node}>{actividad.icono}</span>
              <span className={styles.copy}>
                <small>{actividad.detalle}</small>
                <strong>{actividad.titulo}</strong>
                <span>{actividad.descripcion}</span>
              </span>
              <span className={styles.cardAction}>{completada ? 'Practicar otra vez' : 'Comenzar'}<span aria-hidden="true">→</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ActividadesAbecedario;
