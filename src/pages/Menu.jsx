import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const Menu = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarNombre = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) setNombre(value);
    };
    cargarNombre();
  }, []);

  const lecciones = [
    { nombre: 'Abecedario', ruta: '/leccion/abecedario' },
    { nombre: 'Días de la semana', ruta: '/leccion/dias' },
    { nombre: 'Meses del año', ruta: '/leccion/meses' },
    { nombre: 'Números', ruta: '/leccion/numeros' },
  ];

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>¡Hola, {nombre || 'Aprendiz'}!</h1>
      <p>Selecciona una lección:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {lecciones.map((leccion) => (
          <button
            key={leccion.ruta}
            onClick={() => navigate(leccion.ruta)}
            style={{
              width: '80%',
              maxWidth: 300,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            {leccion.nombre}
          </button>
        ))}
        <button
          onClick={() => navigate('/practica')}
          style={{
            width: '80%',
            maxWidth: 300,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Práctica libre (cámara)
        </button>
      </div>
    </div>
  );
};

export default Menu;