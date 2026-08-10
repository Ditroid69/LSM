import { useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

const IconoPlay = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>;
const IconoPausa = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>;
const IconoReiniciar = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>;

const VideoPlayer = ({ src, ariaLabel, controlesExternos = true }) => {
  const videoRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const usarControlesExternos = controlesExternos;

  const reproducir = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    try { await video.play(); } catch { setReproduciendo(false); }
  };

  const pausar = () => videoRef.current?.pause();

  const reiniciar = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    try { await video.play(); } catch { setReproduciendo(false); }
  };

  return (
    <div className={`${styles.player} ${usarControlesExternos ? styles.externalPlayer : ''}`}>
      <div className={styles.videoBox}>
        <video
          ref={videoRef}
          src={src}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          preload="metadata"
          aria-label={ariaLabel}
          onPlay={() => setReproduciendo(true)}
          onPause={() => setReproduciendo(false)}
          onEnded={() => setReproduciendo(false)}
        >
          Tu dispositivo no puede reproducir este video.
        </video>
      </div>
      <div className={`${styles.controls} ${usarControlesExternos ? styles.externalControls : ''}`} aria-label="Controles del video">
        {usarControlesExternos ? (
          <button type="button" onClick={reproduciendo ? pausar : reproducir} aria-label={reproduciendo ? 'Pausar video' : 'Reproducir video'}>
            {reproduciendo ? <IconoPausa /> : <IconoPlay />}<span>{reproduciendo ? 'Pausar' : 'Play'}</span>
          </button>
        ) : (
          <>
            <button type="button" onClick={reproducir} disabled={reproduciendo} aria-label="Reproducir video"><IconoPlay /><span>Play</span></button>
            <button type="button" onClick={pausar} disabled={!reproduciendo} aria-label="Pausar video"><IconoPausa /><span>Pausar</span></button>
          </>
        )}
        <button type="button" onClick={reiniciar} aria-label="Reiniciar video"><IconoReiniciar /><span>Reiniciar</span></button>
      </div>
    </div>
  );
};

export default VideoPlayer;
