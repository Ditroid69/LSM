import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { imagenDeLetra, letrasAbecedario, mezclar } from '../../data/actividadesAbecedario';
import styles from './styles/PracticaActividades.module.css';

const TAMANO_RONDA = 3;

const RelacionarSenas = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [orden] = useState(() => mezclar(letrasAbecedario));
  const [ronda, setRonda] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [aciertos, setAciertos] = useState([]);
  const [estado, setEstado] = useState('');
  const totalRondas = Math.ceil(orden.length / TAMANO_RONDA);
  const grupo = useMemo(() => orden.slice(ronda * TAMANO_RONDA, (ronda + 1) * TAMANO_RONDA), [orden, ronda]);
  const opciones = useMemo(() => mezclar(grupo), [grupo]);
  const rondaCompleta = aciertos.length === grupo.length;

  const elegirSigno = (letra) => {
    if (aciertos.includes(letra)) return;
    setSeleccionada(letra);
    setEstado('seleccion');
  };

  const elegirLetra = (letra) => {
    if (!seleccionada || aciertos.includes(letra)) return;
    if (seleccionada === letra) {
      setAciertos((actuales) => [...actuales, letra]);
      setEstado('correcto');
    } else {
      setEstado('error');
    }
    setSeleccionada(null);
  };

  const continuar = async () => {
    if (ronda + 1 < totalRondas) {
      setRonda((actual) => actual + 1);
      setAciertos([]);
      setEstado('');
      return;
    }
    await Preferences.set({ key: 'progreso_abecedario_actividad_relacionar', value: 'completado' });
    navigate('/abecedario/actividades', { replace: true });
  };

  const cssVars = {
    '--practice-card': theme.tarjeta, '--practice-text': theme.tarjetaTexto || theme.texto,
    '--practice-muted': theme.texto2, '--practice-border': theme.borde,
    '--practice-primary': theme.boton2, '--practice-accent': theme.boton1,
    '--practice-success': theme.correcto, '--practice-error': theme.incorrecto,
    '--practice-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.top}>
        <div><small>Actividad 1</small><h1>Relaciona la seña</h1></div>
        <span>Ronda {ronda + 1} de {totalRondas}</span>
        <div className={styles.progress}><i style={{ width: `${((ronda * TAMANO_RONDA + aciertos.length) / orden.length) * 100}%` }} /></div>
      </header>

      <div className={`${styles.feedback} ${styles.feedbackTop} ${estado === 'error' ? styles.feedbackError : ''} ${estado === 'correcto' || rondaCompleta ? styles.feedbackSuccess : ''}`} aria-live="polite">
        <span className={styles.feedbackIcon}>{estado === 'error' ? '×' : estado === 'correcto' || rondaCompleta ? '✓' : 'i'}</span>
        <span><strong>{rondaCompleta ? '¡Grupo completado!' : estado === 'error' ? 'Respuesta incorrecta' : estado === 'correcto' ? '¡Muy bien!' : seleccionada ? 'Seña seleccionada' : '¿Cómo jugar?'}</strong><small>{rondaCompleta ? 'Relacionaste correctamente todas las señas.' : estado === 'error' ? 'Esa letra no corresponde. Vuelve a intentarlo.' : estado === 'correcto' ? 'La seña y la letra son correctas.' : seleccionada ? 'Ahora toca la letra que representa.' : 'Toca una imagen y después la letra que representa.'}</small></span>
      </div>
      <div className={styles.boardLabels}><span>Señas</span><span>Letras</span></div>
      <div className={styles.matchBoard}>
        <div className={styles.column} aria-label="Señas">
          {grupo.map((letra) => (
            <button key={letra} className={`${styles.signCard} ${seleccionada === letra ? styles.selected : ''} ${aciertos.includes(letra) ? styles.matched : ''}`} onClick={() => elegirSigno(letra)} disabled={aciertos.includes(letra)}>
              <img src={imagenDeLetra(letra)} alt={`Seña por relacionar`} onError={(evento) => { evento.currentTarget.hidden = true; evento.currentTarget.nextElementSibling.hidden = false; }} />
              <span className={styles.imageFallback} hidden>?</span>
              {aciertos.includes(letra) && <i>✓</i>}
            </button>
          ))}
        </div>
        <div className={styles.column} aria-label="Letras">
          {opciones.map((letra) => (
            <button key={letra} className={`${styles.letterOption} ${aciertos.includes(letra) ? styles.matched : ''}`} onClick={() => elegirLetra(letra)} disabled={aciertos.includes(letra)}>{letra}</button>
          ))}
        </div>
      </div>

      {rondaCompleta && <button className={styles.primaryButton} onClick={continuar}>{ronda + 1 === totalRondas ? 'Terminar actividad' : 'Siguiente grupo'}</button>}
    </section>
  );
};

export default RelacionarSenas;
