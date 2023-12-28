import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AbsenceForm = ({ usersData }) => {
  const initialFormData = {
    data_poczatkowa: '',
    data_koncowa: '',
    powod: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [absences, setAbsences] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data_poczatkowa, data_koncowa, powod } = formData;

    // Sprawdź, czy data początkowa jest wcześniejsza niż data końcowa
    if (new Date(data_poczatkowa) > new Date(data_koncowa)) {
      setError('Data początkowa nie może być wcześniejsza niż data końcowa.');
      // Wyświetl komunikat o błędzie za pomocą react-toastify
      toast.error('Data początkowa nie może być wcześniejsza niż data końcowa.', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/insert-absence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleid: usersData.googleid, data_poczatkowa, data_koncowa, powod }),
      });

      if (response.ok) {
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success('Dane nieobecności zostały dodane pomyślnie.', {
          position: 'top-right',
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Wyczyść pola formularza i błąd
        setFormData(initialFormData);
        setError('');
        // Odśwież listę nieobecności
        fetchAbsences();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
        console.error('Błąd podczas dodawania danych nieobecności.');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania HTTP:', error);
    }
  };

  const handleDeleteAbsence = async (absenceID) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-absence/${absenceID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success('Nieobecność została usunięta pomyślnie.', {
          position: 'top-right',
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        console.log(absenceID);

        // Odśwież listę nieobecności po usunięciu
        fetchAbsences();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
        console.error('Błąd podczas usuwania nieobecności.');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania HTTP:', error);
    }
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(`http://localhost:5000/employee-absences/${usersData.googleid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAbsences(data);
    } catch (error) {
      console.error('Błąd podczas pobierania nieobecności pracownika:', error);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [usersData.googleid]);



  return (
    <div>
      <ToastContainer />
      <h2>Dodaj nieobecność</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Data początkowa:</label>
          <input
            type="date"
            name="data_poczatkowa"
            value={formData.data_poczatkowa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data końcowa:</label>
          <input
            type="date"
            name="data_koncowa"
            value={formData.data_koncowa}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Powód:</label>
          <input
            type="text"
            name="powod"
            value={formData.powod}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Dodaj nieobecność</button>
        </div>
      </form>
      {absences.length > 0 && (
        <div>
          <h3>Twoje nieobecności:</h3>
          <ul>
            {absences.map((absence) => (
              <li key={absence.id}>
                Data początkowa: {new Date(absence.data_poczatkowa).toLocaleDateString()}, 
                Data końcowa: {new Date(absence.data_koncowa).toLocaleDateString()}, 
                Powód: {absence.powod}
                <button onClick={() => handleDeleteAbsence(absence.id)}>Usuń</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AbsenceForm;
