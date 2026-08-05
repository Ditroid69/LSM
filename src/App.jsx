import { useCallback, useState } from 'react';
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
import ActividadesAbecedario from './modules/abecedario/ActividadesAbecedario';
import RelacionarSenas from './modules/abecedario/RelacionarSenas';
import DeletreoPalabras from './modules/abecedario/DeletreoPalabras';
import MemoramaAbecedario from './modules/abecedario/MemoramaAbecedario';
import { ThemeProvider } from './context/ThemeContext';
import NumerosMenu from './modules/numeros/NumerosMenu';
import CaminoNivelesNumeros from './modules/numeros/CaminoNivelesNumeros';
import Nivel1CarruselNumeros from './modules/numeros/Nivel1Carrusel';
import Nivel2EjerciciosNumeros from './modules/numeros/Nivel2Ejercicios';
import Nivel3CamaraNumeros from './modules/numeros/Nivel3Camara';
import SaludosMenu from './modules/saludos/SaludosMenu';
import CaminoNivelesSaludos from './modules/saludos/CaminoNivelesSaludos';
import Nivel1Saludos from './modules/saludos/Nivel1Saludos';
import Nivel2Saludos from './modules/saludos/Nivel2Saludos';
import ComunicacionMenu from './modules/comunicacion/ComunicacionMenu';
import CaminoNivelesComunicacion from './modules/comunicacion/CaminoNivelesComunicacion';
import Nivel1Comunicacion from './modules/comunicacion/Nivel1Comunicacion';
import Nivel2Comunicacion from './modules/comunicacion/Nivel2Comunicacion';
import './index.css';
function App() {
  const [inicioCompletado, setInicioCompletado] = useState(false);
  const completarInicio = useCallback(() => setInicioCompletado(true), []);

  return (
     <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio onCompletar={completarInicio} />} />
        <Route element={inicioCompletado ? <Layout /> : <Navigate to="/" replace />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/practica" element={<Practica />} />
          <Route path="/abecedario" element={<AbecedarioMenu />} />
          <Route path="/bloque/:idBloque" element={<CaminoNiveles />} />
          <Route path="/bloque/:idBloque/nivel1" element={<Nivel1Carrusel />} />
          <Route path="/bloque/:idBloque/nivel2" element={<Nivel2Ejercicios />} />
          <Route path="/bloque/:idBloque/nivel3" element={<Nivel3Camara />} />
          <Route path="/abecedario/actividades" element={<ActividadesAbecedario />} />
          <Route path="/abecedario/actividades/relacionar" element={<RelacionarSenas />} />
          <Route path="/abecedario/actividades/deletreo" element={<DeletreoPalabras />} />
          <Route path="/abecedario/actividades/memorama" element={<MemoramaAbecedario />} />
          <Route path="/numeros" element={<NumerosMenu />} />
          <Route path="/numeros/bloque/:idBloque" element={<CaminoNivelesNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel1" element={<Nivel1CarruselNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel2" element={<Nivel2EjerciciosNumeros />} />
          <Route path="/numeros/bloque/:idBloque/nivel3" element={<Nivel3CamaraNumeros />} />
          <Route path="/saludos" element={<SaludosMenu />} />
          <Route path="/saludos/modulo/:idModulo" element={<CaminoNivelesSaludos />} />
          <Route path="/saludos/modulo/:idModulo/nivel1" element={<Nivel1Saludos />} />
          <Route path="/saludos/modulo/:idModulo/nivel2" element={<Nivel2Saludos />} />
          <Route path="/comunicacion" element={<ComunicacionMenu />} />
          <Route path="/comunicacion/modulo/:idModulo" element={<CaminoNivelesComunicacion />} />
          <Route path="/comunicacion/modulo/:idModulo/nivel1" element={<Nivel1Comunicacion />} />
          <Route path="/comunicacion/modulo/:idModulo/nivel2" element={<Nivel2Comunicacion />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
