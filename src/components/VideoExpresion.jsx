const VideoExpresion = ({ src, texto, ocultarTexto = false }) => (
  <video
    src={src}
    controls
    playsInline
    preload="metadata"
    aria-label={ocultarTexto ? 'Video de una seña por reconocer' : `Video de la seña para ${texto}`}
  >
    Tu dispositivo no puede reproducir este video.
  </video>
);

export default VideoExpresion;
