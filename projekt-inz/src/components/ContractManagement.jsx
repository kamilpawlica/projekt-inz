import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContractManagement = () => {
  const [typyUmow, setTypyUmow] = useState([]);
  const [newTypUmowy, setNewTypUmowy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/typy_umow');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych typów umów');
        }
        const data = await response.json();
        setTypyUmow(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTypUmowy = async (typUmowyId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_typ_umowy/${typUmowyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania typu umowy');
      }

      // Aktualizuj listę typów umów po usunięciu
      const updatedTypyUmow = typyUmow.filter((typUmowy) => typUmowy.id !== typUmowyId);
      setTypyUmow(updatedTypyUmow);

      // Pokaż toast po pomyślnym usunięciu
      toast.success('Typ umowy został pomyślnie usunięty', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
      // Możesz także dodać ogólny toast na wypadek innych błędów
      toast.error('Nie można usunąć typu umowy, który jest przypisany do pracownika', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleAddTypUmowy = async () => {
    if (!newTypUmowy) {
      // Wyświetl toast, jeśli pole tekstowe jest puste
      toast.error('Nazwa typu umowy nie może być pusta', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add_typ_umowy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nazwa_typu_umowy: newTypUmowy }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania typu umowy');
      }

      // Aktualizuj listę typów umów po dodaniu
      const newTypUmowa = await response.json();
      setTypyUmow([...typyUmow, newTypUmowa]);

      // Wyczyść pole tekstowe po dodaniu
      setNewTypUmowy('');

      // Pokaż toast po pomyślnym dodaniu
      toast.success('Typ umowy został pomyślnie dodany', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="contract-management-container">
    <h2 className="contract-title">Zarządzanie Umowami</h2>
    <table className="contract-table">
        <thead>
            <tr>
                <th>Nazwa Typu Umowy</th>
                <th>Akcja</th>
            </tr>
        </thead>
        <tbody>
            {typyUmow.map((typUmowy) => (
                <tr key={typUmowy.id} className="contract-row">
                    <td>{typUmowy.nazwa_typu_umowy}</td>
                    <td>
                        <button onClick={() => handleDeleteTypUmowy(typUmowy.id)} className="delete-button">Usuń</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className="add-contract">
    <h3 className='addingh3'>Dodaj nowy typ umowy:</h3>
        <input
            type="text"
            placeholder="Nazwa typu umowy"
            value={newTypUmowy}
            onChange={(e) => setNewTypUmowy(e.target.value)}
            className="contract-input"
        />
        <button onClick={handleAddTypUmowy} className="add-button">Dodaj</button>
    </div>
    <ToastContainer />
</div>

  );
};

export default ContractManagement;
