import { createContext, useContext, useState, useMemo } from 'react';

// Paleta de colores según modo
const lightPalette = {
  fondo: '#F5F7FA',
  texto: '#1e3a8a',         // Azul profundo para textos y encabezados
  boton: '#fed301',         // Amarillo brillante
  seleccion: '#aa36d9',     // Violeta
  correcto: '#10b981',      // Verde
  incorrecto: '#f97316',    // Naranja
  barra: '#41D6C3',         // Turquesa principal (puede mantenerse)
  blanco: '#FFFFFF',
  gris: '#e0e0e0',
};

const darkPalette = {
  fondo: '#121212',
  texto: '#e0e0e0',        // Texto claro sobre fondo oscuro
  boton: '#fed301',         // El amarillo puede mantenerse
  seleccion: '#bb86fc',     // Violeta más claro para modo oscuro
  correcto: '#03dac6',      // Verde azulado
  incorrecto: '#cf6679',    // Rojo suave
  barra: '#1f1f1f',         // Barra oscura
  blanco: '#1e1e1e',
  gris: '#333333',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [modo, setModo] = useState('claro'); // 'claro' o 'oscuro'

  const theme = useMemo(() => {
    return modo === 'claro' ? lightPalette : darkPalette;
  }, [modo]);

  const toggleModo = () => {
    setModo(prev => (prev === 'claro' ? 'oscuro' : 'claro'));
  };

  return (
    <ThemeContext.Provider value={{ modo, theme, toggleModo }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}