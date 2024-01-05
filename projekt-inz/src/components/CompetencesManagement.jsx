import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompetencesManagement = () => {
  const [competences, setCompetences] = useState([]);
  const [newCompetenceName, setNewCompetenceName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/kompetencje');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych kompetencji');
        }
        const data = await response.json();
        setCompetences(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteCompetence = async (competenceId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_kompetencja/${competenceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania kompetencji');
      }

      // Aktualizuj listę kompetencji po usunięciu
      const updatedCompetences = competences.filter((competence) => competence.id !== competenceId);
      setCompetences(updatedCompetences);

      // Pokaż toast po pomyślnym usunięciu
      toast.success('Kompetencja została pomyślnie usunięta', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCompetence = async () => {
    if (!newCompetenceName) {
      // Wyświetl toast, jeśli pole tekstowe jest puste
      toast.error('Nazwa kompetencji nie może być pusta', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add_kompetencja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nazwa_kompetencji: newCompetenceName }),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania kompetencji');
      }

      // Aktualizuj listę kompetencji po dodaniu
      const newCompetence = await response.json();
      setCompetences([...competences, newCompetence]);

      // Wyczyść pole tekstowe po dodaniu
      setNewCompetenceName('');

      // Pokaż toast po pomyślnym dodaniu
      toast.success('Kompetencja została pomyślnie dodana', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="competence-management-container">
    <h2 className="competence-title">Zarządzanie kompetencjami</h2>
    <table className="competence-table">
        <thead>
            <tr>
                <th>Nazwa Kompetencji</th>
                <th>Akcja</th>
            </tr>
        </thead>
        <tbody>
            {competences.map((competence) => (
                <tr key={competence.id} className="competence-row">
                    <td>{competence.nazwa_kompetencji}</td>
                    <td>
                        <button onClick={() => handleDeleteCompetence(competence.id)} className="delete-button">Usuń</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className="add-competence">
    <h3 className='addingh3'>Dodaj nową kompetencję:</h3>
        <input
            type="text"
            placeholder="Nazwa kompetencji"
            value={newCompetenceName}
            onChange={(e) => setNewCompetenceName(e.target.value)}
            className="competence-input"
        />
        <button onClick={handleAddCompetence} className="add-button">Dodaj</button>
    </div>
    <ToastContainer />
</div>

  );
};

export default CompetencesManagement;
