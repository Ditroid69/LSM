import VideoPlayer from './VideoPlayer';

const VideoExpresion = ({ src, texto, ocultarTexto = false, controlesExternos = true }) => (
  <VideoPlayer
    src={src}
    ariaLabel={ocultarTexto ? 'Video de una seña por reconocer' : `Video de la seña para ${texto}`}
    controlesExternos={controlesExternos}
  />
);

export default VideoExpresion;
