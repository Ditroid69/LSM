import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import logo from '../assets/logo.png'; // ajusta la extensión si es .svg o .jpg

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [modo, setModo] = useState('inicial'); // 'inicial' | 'input' | 'loading'
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Verificar nombre guardado al montar
  useEffect(() => {
    const verificar = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) {
        // Nombre existente → splash de carga y luego menú
        setModo('loading');
        timerRef.current = setTimeout(() => {
          navigate('/menu', { replace: true });
        }, 1500);
      } else {
        // Sin nombre → formulario de entrada
        setModo('input');
      }
    };
    verificar();

    // Limpiar temporizador al desmontar
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate]);

  // Manejar envío del nombre
  const manejarEntrar = async () => {
    if (nombre.trim() === '') return;
    setModo('loading');
    await Preferences.set({ key: 'nombre', value: nombre.trim() });

    timerRef.current = setTimeout(() => {
      navigate('/menu');
    }, 1500);
  };

  // Pantalla de carga (compartida para splash inicial y tras envío)
  if (modo === 'loading') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: 20,
        textAlign: 'center'
      }}>
        <img src={logo} alt="Logo" style={{ width: 180, height: 'auto', marginBottom: 30 }} />
        <p style={{ fontSize: 18, fontWeight: 'bold', color: '#2F7EEA', marginBottom: 15 }}>
          Cargando...
        </p>
        <div style={{ width: 200, height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#41D6C3',
            animation: 'carga 1.5s linear forwards'
          }}></div>
        </div>
        <style>{`
          @keyframes carga {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // Pantalla de ingreso del nombre (solo si no hay nombre guardado)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#F5F7FA',
      padding: 20
    }}>
      <img src={logo} alt="Logo" style={{ width: 180, height: 'auto', marginBottom: 30 }} />
      <div style={{ width: '100%', maxWidth: 300 }}>
        <label style={{ fontWeight: 'bold', marginBottom: 5, display: 'block', color: '#333' }}>
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: '2px solid #41D6C3',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <button
        onClick={manejarEntrar}
        disabled={nombre.trim() === ''}
        style={{
          marginTop: 25,
          padding: '12px 30px',
          fontSize: 18,
          backgroundColor: nombre.trim() === '' ? '#ccc' : '#4AA7F7',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: nombre.trim() === '' ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
      >
        Entrar
      </button>
    </div>
  );
};

export default Inicio;