import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../context/ThemeContext';
import { imagenDeLetra, mezclar } from '../../data/actividadesAbecedario';
import styles from './styles/PracticaActividades.module.css';

const palabras = [
  { texto: 'SOL', referencia: '☀️' },
  { texto: 'CASA', referencia: '🏠' },
  { texto: 'LUNA', referencia: '🌙' },
  { texto: 'PAN', referencia: '🍞' },
  { texto: 'VASO', referencia: '🥤' },
];

const DeletreoPalabras = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [indice, setIndice] = useState(0);
  const [colocadas, setColocadas] = useState([]);
  const [estado, setEstado] = useState('');
  const palabra = palabras[indice];
  const fichas = useMemo(() => mezclar([...palabra.texto].map((letra, i) => ({ id: `${indice}-${i}`, letra }))), [indice, palabra.texto]);

  const agregar = (id) => {
    if (colocadas.includes(id) || colocadas.length === palabra.texto.length) return;
    setColocadas((actuales) => [...actuales, id]);
    setEstado('');
  };

  const quitar = (posicion) => {
    setColocadas((actuales) => actuales.filter((_, i) => i !== posicion));
    setEstado('');
  };

  const comprobar = async () => {
    const respuesta = colocadas.map((id) => fichas.find((ficha) => ficha.id === id)?.letra).join('');
    if (respuesta !== palabra.texto) { setEstado('error'); return; }
    if (indice + 1 < palabras.length) { setEstado('correcto'); return; }
    await Preferences.set({ key: 'progreso_abecedario_actividad_deletreo', value: 'completado' });
    navigate('/abecedario/actividades', { replace: true });
  };

  const siguiente = () => { setIndice((actual) => actual + 1); setColocadas([]); setEstado(''); };
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
        <div><small>Actividad 2</small><h1>Deletreo de palabras</h1></div><span>{indice + 1} de {palabras.length}</span>
        <div className={styles.progress}><i style={{ width: `${((indice + (estado === 'correcto' ? 1 : 0)) / palabras.length) * 100}%` }} /></div>
      </header>
      <div className={`${styles.feedback} ${styles.feedbackTop} ${estado === 'error' ? styles.feedbackError : ''} ${estado === 'correcto' ? styles.feedbackSuccess : ''}`} aria-live="polite">
        <span className={styles.feedbackIcon}>{estado === 'error' ? '×' : estado === 'correcto' ? '✓' : 'i'}</span>
        <span><strong>{estado === 'correcto' ? '¡Palabra correcta!' : estado === 'error' ? 'Revisa el orden' : 'Ordena las señas'}</strong><small>{estado === 'correcto' ? `Formaste ${palabra.texto} correctamente.` : estado === 'error' ? 'Toca una seña colocada para retirarla e inténtalo otra vez.' : 'Tócalas en el mismo orden en que aparecen las letras.'}</small></span>
      </div>
      <article className={styles.wordCard}>
        <span className={styles.reference} role="img" aria-label={`Imagen de ${palabra.texto}`}>{palabra.referencia}</span>
        <small>Deletrea</small><h2>{palabra.texto}</h2>
        <div className={styles.slots}>
          {[...palabra.texto].map((_, posicion) => {
            const ficha = fichas.find(({ id }) => id === colocadas[posicion]);
            return <button key={posicion} className={styles.slot} onClick={() => ficha && quitar(posicion)} aria-label={ficha ? `Quitar seña ${ficha.letra}` : `Espacio ${posicion + 1}`}>{ficha ? <img src={imagenDeLetra(ficha.letra)} alt={`Seña ${ficha.letra}`} /> : <span>{posicion + 1}</span>}</button>;
          })}
        </div>
      </article>
      <div className={styles.tray}>
        {fichas.map((ficha) => <button key={ficha.id} onClick={() => agregar(ficha.id)} disabled={colocadas.includes(ficha.id)}><img src={imagenDeLetra(ficha.letra)} alt={`Seña de la letra ${ficha.letra}`} /><span>{ficha.letra}</span></button>)}
      </div>
      {estado === 'correcto' ? <button className={styles.primaryButton} onClick={siguiente}>Siguiente palabra</button> : <button className={styles.primaryButton} onClick={comprobar} disabled={colocadas.length !== palabra.texto.length}>Comprobar</button>}
    </section>
  );
};

export default DeletreoPalabras;
