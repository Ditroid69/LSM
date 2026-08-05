import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { imagenDeLetra, letrasAbecedario, mezclar } from '../../data/actividadesAbecedario';
import styles from './styles/MemoramaAbecedario.module.css';

const TAMANO_MEMORAMA = 4;
const ESPERA_VISTA_PREVIA = 2400;
const ESPERA_MEZCLA = 650;
const ESPERA_ERROR = 850;

const crearPartida = () => {
  const letras = mezclar(letrasAbecedario).slice(0, TAMANO_MEMORAMA);
  const tarjetas = letras.flatMap((letra, indice) => [
    { id: `sena-${letra}`, letra, tipo: 'sena', numero: indice + 1 },
    { id: `letra-${letra}`, letra, tipo: 'letra', numero: indice + 1 },
  ]);
  return { letras, tarjetas };
};

const MemoramaAbecedario = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const temporizadoresRef = useRef([]);
  const [partida, setPartida] = useState(crearPartida);
  const [tarjetas, setTarjetas] = useState(partida.tarjetas);
  const [fase, setFase] = useState('vista');
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [estado, setEstado] = useState('vista');

  const programar = useCallback((accion, espera) => {
    const id = setTimeout(accion, espera);
    temporizadoresRef.current.push(id);
  }, []);

  useEffect(() => {
    programar(() => {
      setFase('ocultando');
      programar(() => {
        setTarjetas((actuales) => mezclar(actuales));
        setFase('mezclando');
        programar(() => { setFase('jugando'); setEstado('jugando'); }, ESPERA_MEZCLA);
      }, ESPERA_MEZCLA);
    }, ESPERA_VISTA_PREVIA);
    return () => temporizadoresRef.current.forEach(clearTimeout);
  }, [programar, partida]);

  const elegir = (tarjeta) => {
    if (fase !== 'jugando' || seleccionadas.length === 2 || parejas.includes(tarjeta.letra) || seleccionadas.some(({ id }) => id === tarjeta.id)) return;
    const nuevas = [...seleccionadas, tarjeta];
    setSeleccionadas(nuevas);
    if (nuevas.length < 2) { setEstado('seleccion'); return; }

    if (nuevas[0].letra === nuevas[1].letra && nuevas[0].tipo !== nuevas[1].tipo) {
      const parejasNuevas = [...parejas, tarjeta.letra];
      setParejas(parejasNuevas);
      setSeleccionadas([]);
      setEstado(parejasNuevas.length === TAMANO_MEMORAMA ? 'completo' : 'correcto');
      return;
    }

    setEstado('error');
    programar(() => { setSeleccionadas([]); setEstado('jugando'); }, ESPERA_ERROR);
  };

  const reiniciar = () => {
    temporizadoresRef.current.forEach(clearTimeout);
    temporizadoresRef.current = [];
    const nueva = crearPartida();
    setPartida(nueva); setTarjetas(nueva.tarjetas); setFase('vista');
    setSeleccionadas([]); setParejas([]); setEstado('vista');
  };

  const terminar = async () => {
    await Preferences.set({ key: 'progreso_abecedario_actividad_memorama', value: 'completado' });
    navigate('/abecedario/actividades', { replace: true });
  };

  const mensaje = useMemo(() => {
    if (fase === 'vista') return ['Memoriza las parejas', 'Observa las cuatro señas, sus números y las letras correspondientes.'];
    if (fase === 'ocultando') return ['¡Atención!', 'Las tarjetas se están volteando.'];
    if (fase === 'mezclando') return ['Mezclando tarjetas', 'Sigue su movimiento antes de comenzar.'];
    if (estado === 'completo') return ['¡Memorama completado!', 'Encontraste correctamente las cuatro parejas.'];
    if (estado === 'correcto') return ['¡Pareja correcta!', 'La seña y la letra permanecerán visibles.'];
    if (estado === 'error') return ['No coinciden', 'Estas tarjetas volverán a ocultarse.'];
    if (estado === 'seleccion') return ['Elige otra tarjeta', 'Busca la seña o letra correspondiente.'];
    return ['Encuentra las parejas', 'Relaciona cada seña con la letra que representa.'];
  }, [estado, fase]);

  const cssVars = {
    '--memory-card': theme.tarjeta, '--memory-text': theme.tarjetaTexto || theme.texto,
    '--memory-muted': theme.texto2, '--memory-border': theme.borde,
    '--memory-primary': theme.boton2, '--memory-accent': theme.boton1,
    '--memory-success': theme.correcto, '--memory-error': theme.incorrecto,
    '--memory-soft': theme.gris,
  };

  return (
    <section className={styles.page} style={cssVars}>
      <header className={styles.top}>
        <div><small>Actividad 3</small><h1>Memorama de señas</h1></div>
        <span>{parejas.length}/{TAMANO_MEMORAMA} parejas</span>
        <div className={styles.progress}><i style={{ width: `${(parejas.length / TAMANO_MEMORAMA) * 100}%` }} /></div>
      </header>

      <div className={`${styles.feedback} ${estado === 'error' ? styles.feedbackError : ''} ${estado === 'correcto' || estado === 'completo' ? styles.feedbackSuccess : ''}`} aria-live="polite">
        <span>{estado === 'error' ? '×' : estado === 'correcto' || estado === 'completo' ? '✓' : 'i'}</span>
        <div><strong>{mensaje[0]}</strong><small>{mensaje[1]}</small></div>
      </div>

      <div className={`${styles.board} ${fase === 'mezclando' ? styles.boardShuffling : ''}`} aria-label="Tablero del memorama">
        {tarjetas.map((tarjeta) => {
          const visible = fase === 'vista' || seleccionadas.some(({ id }) => id === tarjeta.id) || parejas.includes(tarjeta.letra);
          const encontrada = parejas.includes(tarjeta.letra);
          return (
            <button key={tarjeta.id} type="button" className={`${styles.memoryCard} ${visible ? styles.flipped : ''} ${encontrada ? styles.matched : ''}`} onClick={() => elegir(tarjeta)} disabled={fase !== 'jugando' || encontrada} aria-label={visible ? `${tarjeta.tipo === 'sena' ? 'Seña' : 'Letra'} ${tarjeta.letra}` : 'Tarjeta oculta'}>
              <span className={styles.cardInner}>
                <span className={styles.cardBack} aria-hidden="true"><strong>?</strong><small>LSM</small></span>
                <span className={styles.cardFront}>
                  {tarjeta.tipo === 'sena' ? <><span className={styles.numberBadge}>{tarjeta.numero}</span><img src={imagenDeLetra(tarjeta.letra)} alt={`Seña de la letra ${tarjeta.letra}`} /></> : <><strong className={styles.letter}>{tarjeta.letra}</strong><small>Letra {tarjeta.numero}</small></>}
                  {encontrada && <span className={styles.check}>✓</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {estado === 'completo' && <div className={styles.actions}><button type="button" className={styles.secondaryButton} onClick={reiniciar}>Jugar otra vez</button><button type="button" className={styles.primaryButton} onClick={terminar}>Terminar actividad</button></div>}
    </section>
  );
};

export default MemoramaAbecedario;
