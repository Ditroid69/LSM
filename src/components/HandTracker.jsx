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
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esB && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra C
               if (letraRef.current === 'C') {
                const esC = detectarC(landmarks);
                if (esC && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esC && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              //Detectar letra D
               if (letraRef.current === 'D') {
                const esD = detectarD(landmarks);
                if (esD && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esD && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra E
              if (letraRef.current === 'E') {
                const esE = detectarE(landmarks);
                if (esE && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esE && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra S
              if (letraRef.current === 'S') {
                const esS = detectarS(landmarks);
                if (esS && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esS && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra T
              if (letraRef.current === 'T') {
                const esT = detectarT(landmarks);
                if (esT && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esT && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
                            // Detectar letra F
              if (letraRef.current === 'F') {
                const esF = detectarF(landmarks);
                if (esF && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esF && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra U
              if (letraRef.current === 'U') {
                const esU = detectarU(landmarks);
                if (esU && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esU && aciertoRef.current) {
                  aciertoRef.current = false;
                  setAcierto(false);
                }
              }
              // Detectar letra O
              if (letraRef.current === 'O') {
                const esO = detectarO(landmarks);
                if (esO && !aciertoRef.current) {
                  aciertoRef.current = true;
                  setAcierto(true);
                  if (onAcierto) onAcierto(letraRef.current);
                } else if (!esO && aciertoRef.current) {
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
export default HandTracker;