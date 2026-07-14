import { useEffect, useRef, useState } from 'react';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const HandTracker = ({ letraObjetivo, onAcierto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);

  const [status, setStatus] = useState('cargando'); // 'cargando' | 'error' | 'listo'
  const [mensajeError, setMensajeError] = useState('');
  const [progress, setProgress] = useState(0);       // para la barra circular
  const [validando, setValidando] = useState(false); // true mientras se llena la barra
  const [falloVisible, setFalloVisible] = useState(false); // muestra error si falla antes de 3s
  const intervaloRef = useRef(null);    
  const validandoRef = useRef(false);
  const progressRef = useRef(0);            // para el temporizador
  const letraRef = useRef(letraObjetivo);
  const onAciertoRef = useRef(onAcierto);
  const [handDetected, setHandDetected] = useState(false);   // ¿hay mano en cámara?
    const [validacionCompleta, setValidacionCompleta] = useState(false);

  // Mantener letraRef sincronizado con la prop
  // Reiniciar todo solo al cambiar de letra
  useEffect(() => {
    letraRef.current = letraObjetivo;
    setProgress(0);
    setValidando(false);
    setFalloVisible(false);
    setHandDetected(false);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    validandoRef.current = false;
    progressRef.current = 0;
    setValidacionCompleta(false);
  }, [letraObjetivo]);

  // Actualizar callback sin reiniciar nada
  useEffect(() => {
    onAciertoRef.current = onAcierto;
  }, [onAcierto]);

  
  useEffect(() => {
    let cancelado = false;

    const { Hands, Camera } = window;
    const { drawConnectors, drawLandmarks } = window;
    const { HAND_CONNECTIONS } = window;

    const iniciar = async () => {
      try {
      // Solo pedir permiso en plataformas nativas (Android/iOS)
if (Capacitor.isNativePlatform()) {
  const { Camera } = await import('@capacitor/camera');
  const permiso = await Camera.requestPermissions();
  if (permiso.camera !== 'granted') {
    setStatus('error');
    setMensajeError('Permiso de cámara denegado');
    return;
  }
}

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
          maxNumHands: 2,
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
          // Actualizar si hay mano presente
          if (results.multiHandLandmarks?.length) {
            setHandDetected(true);
          } else {
            setHandDetected(false);
            // Si estábamos validando y la mano desaparece, es un fallo
            if (validando || progress > 0) {
              clearInterval(intervaloRef.current);
              setValidando(false);
              setProgress(0);
              setFalloVisible(true);
            }
          }
          if (results.multiHandLandmarks?.length) {
            for (const landmarks of results.multiHandLandmarks) {
               if (validacionCompleta) return;
              drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
              });
              drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 });
              // Solo evaluar si no se ha completado aún
              if (!validacionCompleta) {
                                const letra = letraRef.current;
                let esCorrecta = false;
                if (letra === 'A') esCorrecta = detectarA(landmarks);
                else if (letra === 'B') esCorrecta = detectarB(landmarks);
                else if (letra === 'C') esCorrecta = detectarC(landmarks);
                else if (letra === 'D') esCorrecta = detectarD(landmarks);
                else if (letra === 'E') esCorrecta = detectarE(landmarks);
                else if (letra === 'F') esCorrecta = detectarF(landmarks);
                else if (letra === 'S') esCorrecta = detectarS(landmarks);
                else if (letra === 'T') esCorrecta = detectarT(landmarks);
                else if (letra === 'O') esCorrecta = detectarO(landmarks);
                else if (letra === 'U') esCorrecta = detectarU(landmarks);
                else if (letra === 'I') esCorrecta = detectarI(landmarks);
                else if (letra === 'K' || letra === 'P') esCorrecta = detectarKP(landmarks);
                else if (letra === 'V') esCorrecta = detectarV(landmarks);
                else if (letra === 'W') esCorrecta = detectarW(landmarks);
                else if (letra === 'G') esCorrecta = detectarG(landmarks);
                else if (letra === 'H') esCorrecta = detectarH(landmarks);
                else if (letra === 'L') esCorrecta = detectarL(landmarks);
                else if (letra === 'M') esCorrecta = detectarM(landmarks);
                else if (letra === 'Ñ') esCorrecta = detectarÑ(landmarks);
                else if (letra === 'R') esCorrecta = detectarR(landmarks);
                else if (letra === 'X') esCorrecta = detectarX(landmarks);
                else if (letra === 'Y') esCorrecta = detectarY(landmarks);
                else if (letra === 'Z') esCorrecta = detectarZ(landmarks);

                // ===== LÓGICA DE TEMPORIZADOR =====
                if (esCorrecta) {
                  if (falloVisible) setFalloVisible(false);
                  if (!validandoRef.current) {
                    validandoRef.current = true;
                    setValidando(true);
                    progressRef.current = 0;
                    setProgress(0);
                    if (intervaloRef.current) clearInterval(intervaloRef.current);
                    intervaloRef.current = setInterval(() => {
                      progressRef.current += 100 / 15;
                      if (progressRef.current >= 100) {
                        clearInterval(intervaloRef.current);
                        setProgress(100);
                        setValidando(false);
                        validandoRef.current = false;
                        setValidacionCompleta(true);
                        if (onAciertoRef.current) onAciertoRef.current(letra);
                      } else {
                        setProgress(progressRef.current);
                      }
                    }, 100);
                  }
                } else {
                  if (validandoRef.current) {
                    clearInterval(intervaloRef.current);
                    validandoRef.current = false;
                    setValidando(false);
                    progressRef.current = 0;
                    setProgress(0);
                    setFalloVisible(true);
                  }
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
      clearInterval(intervaloRef.current);   // <-- añade esto
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);
  const reintentar = () => {
    setFalloVisible(false);
    setProgress(0);
    setValidando(false);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
  };
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
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  {/* Contenedor relativo para cámara + anillo */}
  <div style={{ position: 'relative', width: 280, height: 280 }}>
    {/* Cámara circular */}
    <div style={{
      width: 280,
      height: 280,
      borderRadius: '50%',
      overflow: 'hidden',
      border: '3px solid #ccc',
      boxShadow: '0 0 15px rgba(0,0,0,0.3)'
    }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)'
        }}
      />
    </div>

        {/* Anillo de progreso SVG (siempre visible cuando hay mano, se rellena de verde al acertar) */}
    {(handDetected  || validacionCompleta) && (
      <svg
        viewBox="0 0 280 280"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {/* Círculo de fondo: gris mientras no se ha completado, verde cuando sí */}
        <circle
          stroke={validacionCompleta ? "#4CAF50" : "#e0e0e0"}
          fill="none"
          strokeWidth="8"
          r={136}
          cx={140}
          cy={140}
        />
        {/* Arco verde: se llena durante la validación y se queda fijo tras completar */}
        {(validandoRef.current || validacionCompleta) && !falloVisible && (
          <circle
            stroke="#4CAF50"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 136}
            strokeDashoffset={2 * Math.PI * 136 * (1 - (validacionCompleta ? 100 : progress) / 100)}
            r={136}
            cx={140}
            cy={140}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        )}
      </svg>
    )}
  </div>

  {/* Letra objetivo */}
  {letraObjetivo && (
    <p style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>
      🎯 Seña objetivo: {letraObjetivo}
    </p>
  )}

  {/* Fallo y botón reintentar */}
{falloVisible && !validacionCompleta && (
    <div style={{ marginTop: 20, textAlign: 'center' }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>❌ La seña no es correcta. Intenta de nuevo.</p>
      <button onClick={reintentar} style={{
        marginTop: 10,
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'black',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 16
      }}>
        Reintentar
      </button>
    </div>
  )}

</div>
      )}
    </div>
  );
};
function detectarA(landmarks) {
  // Puntos clave
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;
  const WRIST = 0;   // muñeca

  // Dedos flexionados: punta más cerca de la muñeca que la base (coordenada y mayor)
  const indiceDoblado = landmarks[INDEX_TIP].y > landmarks[INDEX_MCP].y;
  const medioDoblado = landmarks[MIDDLE_TIP].y > landmarks[MIDDLE_MCP].y;
  const anularDoblado = landmarks[RING_TIP].y > landmarks[RING_MCP].y;
  const meniqueDoblado = landmarks[PINKY_TIP].y > landmarks[PINKY_MCP].y;

  // Pulgar extendido: su punta debe estar alejada del centro de la mano (índice base)
  // y apuntando hacia afuera. Medimos distancia pulgar–base índice y pulgar–muñeca
  const distPulgarBaseIndice = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x,
    landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y
  );
  const distPulgarMuneca = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[WRIST].x,
    landmarks[THUMB_TIP].y - landmarks[WRIST].y
  );

  // El pulgar extendido suele estar más lejos de la muñeca que la base del índice
  const pulgarExtendido = distPulgarMuneca > distPulgarBaseIndice * 1.2;

  return indiceDoblado && medioDoblado && anularDoblado && meniqueDoblado && pulgarExtendido;
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

  // Dedos largos extendidos (puntas más arriba que sus bases)
  const indiceExt = landmarks[INDEX_TIP].y < landmarks[INDEX_MCP].y;
  const medioExt = landmarks[MIDDLE_TIP].y < landmarks[MIDDLE_MCP].y;
  const anularExt = landmarks[RING_TIP].y < landmarks[RING_MCP].y;
  const meniqueExt = landmarks[PINKY_TIP].y < landmarks[PINKY_MCP].y;

  // Pulgar en la palma: distancia pequeña entre punta del pulgar y nudillo del índice
  const distPulgarIndice = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x,
    landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y
  );
  const pulgarEnPalma = distPulgarIndice < 0.2;

  // Determinar si la mano se ve como derecha en la imagen (índice a la izquierda del meñique)
  const esManoDerecha = landmarks[INDEX_MCP].x < landmarks[PINKY_MCP].x;
  // El pulgar debe estar cruzado hacia el centro de la palma
  const pulgarCruzado = esManoDerecha
    ? landmarks[THUMB_TIP].x > landmarks[INDEX_MCP].x  // mano derecha: pulgar a la derecha del nudillo índice
    : landmarks[THUMB_TIP].x < landmarks[INDEX_MCP].x; // mano izquierda: pulgar a la izquierda del nudillo índice

  console.log('B debug:', { indiceExt, medioExt, anularExt, meniqueExt, distPulgarIndice, pulgarEnPalma, esManoDerecha, pulgarCruzado });

  return indiceExt && medioExt && anularExt && meniqueExt && pulgarEnPalma && pulgarCruzado;
}
function detectarC(landmarks) {
  // Distancia entre punta y base de cada dedo largo (debe ser pequeña, pero no flexionada del todo)
  const distIndice = Math.hypot(landmarks[8].x - landmarks[5].x, landmarks[8].y - landmarks[5].y);
  const distMedio = Math.hypot(landmarks[12].x - landmarks[9].x, landmarks[12].y - landmarks[9].y);
  const distAnular = Math.hypot(landmarks[16].x - landmarks[13].x, landmarks[16].y - landmarks[13].y);
  const distMenique = Math.hypot(landmarks[20].x - landmarks[17].x, landmarks[20].y - landmarks[17].y);

  // Distancia entre pulgar e índice (debe ser intermedia: no pegados ni demasiado lejos)
  const distPulgarIndice = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);

  // Umbrales ajustados a tus valores reales
  const dedosCurvados = distIndice < 0.3 && distMedio < 0.3 && distAnular < 0.3 && distMenique < 0.3;
  const pulgarSeparado = distPulgarIndice > 0.2 && distPulgarIndice < 0.5;

  console.log('C debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarIndice, dedosCurvados, pulgarSeparado });

  return dedosCurvados && pulgarSeparado;
}
function detectarD(landmarks) {
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;
  const WRIST = 0;

  // Distancias punta‑base de cada dedo
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);

  // Distancia entre pulgar y punta del dedo medio (debe ser muy pequeña)
  const distPulgarMedio = Math.hypot(landmarks[THUMB_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[THUMB_TIP].y - landmarks[MIDDLE_TIP].y);

  // El índice debe estar claramente extendido (distancia > 0.2) y apuntando hacia arriba
  const indiceExtendido = distIndice > 0.2 && landmarks[INDEX_TIP].y < landmarks[INDEX_MCP].y;

  // Los otros tres dedos deben estar flexionados (distancia pequeña)
  const otrosFlexionados = distMedio < 0.15 && distAnular < 0.15 && distMenique < 0.15;

  // El pulgar debe tocar el medio (distancia < 0.1)
  const pulgarTocandoMedio = distPulgarMedio < 0.1;

  console.log('D debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarMedio, indiceExtendido, otrosFlexionados, pulgarTocandoMedio });

  return indiceExtendido && otrosFlexionados && pulgarTocandoMedio;
}
function detectarE(landmarks) {
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;

  // Distancias punta‑base de los dedos largos (deben ser pequeñas: flexionados)
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);

  // Distancia entre pulgar e índice (debe ser pequeña, están cerca)
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);

  // Todos los dedos flexionados (distancia < 0.15, tú estás en ~0.05‑0.10)
  const dedosFlexionados = distIndice < 0.15 && distMedio < 0.15 && distAnular < 0.15 && distMenique < 0.15;

  // Pulgar tocando o cerca del índice (distancia < 0.25, tú estás en 0.146)
  const pulgarCerca = distPulgarIndice < 0.25;

  console.log('E debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarIndice, dedosFlexionados, pulgarCerca });

  return dedosFlexionados && pulgarCerca;
}
function detectarS(landmarks) {
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;
  const THUMB_CMC = 1;

  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);

  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);

  const dedosFlexionados = distIndice < 0.15 && distMedio < 0.15 && distAnular < 0.15 && distMenique < 0.15;
  const pulgarFlexionado = distPulgarBase < 0.25;

  // NUEVA CONDICIÓN: la punta del pulgar debe estar en la palma, cerca del nudillo del índice o del meñique
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);
  const distPulgarNudilloMenique = Math.hypot(landmarks[THUMB_TIP].x - landmarks[PINKY_MCP].x, landmarks[THUMB_TIP].y - landmarks[PINKY_MCP].y);
  const pulgarEnPalma = distPulgarNudilloIndice < 0.15 || distPulgarNudilloMenique < 0.15;

  const pulgarSobreIndice = distPulgarIndice < 0.2;

  return dedosFlexionados && pulgarFlexionado && pulgarSobreIndice && pulgarEnPalma;
}
function detectarT(landmarks) {
  const INDEX_TIP = 8;
  const INDEX_MCP = 5;
  const MIDDLE_TIP = 12;
  const MIDDLE_MCP = 9;
  const RING_TIP = 16;
  const RING_MCP = 13;
  const PINKY_TIP = 20;
  const PINKY_MCP = 17;
  const THUMB_TIP = 4;
  const THUMB_CMC = 1;

  // Distancias punta‑base de los dedos largos (deben ser pequeñas)
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);

  // Distancia punta‑base del pulgar (debe ser grande: pulgar extendido)
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  // Distancias del pulgar a las puntas del índice y el medio (deben ser pequeñas)
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);
  const distPulgarMedio = Math.hypot(landmarks[THUMB_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[THUMB_TIP].y - landmarks[MIDDLE_TIP].y);

  // Condiciones basadas en tus valores reales
  const dedosFlexionados = distIndice < 0.3 && distMedio < 0.3 && distAnular < 0.3 && distMenique < 0.3;
  const pulgarExtendido = distPulgarBase > 0.35;        // en tu T fue 0.42
  const pulgarEntreDedos = distPulgarIndice < 0.25 && distPulgarMedio < 0.35; // valores 0.189 y 0.290

  console.log('T debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarBase, distPulgarIndice, distPulgarMedio, dedosFlexionados, pulgarExtendido, pulgarEntreDedos });

  return dedosFlexionados && pulgarExtendido && pulgarEntreDedos;
}
function detectarF(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);
  const indiceFlexionado = distIndice < 0.15;
  const otrosExtendidos = distMedio > 0.3 && distAnular > 0.3 && distMenique > 0.3;
  const pulgarExtendido = distPulgarBase > 0.3;
  const pulgarTocandoIndice = distPulgarIndice < 0.1;
  return indiceFlexionado && otrosExtendidos && pulgarExtendido && pulgarTocandoIndice;
}
function detectarU(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17, THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarAnular = Math.hypot(landmarks[THUMB_TIP].x - landmarks[RING_TIP].x, landmarks[THUMB_TIP].y - landmarks[RING_TIP].y);
  const indiceExtendido = distIndice > 0.25;
  const medioExtendido = distMedio > 0.25;
  const anularFlexionado = distAnular < 0.15;
  const meniqueFlexionado = distMenique < 0.15;
  const indicesJuntos = distIndiceMedio < 0.15;
  const pulgarTocandoAnular = distPulgarAnular < 0.12;
  return indiceExtendido && medioExtendido && anularFlexionado && meniqueFlexionado && indicesJuntos && pulgarTocandoAnular;
}
function detectarO(landmarks) {
  const INDEX_TIP = 8, MIDDLE_TIP = 12, RING_TIP = 16, PINKY_TIP = 20, THUMB_TIP = 4;
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distMedioAnular = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[RING_TIP].x, landmarks[MIDDLE_TIP].y - landmarks[RING_TIP].y);
  const distAnularMenique = Math.hypot(landmarks[RING_TIP].x - landmarks[PINKY_TIP].x, landmarks[RING_TIP].y - landmarks[PINKY_TIP].y);
  const distMeniqueIndice = Math.hypot(landmarks[PINKY_TIP].x - landmarks[INDEX_TIP].x, landmarks[PINKY_TIP].y - landmarks[INDEX_TIP].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);
  const dedosJuntos = distIndiceMedio < 0.08 && distMedioAnular < 0.08 && distAnularMenique < 0.08 && distMeniqueIndice < 0.08;
  const pulgarPegado = distPulgarIndice < 0.1;
  return dedosJuntos && pulgarPegado;
}
function detectarI(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;

  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);

  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  // Solo el meñique extendido
  const meniqueExtendido = distMenique > 0.25;
  // Los otros tres flexionados
  const otrosFlexionados = distIndice < 0.15 && distMedio < 0.15 && distAnular < 0.15;
  // Pulgar tocando el nudillo del índice
  const pulgarEnNudillo = distPulgarNudilloIndice < 0.08;

  console.log('I debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarNudilloIndice, meniqueExtendido, otrosFlexionados, pulgarEnNudillo });

  return meniqueExtendido && otrosFlexionados && pulgarEnNudillo;
}
function detectarKP(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;

  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarMedio = Math.hypot(landmarks[THUMB_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[THUMB_TIP].y - landmarks[MIDDLE_TIP].y);

  // Índice y medio extendidos y separados
  const indiceExt = distIndice > 0.25;
  const medioExt = distMedio > 0.25;
  const separados = distIndiceMedio > 0.18;
  // Anular y meñique flexionados
  const anularFlex = distAnular < 0.3;
  const meniqueFlex = distMenique < 0.25;
  // Pulgar entre los dedos (cerca del medio)
  const pulgarEntre = distPulgarMedio < 0.25;

  return indiceExt && medioExt && separados && anularFlex && meniqueFlex && pulgarEntre;
}
function detectarV(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const indiceExt = distIndice > 0.25;
  const medioExt = distMedio > 0.3;
  const anularFlex = distAnular < 0.2;
  const meniqueFlex = distMenique < 0.2;
  const juntos = distIndiceMedio < 0.25;
  const pulgarEnPalma = distPulgarNudilloIndice < 0.25;

  return indiceExt && medioExt && anularFlex && meniqueFlex && juntos && pulgarEnPalma;
}

// G: índice extendido, demás flexionados, pulgar doblado sobre palma
function detectarG(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const indiceExt = distIndice > 0.25;
  const otrosFlex = distMedio < 0.15 && distAnular < 0.15 && distMenique < 0.15;
  const pulgarDoblado = distPulgarNudilloIndice < 0.25;

  return indiceExt && otrosFlex && pulgarDoblado;
}

// H: índice y medio extendidos y juntos, pulgar sobre la palma
function detectarH(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const indiceExt = distIndice > 0.25;
  const medioExt = distMedio > 0.3;
  const otrosFlex = distAnular < 0.15 && distMenique < 0.15;
  const juntos = distIndiceMedio < 0.1;
  const pulgarEnPalma = distPulgarNudilloIndice < 0.25;

  return indiceExt && medioExt && otrosFlex && juntos && pulgarEnPalma;
}

// L: índice extendido, pulgar extendido formando L (requiere pulgar extendido y separado)
// Usamos diagnóstico específico más adelante. Por ahora dejamos placeholder.
function detectarL(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);

  const indiceExt = distIndice > 0.3;
  const pulgarExt = distPulgarBase > 0.35;
  const pulgarSeparadoIndice = distPulgarIndice > 0.3; // en L están bastante separados

  return indiceExt && pulgarExt && pulgarSeparadoIndice;
}

