import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import logo from '../assets/logo.png'; // ajusta la extensión si es .svg o .jpg

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya hay nombre guardado
  useEffect(() => {
    const verificarNombre = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) {
        navigate('/menu', { replace: true });
      }
    };
    verificarNombre();
  }, [navigate]);

  const manejarEntrar = async () => {
    if (nombre.trim() === '') return;
    setCargando(true);
    await Preferences.set({ key: 'nombre', value: nombre.trim() });

    // Simular carga (1.5 segundos) y luego ir al menú
    setTimeout(() => {
      navigate('/menu');
    }, 1500);
  };

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
      {/* Logo grande */}
      <img 
        src={logo} 
        alt="Logo" 
        style={{ width: 180, height: 'auto', marginBottom: 30 }} 
      />

      {!cargando ? (
        <>
          {/* Campo de nombre */}
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
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 'bold', color: '#2F7EEA', marginBottom: 15 }}>
            Cargando...
          </p>
          <div style={{
            width: 200,
            height: 6,
            backgroundColor: '#e0e0e0',
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#41D6C3',
              animation: 'carga 1.5s linear forwards'
            }}></div>
          </div>
          {/* Keyframes para la animación de la barra */}
          <style>{`
            @keyframes carga {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Inicio;