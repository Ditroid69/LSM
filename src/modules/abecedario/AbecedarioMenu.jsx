import { useNavigate } from 'react-router-dom';

const bloques = [
  { id: 1, letras: ['A', 'E', 'S', 'T', 'O'] },
  { id: 2, letras: ['B', 'C', 'D', 'F', 'U'] },
  { id: 3, letras: ['I', 'K', 'P', 'V', 'W'] },
  { id: 4, letras: ['L', 'M', 'Ñ', 'R'] },
  { id: 5, letras: ['G', 'H', 'X', 'Y', 'Z'] },
];

const AbecedarioMenu = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Abecedario</h2>
      <p style={{ textAlign: 'center' }}>Elige un bloque de letras</p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 20
      }}>
        {bloques.map((bloque) => (
          <div
            key={bloque.id}
            onClick={() => navigate(`/bloque/${bloque.id}`)}
            style={{
              backgroundColor: '#FF7043',
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
            <span>{bloque.letras.join(' · ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbecedarioMenu;