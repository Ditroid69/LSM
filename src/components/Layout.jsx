import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';   // añade Outlet
import { Preferences } from '@capacitor/preferences';

const Layout = () => {   // ya no necesita recibir children
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de navegación superior */}
      <nav style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 18
      }}>
        <div style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: '50%' }}></div>
        <span style={{ fontWeight: 'bold' }}>{nombre || 'Aprendiz'}</span>
        <button style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}>⚙️</button>
      </nav>

      <main style={{ flex: 1, padding: 10 }}>
        <Outlet />   {/* Aquí se renderizará cada página (Menú, Lección, etc.) */}
      </main>
    </div>
  );
};

export default Layout;