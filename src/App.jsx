import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Menu from './pages/Menu';
import Practica from './pages/Practica';
import Layout from './components/Layout';
import AbecedarioMenu from './modules/abecedario/AbecedarioMenu';
import CaminoNiveles from './modules/abecedario/CaminoNiveles';
import Nivel1Carrusel from './modules/abecedario/Nivel1Carrusel';
import Nivel2Ejercicios from './modules/abecedario/Nivel2Ejercicios';
import Nivel3Camara from './modules/abecedario/Nivel3Camara';
import { ThemeProvider } from './context/ThemeContext';
import NumerosMenu from './modules/numeros/NumerosMenu';
import CaminoNivelesNumeros from './modules/numeros/CaminoNivelesNumeros';
import Nivel1CarruselNumeros from './modules/numeros/Nivel1Carrusel';
import Nivel2EjerciciosNumeros from './modules/numeros/Nivel2Ejercicios';
import Nivel3CamaraNumeros from './modules/numeros/Nivel3Camara';
import './index.css';
function App() {
  return (
     <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route element={<Layout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/practica" element={<Practica />} />
          <Route path="/abecedario" element={<AbecedarioMenu />} />
          <Route path="/bloque/:idBloque" element={<CaminoNiveles />} />
          <Route path="/bloque/:idBloque/nivel1" element={<Nivel1Carrusel />} />
          <Route path="/bloque/:idBloque/nivel2" element={<Nivel2Ejercicios />} />
          <Route path="/bloque/:idBloque/nivel3" element={<Nivel3Camara />} />
          <Route path="/numeros" element={<NumerosMenu />} />
          <Route path="/numeros/bloque/:idBloque" element={<CaminoNivelesNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel1" element={<Nivel1CarruselNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel2" element={<Nivel2EjerciciosNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel3" element={<Nivel3CamaraNumeros />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;