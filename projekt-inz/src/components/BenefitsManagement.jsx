import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BenefitsManagement = () => {
  const [benefits, setBenefits] = useState([]);
  const [newBenefitName, setNewBenefitName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/benefity');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych benefitów');
        }
        const data = await response.json();
        setBenefits(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBenefit = async (benefitId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_benefit/${benefitId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        // Próbujemy przechwycić i przeanalizować odpowiedź JSON
        const errorData = await response.json();
        
        // Sprawdź, czy kod błędu to '23503' - naruszenie klucza obcego
        if (errorData.code === '23503') {
          toast.error('Nie można usunąć benefitu, który jest przypisany do pracownika', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          throw new Error('Błąd podczas usuwania benefitu');
        }
        return;
      }
  
      const updatedBenefits = benefits.filter((benefit) => benefit.id !== benefitId);
      setBenefits(updatedBenefits);
  
      toast.success('Benefit został pomyślnie usunięty', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      // Możesz także dodać ogólny toast na wypadek innych błędów
      toast.error('Nie można usunąć benefitu, który jest przypisany do pracownika', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  

  

  const handleAddBenefit = async () => {
    if (!newBenefitName) {
      // Wyświetl toast, jeśli pole tekstowe jest puste
      toast.error('Nazwa beneficjum nie może być pusta', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/add_benefit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nazwa_benefitu: newBenefitName }),
      });
  
      if (!response.ok) {
        if (response.status === 409) {
          // Wyświetl toast, jeśli beneficjum o danej nazwie już istnieje
          toast.warning('Benefit o podanej nazwie już istnieje', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          throw new Error('Błąd podczas dodawania benefitu');
        }
      } else {
        // Aktualizuj listę beneficjów po dodaniu
        const result = await response.json();
        setBenefits([...benefits, result]);
  
        // Wyczyść pole tekstowe po dodaniu
        setNewBenefitName('');
  
        // Pokaż toast po pomyślnym dodaniu
        toast.success('Benefit został pomyślnie dodany', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="benefits-management-container">
    <h2 className="benefits-title">Zarządzanie benefitami</h2>
    <table className="benefits-table">
        <thead>
            <tr>
                <th>Nazwa Benefitu</th>
                <th>Akcja</th>
            </tr>
        </thead>
        <tbody>
            {benefits.map((benefit) => (
                <tr key={benefit.id} className="benefit-row">
                    <td>{benefit.nazwa_benefitu}</td>
                    <td>
                        <button onClick={() => handleDeleteBenefit(benefit.id)} className="delete-button">Usuń</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className="add-benefit">
        <h3 className='addingh3'>Dodaj nowy benefit:</h3>
        <input
            type="text"
            placeholder="Nazwa benefitu"
            value={newBenefitName}
            onChange={(e) => setNewBenefitName(e.target.value)}
            className="benefit-input"
        />
        <button onClick={handleAddBenefit} className="add-button">Dodaj</button>
    </div>
    <ToastContainer />
</div>

  );
};

export default BenefitsManagement;
