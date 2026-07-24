import { useNavigate } from 'react-router-dom';

const bloques = [
  { id: 1, nombre: 'Números estáticos', numeros: ['1', '2', '3', '4', '5', '6', '7', '8'] }, // Puedes añadir más números
  { id: 2, nombre: 'Números en movimiento', numeros: [] }, // Placeholder
  { id: 3, nombre: 'Decenas', numeros: [] },
];

const NumerosMenu = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Números</h2>
      <p style={{ textAlign: 'center' }}>Elige un bloque para aprender</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {bloques.map((bloque) => (
          <div
            key={bloque.id}
            onClick={() => navigate(`/numeros/bloque/${bloque.id}`)}
            style={{
              backgroundColor: '#4AA7F7',
              color: 'white',
              padding: 15,
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
              fontSize: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Bloque {bloque.id}</span>
            <span>{bloque.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumerosMenu;