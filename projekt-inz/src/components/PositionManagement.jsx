import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [newPositionName, setNewPositionName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/stanowiska');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych stanowisk');
        }
        const data = await response.json();
        setPositions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeletePosition = async (positionId, positionName) => {

    if (positionName === 'Administrator') {
      toast.error('Nie można usunąć administratora systemu', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/delete_stanowisko/${positionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania stanowiska');
      }

      // Aktualizuj listę stanowisk po usunięciu
      const updatedPositions = positions.filter((position) => position.id !== positionId);
      setPositions(updatedPositions);

      // Pokaż toast po pomyślnym usunięciu
      toast.success('Stanowisko zostało pomyślnie usunięte', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
      // Możesz także dodać ogólny toast na wypadek innych błędów
      toast.error('Nie można usunąć stanowiska, które jest przypisane do pracownika', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleAddPosition = async () => {
    if (!newPositionName) {
      // Wyświetl toast, jeśli pole tekstowe jest puste
      toast.error('Nazwa stanowiska nie może być pusta', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add_stanowisko', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nazwa_stanowiska: newPositionName }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania stanowiska');
      }

      // Aktualizuj listę stanowisk po dodaniu
      const newPosition = await response.json();
      setPositions([...positions, newPosition]);

      // Wyczyść pole tekstowe po dodaniu
      setNewPositionName('');

      // Pokaż toast po pomyślnym dodaniu
      toast.success('Stanowisko zostało pomyślnie dodane', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="position-management-container">
    <h2 className="position-title">Zarządzanie stanowiskami</h2>
    <table className="position-table">
        <thead>
            <tr>
                <th>Nazwa Stanowiska</th>
                <th>Akcja</th>
            </tr>
        </thead>
        <tbody>
            {positions.map((position) => (
                <tr key={position.id} className="position-row">
                    <td>{position.nazwa_stanowiska}</td>
                    <td>
                    <button onClick={() => handleDeletePosition(position.id, position.nazwa_stanowiska)} className="delete-button">
                Usuń
              </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className="add-position">
        <h3 className='addingh3'>Dodaj nowe stanowisko:</h3>
        <input
            type="text"
            placeholder="Nazwa stanowiska"
            value={newPositionName}
            onChange={(e) => setNewPositionName(e.target.value)}
            className="position-input"
        />
        <button onClick={handleAddPosition} className="add-button">Dodaj</button>
    </div>
    <ToastContainer />
</div>

  );
};

export default PositionManagement;
