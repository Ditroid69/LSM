import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const modulos = [
  { nombre: 'Abecedario', color: '#FF7043', icono: '🔤', ruta: '/abecedario' },
  { nombre: 'Números', color: '#42A5F5', icono: '🔢', ruta: '/leccion/numeros' },
  { nombre: 'Saludos y cortesía', color: '#66BB6A', icono: '👋', ruta: '/leccion/saludos' },
  { nombre: 'Comunicación básica', color: '#AB47BC', icono: '💬', ruta: '/leccion/comunicacion' },
];

const Menu = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) setNombre(value);
    };
    cargar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginTop: 30
      }}>
        {modulos.map((mod, index) => (
          <div
            key={index}
            onClick={() => navigate(mod.ruta)}
            style={{
              backgroundColor: mod.color,
              borderRadius: 16,
              aspectRatio: '1 / 1',  // cuadrado
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              padding: 15,
              textAlign: 'center',
              color: 'black',
              fontWeight: 'bold',
              fontSize: 20
            }}
          >
            <span style={{ fontSize: 40 }}>{mod.icono}</span>
            <span style={{ marginTop: 10 }}>{mod.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;