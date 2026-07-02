import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Menu from './pages/Menu';
import Leccion from './pages/Leccion';
import Practica from './pages/Practica';
import Layout from './components/Layout';
import AbecedarioMenu from './pages/AbecedarioMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route element={<Layout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/practica" element={<Practica />} />
          <Route path="/abecedario" element={<AbecedarioMenu />} />
          <Route path="/leccion/:id/:bloque" element={<Leccion />} />
          <Route path="/leccion/:id" element={<Leccion />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;