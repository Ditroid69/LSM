import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Preferences } from '@capacitor/preferences';

const CLAVE_MODO = 'preferencia_modo_color';

// Paleta de colores según modo
const lightPalette = {
  fondo: '#E6EBFF',           // Fondo principal claro
  barra: '#4AA7F7',           // Barra superior
  texto: '#1E3A8A',           // Texto principal (azul profundo)
  texto2: '#4B5563',          // Texto secundario (gris)
  boton1: '#FED301',          // Botón primario (amarillo)
  boton2: '#41D6C3',          // Botón secundario (turquesa)
  tarjeta: '#FFFFFF',         // Fondo de tarjetas/contenedores
  correcto: '#10B981',        // Verde para aciertos
  incorrecto: '#F97316',      // Naranja para errores
  borde: '#CBD5E1',           // Bordes suaves
  blanco: '#FFFFFF',
  gris: '#E2E8F0',
  icono: '#1e3a8a', // azul oscuro para iconos en modo claro
  tarjetaTexto: '#1E3A8A',
};

const darkPalette = {
  fondo: '#00061A',           // Fondo principal oscuro
  barra: '#1A1A2E',           // Barra superior oscura
  texto: '#FFFFFF',           // Texto principal blanco
  texto2: '#9CA3AF',          // Texto secundario gris claro
  boton1: '#FED301',          // El amarillo se mantiene
  boton2: '#41D6C3',          // Turquesa
  tarjeta: '#16213E',         // Fondo de tarjetas oscuro
  correcto: '#10B981',        // Verde
  incorrecto: '#F97316',      // Naranja
  borde: '#334155',           // Bordes oscuros
  blanco: '#1E1E1E',
  gris: '#334155',
  icono: '#ffffff', // blanco para iconos en modo oscuro
  tarjetaTexto: '#FFFFFF',

};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [modo, setModo] = useState('claro'); // 'claro' o 'oscuro'
  const [preferenciaCargada, setPreferenciaCargada] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarPreferencia = async () => {
      try {
        const { value } = await Preferences.get({ key: CLAVE_MODO });
        if (activo && (value === 'claro' || value === 'oscuro')) setModo(value);
      } catch (error) {
        console.error('No se pudo cargar la preferencia de apariencia:', error);
      } finally {
        if (activo) setPreferenciaCargada(true);
      }
    };

    cargarPreferencia();
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (!preferenciaCargada) return;
    Preferences.set({ key: CLAVE_MODO, value: modo }).catch((error) => {
      console.error('No se pudo guardar la preferencia de apariencia:', error);
    });
  }, [modo, preferenciaCargada]);

  const theme = useMemo(() => {
    return modo === 'claro' ? lightPalette : darkPalette;
  }, [modo]);

  const toggleModo = () => {
    setModo((prev) => (prev === 'claro' ? 'oscuro' : 'claro'));
  };

  return (
    <ThemeContext.Provider value={{ modo, theme, toggleModo }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
