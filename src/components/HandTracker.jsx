import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import styles from './HandTracker.module.css';

const HandTracker = ({ letraObjetivo, onAcierto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
  const falloVisibleRef = useRef(false);
  const validacionCompletaRef = useRef(false);
  const enviandoFrameRef = useRef(false);
  const fallosConsecutivosRef = useRef(0);
  const letraRef = useRef(letraObjetivo);
  const onAciertoRef = useRef(onAcierto);
  const [handDetected, setHandDetected] = useState(false);   // ¿hay mano en cámara?
    const [validacionCompleta, setValidacionCompleta] = useState(false);

  // Mantener letraRef sincronizado con la prop
  // Reiniciar todo solo al cambiar de letra
  useEffect(() => {
    letraRef.current = letraObjetivo;
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    validandoRef.current = false;
    progressRef.current = 0;
    falloVisibleRef.current = false;
    validacionCompletaRef.current = false;
    fallosConsecutivosRef.current = 0;
    const reinicioId = requestAnimationFrame(() => {
      setProgress(0);
      setValidando(false);
      setFalloVisible(false);
      setHandDetected(false);
      setValidacionCompleta(false);
    });
    return () => cancelAnimationFrame(reinicioId);
  }, [letraObjetivo]);

  // Actualizar callback sin reiniciar nada
  useEffect(() => {
    onAciertoRef.current = onAcierto;
  }, [onAcierto]);

  
  useEffect(() => {
    let cancelado = false;
    let primerResultadoRecibido = false;

    const { Hands, Camera: MediaPipeCamera } = window;
    const { drawConnectors, drawLandmarks } = window;
    const { HAND_CONNECTIONS } = window;

    const iniciar = async () => {
      try {
        if (!Hands || !MediaPipeCamera || !drawConnectors || !drawLandmarks || !HAND_CONNECTIONS) {
          throw new Error('No se pudo cargar el motor local de reconocimiento de manos.');
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Este dispositivo no ofrece acceso compatible a la cámara.');
        }
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

        video.muted = true;

        const hands = new Hands({
          locateFile: (file) =>
           `/vendor/mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.65
        });

        hands.onResults((results) => {
          if (cancelado) return;

          if (!primerResultadoRecibido) {
            primerResultadoRecibido = true;
            setStatus('listo');
          }
          
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Actualizar si hay mano presente
          if (results.multiHandLandmarks?.length) {
            setHandDetected(true);
          } else {
            setHandDetected(false);
            // Si estábamos validando y la mano desaparece, es un fallo
            if (validandoRef.current || progressRef.current > 0) {
              clearInterval(intervaloRef.current);
              validandoRef.current = false;
              progressRef.current = 0;
              setValidando(false);
              setProgress(0);
              setFalloVisible(true);
              falloVisibleRef.current = true;
            }
          }
          if (results.multiHandLandmarks?.length) {
            for (const landmarks of results.multiHandLandmarks) {
               if (validacionCompletaRef.current) return;
              // El video 4:3 se recorta al centro para llenar el visor circular.
              // Aplicamos la misma transformación a los puntos para que la
              // superposición siga exactamente la posición de la mano.
              const proporcionVideo = video.videoWidth && video.videoHeight
                ? video.videoWidth / video.videoHeight
                : 4 / 3;
              const landmarksVisuales = landmarks.map((punto) => {
                if (proporcionVideo >= 1) {
                  return {
                    ...punto,
                    x: (punto.x * proporcionVideo) - ((proporcionVideo - 1) / 2),
                  };
                }
                const proporcionVertical = 1 / proporcionVideo;
                return {
                  ...punto,
                  y: (punto.y * proporcionVertical) - ((proporcionVertical - 1) / 2),
                };
              });
              drawConnectors(ctx, landmarksVisuales, HAND_CONNECTIONS, {
                color: '#41D6C3',
                lineWidth: 4
              });
              drawLandmarks(ctx, landmarksVisuales, {
                color: '#1E3A8A',
                fillColor: '#FED301',
                lineWidth: 2,
                radius: 4
              });
              // Solo evaluar si no se ha completado aún
              if (!validacionCompletaRef.current) {
                const letra = letraRef.current;
                registrarDiagnosticoLetra(letra, landmarks);
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
                else if (letra === 'P') esCorrecta = detectarKP(landmarks);
                else if (letra === 'V') esCorrecta = detectarV(landmarks);
                else if (letra === 'W') esCorrecta = detectarW(landmarks);
                else if (letra === 'G') esCorrecta = detectarG(landmarks);
                else if (letra === 'H') esCorrecta = detectarH(landmarks);
                else if (letra === 'L') esCorrecta = detectarL(landmarks);
                else if (letra === 'M') esCorrecta = detectarM(landmarks);
                else if (letra === 'N') esCorrecta = detectarN(landmarks);
                else if (letra === 'R') esCorrecta = detectarR(landmarks);
                else if (letra === 'X') esCorrecta = detectarX(landmarks);
                else if (letra === 'Y') esCorrecta = detectarY(landmarks);
                else if (letra === '1') esCorrecta = detectar1(landmarks);
                else if (letra === '2') esCorrecta = detectar2(landmarks);
                else if (letra === '3') esCorrecta = detectar3(landmarks);
                else if (letra === '4') esCorrecta = detectar4(landmarks);
                else if (letra === '5') esCorrecta = detectar5(landmarks);
                else if (letra === '6') esCorrecta = detectar6(landmarks);
                else if (letra === '7') esCorrecta = detectar7(landmarks);
                else if (letra === '8') esCorrecta = detectar8(landmarks);
              

                // ===== LÓGICA DE TEMPORIZADOR =====
                if (esCorrecta) {
                  fallosConsecutivosRef.current = 0;
                  if (falloVisibleRef.current) {
                    falloVisibleRef.current = false;
                    setFalloVisible(false);
                  }
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
                        validacionCompletaRef.current = true;
                        setValidacionCompleta(true);
                        if (onAciertoRef.current) onAciertoRef.current(letra);
                      } else {
                        setProgress(progressRef.current);
                      }
                    }, 50);
                  }
                } else {
                  if (validandoRef.current) {
                    fallosConsecutivosRef.current += 1;
                    // Tolera variaciones breves del seguimiento para que una
                    // lectura aislada no cancele una seña bien sostenida.
                    if (fallosConsecutivosRef.current < 6) continue;
                    clearInterval(intervaloRef.current);
                    validandoRef.current = false;
                    fallosConsecutivosRef.current = 0;
                    setValidando(false);
                    progressRef.current = 0;
                    setProgress(0);
                    setFalloVisible(true);
                    falloVisibleRef.current = true; 
                  }
                }
              }
            }
          }
        });

        handsRef.current = hands;

        const camera = new MediaPipeCamera(video, {
          onFrame: async () => {
            if (handsRef.current && !cancelado && !enviandoFrameRef.current) {
              enviandoFrameRef.current = true;
              try {
                await handsRef.current.send({ image: video });
              } finally {
                enviandoFrameRef.current = false;
              }
            }
          },
          width: 960,
          height: 720,
          facingMode: 'user'
        });

        cameraRef.current = camera;
        await camera.start();
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setStatus('error');
          const detalle = err?.message || '';
          setMensajeError(
            detalle.includes('Module.arguments')
              ? 'No se pudo preparar el modelo de reconocimiento. Cierra la pantalla e inténtalo nuevamente.'
              : detalle || 'Error desconocido'
          );
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
      validandoRef.current = false;
      enviandoFrameRef.current = false;
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, []);
  return (
    <div className={styles.tracker}>
      {status === 'cargando' && (
        <div className={styles.loading}>
          <span className={styles.spinner} />
          <strong>Preparando la cámara</strong>
          <p>Estamos cargando el reconocimiento de manos…</p>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <span className={styles.errorIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3 2.8 19h18.4z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </span>
          <div>
            <h3>No pudimos iniciar la cámara</h3>
            <pre>{mensajeError}</pre>
          </div>
        </div>
      )}

        <div className={`${styles.ready} ${status !== 'listo' ? styles.captureHidden : ''}`} aria-hidden={status !== 'listo'}>
          <div className={styles.cameraShell}>
            <div className={styles.camera}>
              <video ref={videoRef} className={styles.sourceVideo} playsInline muted autoPlay />
              <canvas
                ref={canvasRef}
                width={640}
                height={640}
                className={styles.canvas}
              />
            </div>

            {(handDetected || falloVisible || validacionCompleta) && (
              <svg viewBox="0 0 100 100" className={styles.progressRing}>
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="var(--camera-border)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke={
                    validacionCompleta
                      ? 'var(--camera-success)'
                      : falloVisible
                        ? 'var(--camera-error)'
                        : 'var(--camera-soft)'
                  }
                  strokeWidth="2.5"
                />
                {(validando || validacionCompleta) && !falloVisible && (
                  <circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill="none"
                    stroke="var(--camera-success)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 47}
                    strokeDashoffset={2 * Math.PI * 47 * (1 - (validacionCompleta ? 100 : progress) / 100)}
                    className={styles.progressArc}
                  />
                )}
              </svg>
            )}

            {falloVisible && !validacionCompleta && (
              <span className={styles.errorMark} aria-label="Seña incorrecta">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7l10 10M17 7 7 17" />
                </svg>
              </span>
            )}

            <span className={`${styles.cameraStatus} ${handDetected ? styles.handVisible : ''}`}>
              <span />
              {handDetected ? 'Mano detectada' : 'Muestra tu mano'}
            </span>
          </div>

          {letraObjetivo && (
            <div className={styles.target}>
              <span>Objetivo</span>
              <strong>{letraObjetivo}</strong>
            </div>
          )}

        </div>
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

  // console.log('D debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarMedio, indiceExtendido, otrosFlexionados, pulgarTocandoMedio });

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

 // console.log('E debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarIndice, dedosFlexionados, pulgarCerca });

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

  //console.log('T debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarBase, distPulgarIndice, distPulgarMedio, dedosFlexionados, pulgarExtendido, pulgarEntreDedos });

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
        THUMB_TIP = 4;

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

  //console.log('I debug:', { distIndice, distMedio, distAnular, distMenique, distPulgarNudilloIndice, meniqueExtendido, otrosFlexionados, pulgarEnNudillo });

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

// N conserva por ahora la regla existente basada en la configuración de H.
// Ñ se excluye porque pertenece al módulo de letras con movimiento.
function detectarN(landmarks) {
  return detectarH(landmarks);
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

// X: todos los dedos cerrados, con el índice ligeramente levantado y curvado.
function detectarX(landmarks) {
  const distancia = (a, b) => Math.hypot(
    landmarks[a].x - landmarks[b].x,
    landmarks[a].y - landmarks[b].y
  );

  const distIndice = distancia(8, 5);
  const distMedio = distancia(12, 9);
  const distAnular = distancia(16, 13);
  const distMenique = distancia(20, 17);
  const distPulgarBase = distancia(4, 1);
  const distPulgarNudilloIndice = distancia(4, 5);

  const indiceCurvado = distIndice > 0.075 && distIndice < 0.17;
  const otrosCerrados = distMedio < 0.14 && distAnular < 0.14 && distMenique < 0.13;
  const pulgarRecogido = distPulgarBase > 0.12 && distPulgarBase < 0.26;
  const pulgarCercaDelIndice = distPulgarNudilloIndice < 0.1;

  return indiceCurvado && otrosCerrados && pulgarRecogido && pulgarCercaDelIndice;
}

// Diagnóstico temporal para calibrar los detectores de X y Y.
// Se ejecuta dentro del ciclo de resultados y muestra las medidas en consola.
function registrarDiagnosticoLetra(letra, landmarks) {
  if (letra !== 'X' && letra !== 'Y') return;

  const distancia = (a, b) => Math.hypot(
    landmarks[a].x - landmarks[b].x,
    landmarks[a].y - landmarks[b].y
  );

  const medidas = {
    distIndice: distancia(8, 5),
    distMedio: distancia(12, 9),
    distAnular: distancia(16, 13),
    distMenique: distancia(20, 17),
    distPulgarBase: distancia(4, 1),
    distPulgarIndice: distancia(4, 8),
    distPulgarNudilloIndice: distancia(4, 5),
  };

  if (letra === 'X') {
    Object.assign(medidas, {
      indiceBasePip: distancia(5, 6),
      indicePipDip: distancia(6, 7),
      indiceDipPunta: distancia(7, 8),
      indicePipPunta: distancia(6, 8),
      indiceBasePunta: distancia(5, 8),
      puntaIndiceSobrePip: landmarks[8].y < landmarks[6].y,
      puntaIndiceSobreBase: landmarks[8].y < landmarks[5].y,
    });
  }

  console.log(`${letra} debug:`, medidas);
}

// Y: pulgar y meñique extendidos; índice, medio y anular flexionados.
// Z no se valida aquí porque requiere reconocer una trayectoria.
function detectarY(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5,
        MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13,
        PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;

  const distIndice = Math.hypot(
    landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x,
    landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y
  );
  const distMedio = Math.hypot(
    landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x,
    landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y
  );
  const distAnular = Math.hypot(
    landmarks[RING_TIP].x - landmarks[RING_MCP].x,
    landmarks[RING_TIP].y - landmarks[RING_MCP].y
  );
  const distMenique = Math.hypot(
    landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x,
    landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y
  );
  const distPulgarBase = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x,
    landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y
  );
  const distPulgarIndice = Math.hypot(
    landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x,
    landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y
  );

  const tresFlexionados = distIndice < 0.14 && distMedio < 0.14 && distAnular < 0.14;
  const meniqueExtendido = distMenique > 0.14;
  const pulgarExtendido = distPulgarBase > 0.17;
  const pulgarSeparado = distPulgarIndice > 0.1;

  return tresFlexionados && meniqueExtendido && pulgarExtendido && pulgarSeparado;
}

// Número 1: índice extendido, otros flexionados, pulgar extendido y separado del índice
function detectar1(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);

  const indiceExtendido = distIndice > 0.25;
  const otrosFlexionados = distMedio < 0.22 && distAnular < 0.22 && distMenique < 0.22;
  const pulgarExtendido = distPulgarBase > 0.25;
  const pulgarSeparado = distPulgarIndice > 0.28;

  return indiceExtendido && otrosFlexionados && pulgarExtendido && pulgarSeparado;
}

// Número 2: índice y medio extendidos, anular y meñique flexionados, pulgar flexionado (sobre palma)
function detectar2(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const dosExtendidos = distIndice > 0.25 && distMedio > 0.3;
  const otrosFlexionados = distAnular < 0.2 && distMenique < 0.2;
  const pulgarFlexionado = distPulgarBase < 0.28;

  return dosExtendidos && otrosFlexionados && pulgarFlexionado;
}

// Número 3: índice, medio y anular extendidos, meñique flexionado, pulgar flexionado
function detectar3(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const tresExtendidos = distIndice > 0.25 && distMedio > 0.3 && distAnular > 0.3;
  const meniqueFlexionado = distMenique < 0.15;
  const pulgarFlexionado = distPulgarBase < 0.28;

  return tresExtendidos && meniqueFlexionado && pulgarFlexionado;
}

// Número 4: todos los dedos extendidos, pulgar flexionado (sobre palma)
function detectar4(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const todosExtendidos = distIndice > 0.25 && distMedio > 0.28 && distAnular > 0.28 && distMenique > 0.2;
  const pulgarFlexionado = distPulgarBase < 0.3;

  return todosExtendidos && pulgarFlexionado;
}

// Número 5: todos los dedos extendidos, pulgar NO flexionado (mano abierta completa)
function detectar5(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const todosExtendidos = distIndice > 0.22 && distMedio > 0.25 && distAnular > 0.25 && distMenique > 0.2;
  const pulgarExtendido = distPulgarBase > 0.28; // pulgar extendido, no doblado

  return todosExtendidos && pulgarExtendido;
}

// Número 6: todos los dedos flexionados, pulgar extendido (puño con pulgar afuera, similar a A pero pulgar más separado)
function detectar6(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);
  const distPulgarIndice = Math.hypot(landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x, landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y);

  const todosFlexionados = distIndice < 0.18 && distMedio < 0.15 && distAnular < 0.15 && distMenique < 0.1;
  const pulgarExtendido = distPulgarBase > 0.28;
  const pulgarSeparado = distPulgarIndice > 0.25;

  return todosFlexionados && pulgarExtendido && pulgarSeparado;
}

// Número 7: índice extendido, pulgar extendido, otros flexionados (como L)
function detectar7(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const indiceExtendido = distIndice > 0.25;
  const otrosFlexionados = distMedio < 0.15 && distAnular < 0.1 && distMenique < 0.1;
  const pulgarExtendido = distPulgarBase > 0.3;

  return indiceExtendido && otrosFlexionados && pulgarExtendido;
}

// Número 8: índice y medio extendidos, pulgar flexionado (similar a 2 pero pulgar más cerca)
function detectar8(landmarks) {
  const INDEX_TIP = 8, INDEX_MCP = 5, MIDDLE_TIP = 12, MIDDLE_MCP = 9,
        RING_TIP = 16, RING_MCP = 13, PINKY_TIP = 20, PINKY_MCP = 17,
        THUMB_TIP = 4, THUMB_CMC = 1;
  const distIndice = Math.hypot(landmarks[INDEX_TIP].x - landmarks[INDEX_MCP].x, landmarks[INDEX_TIP].y - landmarks[INDEX_MCP].y);
  const distMedio = Math.hypot(landmarks[MIDDLE_TIP].x - landmarks[MIDDLE_MCP].x, landmarks[MIDDLE_TIP].y - landmarks[MIDDLE_MCP].y);
  const distAnular = Math.hypot(landmarks[RING_TIP].x - landmarks[RING_MCP].x, landmarks[RING_TIP].y - landmarks[RING_MCP].y);
  const distMenique = Math.hypot(landmarks[PINKY_TIP].x - landmarks[PINKY_MCP].x, landmarks[PINKY_TIP].y - landmarks[PINKY_MCP].y);
  const distPulgarBase = Math.hypot(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x, landmarks[THUMB_TIP].y - landmarks[THUMB_CMC].y);

  const dosExtendidos = distIndice > 0.22 && distMedio > 0.28;
  const otrosFlexionados = distAnular < 0.15 && distMenique < 0.1;
  const pulgarFlexionado = distPulgarBase < 0.3;

  return dosExtendidos && otrosFlexionados && pulgarFlexionado;
}
export default React.memo(HandTracker);
