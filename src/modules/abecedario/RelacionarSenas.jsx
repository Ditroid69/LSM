import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { imagenDeLetra, letrasAbecedario, mezclar } from '../../data/actividadesAbecedario';
import styles from './styles/PracticaActividades.module.css';

const TAMANO_RONDA = 3;

const crearRondas = (letras) => {
  const rondas = [];
  for (let inicio = 0; inicio < letras.length; inicio += TAMANO_RONDA) {
    rondas.push(letras.slice(inicio, inicio + TAMANO_RONDA));
  }
  if (rondas.length > 1 && rondas.at(-1).length === 1) {
    rondas.at(-2).push(...rondas.pop());
  }
  return rondas;
};

const RelacionarSenas = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [orden] = useState(() => mezclar(letrasAbecedario));
  const [rondas] = useState(() => crearRondas(orden));
  const [ronda, setRonda] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [aciertos, setAciertos] = useState([]);
  const [estado, setEstado] = useState('');
  const grupo = rondas[ronda];
  const opciones = useMemo(() => mezclar(grupo), [grupo]);
  const rondaCompleta = aciertos.length === grupo.length;
  const completadasAntes = rondas.slice(0, ronda).reduce((total, letras) => total + letras.length, 0);

  const elegir = (tipo, letra) => {
    if (aciertos.includes(letra)) return;

    // Elegir otra tarjeta del mismo tipo solo cambia el punto de partida.
    if (!seleccionada || seleccionada.tipo === tipo) {
      setSeleccionada({ tipo, letra });
      setEstado('seleccion');
      return;
    }

    if (seleccionada.letra === letra) {
      setAciertos((actuales) => [...actuales, letra]);
      setEstado('correcto');
    } else {
      setEstado('error');
    }
    setSeleccionada(null);
  };

  const continuar = async () => {
    if (ronda + 1 < rondas.length) {
      setRonda((actual) => actual + 1);
      setAciertos([]);
      setSeleccionada(null);
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

  const mensaje = rondaCompleta
    ? ['¡Grupo completado!', 'Relacionaste correctamente todas las señas.']
    : estado === 'error'
      ? ['Respuesta incorrecta', 'La seña y la letra no corresponden. Vuelve a intentarlo.']
      : estado === 'correcto'
        ? ['¡Muy bien!', 'La seña y la letra son correctas.']
        : seleccionada
          ? [`${seleccionada.tipo === 'signo' ? 'Seña' : 'Letra'} seleccionada`, `Ahora elige ${seleccionada.tipo === 'signo' ? 'la letra' : 'la seña'} que corresponde.`]
          : ['¿Cómo jugar?', 'Puedes comenzar por una seña o por una letra y luego elegir su pareja.'];

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.top}>
        <div><small>Actividad 1</small><h1>Relaciona la seña</h1></div>
        <span className={styles.progressCounter} aria-label={`${ronda + 1} de ${rondas.length} rondas`}><strong>{ronda + 1}</strong><span>/ {rondas.length}</span></span>
        <div className={styles.progress}><i style={{ width: `${((completadasAntes + aciertos.length) / orden.length) * 100}%` }} /></div>
      </header>

      <div className={`${styles.feedback} ${styles.feedbackTop} ${estado === 'error' ? styles.feedbackError : ''} ${estado === 'correcto' || rondaCompleta ? styles.feedbackSuccess : ''}`} aria-live="polite">
        <span className={styles.feedbackIcon}>{estado === 'error' ? '×' : estado === 'correcto' || rondaCompleta ? '✓' : 'i'}</span>
        <span><strong>{mensaje[0]}</strong><small>{mensaje[1]}</small></span>
      </div>

      <div className={styles.boardLabels}><span>Señas</span><span>Letras</span></div>
      <div className={styles.matchBoard}>
        <div className={styles.column} aria-label="Señas">
          {grupo.map((letra) => (
            <button key={letra} className={`${styles.signCard} ${seleccionada?.tipo === 'signo' && seleccionada.letra === letra ? styles.selected : ''} ${aciertos.includes(letra) ? styles.matched : ''}`} onClick={() => elegir('signo', letra)} disabled={aciertos.includes(letra)}>
              <img src={imagenDeLetra(letra)} alt="Seña por relacionar" onError={(evento) => { evento.currentTarget.hidden = true; evento.currentTarget.nextElementSibling.hidden = false; }} />
              <span className={styles.imageFallback} hidden>?</span>
              {aciertos.includes(letra) && <i>✓</i>}
            </button>
          ))}
        </div>
        <div className={styles.column} aria-label="Letras">
          {opciones.map((letra) => (
            <button key={letra} className={`${styles.letterOption} ${seleccionada?.tipo === 'letra' && seleccionada.letra === letra ? styles.selected : ''} ${aciertos.includes(letra) ? styles.matched : ''}`} onClick={() => elegir('letra', letra)} disabled={aciertos.includes(letra)}>{letra}</button>
          ))}
        </div>
      </div>

      {rondaCompleta && <button className={styles.primaryButton} onClick={continuar}>{ronda + 1 === rondas.length ? 'Terminar actividad' : 'Siguiente grupo'}</button>}
    </section>
  );
};

export default RelacionarSenas;