// M: índice, medio y anular extendidos, meñique flexionado, pulgar sobre palma
function detectarM(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const tresExtendidos = distIndice > 0.3 && distMedio > 0.35 && distAnular > 0.35;
  const meniqueFlex = distMenique < 0.15;
  const juntos = distIndiceMedio < 0.1;
  const pulgarEnPalma = distPulgarNudilloIndice < 0.15;

  return tresExtendidos && meniqueFlex && juntos && pulgarEnPalma;
}

// Ñ: igual que H pero con pulgar entre los dedos (usamos la misma función que H)
// Para simplificar, usaremos la función detectarH también para Ñ
function detectarÑ(landmarks) {
  return detectarH(landmarks); // misma forma
}

// R: índice y medio juntos, pulgar tocando el índice
function detectarR(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const indiceExt = distIndice > 0.25;
  const medioExt = distMedio > 0.3;
  const otrosFlex = distAnular < 0.2 && distMenique < 0.2;
  const juntos = distIndiceMedio < 0.1;
  const pulgarTocandoIndice = distPulgarNudilloIndice < 0.05; // muy pequeño

  return indiceExt && medioExt && otrosFlex && juntos && pulgarTocandoIndice;
}

// W: índice, medio y anular extendidos, separados, pulgar sobre palma
function detectarW(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distIndiceMedio = Math.hypot(landmarks[INDEX_TIP].x - landmarks[MIDDLE_TIP].x, landmarks[INDEX_TIP].y - landmarks[MIDDLE_TIP].y);
  const distPulgarNudilloIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_MCP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_MCP].y);

  const tresExtendidos = distIndice > 0.25 && distMedio > 0.3 && distAnular > 0.3;
  const meniqueFlex = distMenique < 0.15;
  const separados = distIndiceMedio > 0.15; // no juntos como en M
  const pulgarEnPalma = distPulgarNudilloIndice < 0.2;

  return tresExtendidos && meniqueFlex && separados && pulgarEnPalma;
}

// Funciones X, Y, Z pendientes de diagnóstico (placeholder)
function detectarX(landmarks) { return false; }
function detectarY(landmarks) { return false; }
function detectarZ(landmarks) { return false; }
export default HandTracker;