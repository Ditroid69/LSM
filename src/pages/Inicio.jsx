import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const Inicio = () => {
  const [nombre, setNombre] = useState('');
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

  const guardarNombre = async () => {
    if (nombre.trim() === '') return;
    await Preferences.set({ key: 'nombre', value: nombre.trim() });
    navigate('/menu');
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>¡Bienvenido!</h1>
      <p>Ingresa tu nombre para comenzar</p>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        style={{ padding: 8, fontSize: 16, width: '80%', maxWidth: 300 }}
      />
      <br />
      <button
        onClick={guardarNombre}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        Entrar
      </button>
    </div>
  );
};

export default Inicio;