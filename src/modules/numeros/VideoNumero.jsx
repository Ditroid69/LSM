import { useRef, useState } from 'react';
import styles from './VideoNumero.module.css';

const IconoPlay = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>
);

const IconoPausa = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>
);

const IconoRepetir = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
);

const VideoNumero = ({ src, numero, ocultarNumero = false }) => {
  const videoRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const alternarReproduccion = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      await video.play();
    } else {
      video.pause();
    }
  };

  const repetir = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    await video.play();
  };

  return (
    <div className={styles.player}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        aria-label={ocultarNumero ? 'Video de la seña por reconocer' : `Video de la seña para el número ${numero}`}
        onClick={alternarReproduccion}
        onPlay={() => { setReproduciendo(true); setFinalizado(false); }}
        onPause={() => setReproduciendo(false)}
        onEnded={() => { setReproduciendo(false); setFinalizado(true); }}
      />

      {!reproduciendo && (
        <button
          type="button"
          className={styles.mainControl}
          onClick={finalizado ? repetir : alternarReproduccion}
          aria-label={finalizado ? 'Repetir video' : 'Reproducir video'}
        >
          {finalizado ? <IconoRepetir /> : <IconoPlay />}
          <span>{finalizado ? 'Repetir' : 'Reproducir'}</span>
        </button>
      )}

      <div className={styles.controlBar}>
        <button type="button" onClick={alternarReproduccion} aria-label={reproduciendo ? 'Pausar video' : 'Reproducir video'}>
          {reproduciendo ? <IconoPausa /> : <IconoPlay />}
          <span>{reproduciendo ? 'Pausar' : 'Reproducir'}</span>
        </button>
        <button type="button" onClick={repetir} aria-label="Repetir video desde el inicio">
          <IconoRepetir />
          <span>Repetir</span>
        </button>
      </div>
    </div>
  );
};

export default VideoNumero;
