import VideoPlayer from '../../components/VideoPlayer';

const VideoNumero = ({ src, numero, valor = numero, etiqueta = 'número', ocultarNumero = false }) => (
  <VideoPlayer
    src={src}
    ariaLabel={ocultarNumero ? 'Video de la seña por reconocer' : `Video de la seña para ${etiqueta === 'letra' ? 'la' : 'el'} ${etiqueta} ${valor}`}
  />
);

export default VideoNumero;
