import { useEffect, useRef, useState } from 'react';

const HandTracker = ({ letraObjetivo, onAcierto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const [status, setStatus] = useState('cargando'); // 'cargando' | 'error' | 'listo'
  const [mensajeError, setMensajeError] = useState('');
  const [acierto, setAcierto] = useState(false);
  const aciertoRef = useRef(false); // para evitar parpadeos
  const letraRef = useRef(letraObjetivo);
  // Mantener letraRef sincronizado con la prop
  useEffect(() => {
    letraRef.current = letraObjetivo;
  }, [letraObjetivo]);

    useEffect(() => {
    setAcierto(false);
    aciertoRef.current = false;
  }, [letraObjetivo]);

  useEffect(() => {
    let cancelado = false;

    const { Hands, Camera } = window;
    const { drawConnectors, drawLandmarks } = window;
    const { HAND_CONNECTIONS } = window;

    const iniciar = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelado) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        video.muted = true;
        await video.play();

        const hands = new Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          if (cancelado) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks?.length) {
            for (const landmarks of results.multiHandLandmarks) {
              drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
              });
              drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 });
              console.log('For ejecutándose. letraObjetivo:', letraRef.current, 'landmarks:', landmarks.length);
              // Detectar solo si el objetivo es 'A'
                if (letraRef.current === 'A') {
                const esA = detectarA(landmarks);
                if (esA && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esA && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
             // Detectar letra B
              if (letraRef.current === 'B') {
                const esB = detectarB(landmarks);
                if (esB && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraObjetivo);
                } else if (!esB && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
            }
          }
        });

        handsRef.current = hands;

        const camera = new Camera(video, {
          onFrame: async () => {
            if (handsRef.current && !cancelado) {
              await handsRef.current.send({ image: video });
            }
          },
          width: 640,
          height: 480
        });

        cameraRef.current = camera;
        camera.start();
        setStatus('listo');
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setStatus('error');
          setMensajeError(err.message || 'Error desconocido');
        }
      }
    };

    if (window.Hands && window.Camera) {
      iniciar();
    } else {
      const timer = setTimeout(() => {
        if (!cancelado) iniciar();
      }, 1000);
      return () => {
        cancelado = true;
        clearTimeout(timer);
      };
    }

    return () => {
      cancelado = true;
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline />

      {status === 'cargando' && (
        <p style={{ textAlign: 'center' }}>⏳ Iniciando cámara y cargando IA...</p>
      )}

      {status === 'error' && (
        <div style={{ backgroundColor: '#ffffcc', padding: 20, margin: 20, border: '1px solid red' }}>
          <h3>❌ Error detectado:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{mensajeError}</pre>
        </div>
      )}

      {status === 'listo' && (
        <>
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{
              width: '100%',
              height: 'auto',
              border: '2px solid #333',
              transform: 'scaleX(-1)'
            }}
          />
          {letraObjetivo && (
            <p style={{ textAlign: 'center', marginTop: 8, fontWeight: 'bold' }}>
              🎯 Seña objetivo: {letraObjetivo}
            </p>
            
            
          )}
           {acierto && (
            <p style={{ textAlign: 'center', marginTop: 4, color: 'green', fontWeight: 'bold', fontSize: 20 }}>
              ✅ ¡Correcto!
            </p>
          )}
        </>
      )}
    </div>
  );
};
function detectarA(landmarks) {
  const puntaIndice = landmarks[8].y;
  const baseIndice = landmarks[5].y;
  const puntaMedio = landmarks[12].y;
  const baseMedio = landmarks[9].y;
  const puntaAnular = landmarks[16].y;
  const baseAnular = landmarks[13].y;
  const puntaMenique = landmarks[20].y;
  const baseMenique = landmarks[17].y;
  const puntaPulgar = landmarks[4];
  const basePulgar = landmarks[1];

  // Dedos flexionados: punta más abajo que su base (coordenada y mayor)
  const indiceFlexionado = puntaIndice > baseIndice;
  const medioFlexionado = puntaMedio > baseMedio;
  const anularFlexionado = puntaAnular > baseAnular;
  const meniqueFlexionado = puntaMenique > baseMenique;

  // Pulgar extendido hacia la izquierda (mano derecha, imagen espejo) y arriba
  const pulgarExtendido = puntaPulgar.x < basePulgar.x;
  const pulgarArriba = puntaPulgar.y < basePulgar.y;

  return indiceFlexionado && medioFlexionado && anularFlexionado && meniqueFlexionado && pulgarExtendido && pulgarArriba;
}
function detectarB(landmarks) {
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;

  // Dedos largos extendidos (puntas arriba)
  const indiceExt = landmarks[INDEX_TIP].y < landmarks[INDEX_MCP].y;
  const medioExt = landmarks[MIDDLE_TIP].y < landmarks[MIDDLE_MCP].y;
  const anularExt = landmarks[RING_TIP].y < landmarks[RING_MCP].y;
  const meniqueExt = landmarks[PINKY_TIP].y < landmarks[PINKY_MCP].y;

  // Pulgar cruzando la palma
  const distPulgarIndice = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x,
    landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y
  );
  const pulgarEnPalma = distPulgarIndice < 0.2;  // antes 0.3, pero tú estás en 0.108, así que 0.2 basta

  // La punta del pulgar debe estar a la derecha del nudillo índice (mano espejo)
  const pulgarDerecha = landmarks[THUMB_TIP].x > landmarks[INDEX_MCP].x;

  console.log('B debug:', { indiceExt, medioExt, anularExt, meniqueExt, distPulgarIndice, pulgarEnPalma, pulgarDerecha });

  return indiceExt && medioExt && anularExt && meniqueExt && pulgarEnPalma && pulgarDerecha;
}
export default HandTracker;