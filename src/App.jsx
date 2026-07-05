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

function App() {
  return (
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;