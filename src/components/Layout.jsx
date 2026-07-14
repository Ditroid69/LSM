import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const Layout = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cargar = async () => {
      const { value } = await Preferences.get({ key: 'nombre' });
      if (value) setNombre(value);
    };
    cargar();
  }, []);

  // Determinar si mostrar el botón de retroceso
  const esNivel = location.pathname.includes('/nivel1') ||
                  location.pathname.includes('/nivel2') ||
                  location.pathname.includes('/nivel3');
  const esInicio = location.pathname === '/';
  const esMenu = location.pathname === '/menu';
  const mostrarBotonAtras = !esNivel && !esInicio && !esMenu;

  // Función que devuelve la ruta a la que debe ir el botón "atrás"
  const handleBack = () => {
    const path = location.pathname;
    if (path.startsWith('/bloque/')) {
      navigate('/abecedario');
    } else if (path === '/abecedario' || path === '/practica') {
      navigate('/menu');
    } else {
      navigate('/menu'); // fallback
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Barra de navegación superior */}
      <nav style={{
        backgroundColor: '#41D6C3',
        color: '#FFFFFF',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 18,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Botón de retroceso (absoluto, solo en páginas permitidas) */}
        {mostrarBotonAtras && (
          <button
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 28,
              cursor: 'pointer',
              padding: '0 5px',
              lineHeight: 1
            }}
          >
            ←
          </button>
        )}

        {/* Logo */}
        <div style={{
          width: 40,
          height: 40,
          backgroundColor: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          color: '#2F7EEA',
          marginLeft: mostrarBotonAtras ? 40 : 0
        }}>
          LSM
        </div>

        {/* Nombre centrado */}
        <span style={{ fontWeight: 'bold', flex: 1, textAlign: 'center', color: '#FFFFFF' }}>
          {nombre || 'Aprendiz'}
        </span>

        {/* Botón de ajustes */}
        <button style={{
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          fontSize: 24,
          cursor: 'pointer',
          padding: 5
        }}>
          ⚙️
        </button>
      </nav>

      <main style={{ flex: 1, padding: 10, backgroundColor: '#F5F7FA' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;