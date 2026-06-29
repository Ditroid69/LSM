import HandTracker from '../components/HandTracker';
import { useNavigate } from 'react-router-dom';

const Practica = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Práctica de señas</h2>
     <HandTracker letraObjetivo="A" />
      <button
        onClick={() => navigate('/menu')}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        Volver al menú
      </button>
    </div>
  );
};

export default Practica;