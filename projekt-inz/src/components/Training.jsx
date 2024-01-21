import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Training = ({ usersData }) => {
  const [availableTrainings, setAvailableTrainings] = useState([]);
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [error, setError] = useState(null);

  const fetchAvailableTrainings = async () => {
    try {
      const response = await fetch('http://localhost:5000/szkolenia');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAvailableTrainings(data);
    } catch (error) {
      console.error('Błąd podczas pobierania dostępnych szkoleń:', error);
      setError('Wystąpił błąd podczas pobierania dostępnych szkoleń.');
    }
  };

  const fetchAssignedTrainings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/assigned-trainings/${usersData.googleid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignedTrainings(data);
    } catch (error) {
      console.error('Błąd podczas pobierania przypisanych szkoleń pracownika:', error);
      setError('Wystąpił błąd podczas pobierania przypisanych szkoleń pracownika.');
    }
  };

  useEffect(() => {
    fetchAvailableTrainings();
    fetchAssignedTrainings();
  }, [usersData.googleid]);

  const isAssignedToTraining = (id_szkolenia) => {
    return assignedTrainings.some((training) => training.id === id_szkolenia);
  };

  const handleAssignTraining = async (id_szkolenia) => {
    if (isAssignedToTraining(id_szkolenia)) {
      toast.warning('Jesteś już przypisany do tego szkolenia.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/assign-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleid: usersData.googleid,
          id_szkolenia,
        }),
      });

      if (response.ok) {
        toast.success('Pomyślnie zapisałeś się na szkolenie.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Odśwież listę dostępnych i przypisanych szkoleń po przypisaniu
        fetchAvailableTrainings();
        fetchAssignedTrainings();
      } else {
        console.error('Błąd podczas przypisywania szkolenia do pracownika.');
        toast.error('Wystąpił błąd podczas przypisywania szkolenia do pracownika.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania HTTP:', error);
    }
  };

  const handleCancelTraining = async (id_szkolenia) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-employee-training/${usersData.googleid}/${id_szkolenia}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Pomyślnie zrezygnowałeś ze szkolenia.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Odśwież listę dostępnych i przypisanych szkoleń po zrezygnowaniu
        fetchAvailableTrainings();
        fetchAssignedTrainings();
      } else {
        console.error('Błąd podczas rezygnacji ze szkolenia.');
        toast.error('Wystąpił błąd podczas rezygnacji ze szkolenia.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania żądania HTTP:', error);
    }
  };

  return (
    <div className="trainingList">
      <ToastContainer />
      <h2>Lista dostępnych szkoleń</h2>
{error && <p className="error">{error}</p>}
<table className="availability-table">
  <thead>
    <tr>
      <th><center>Nazwa szkolenia</center></th>
      <th><center>Data szkolenia</center></th>
      <th><center>Akcje</center></th>
    </tr>
  </thead>
  <tbody>
    {availableTrainings.map((training) => (
      <tr key={training.id} className="employee-row">
        <td>{training.nazwa_szkolenia}</td>
        <td>{new Date(training.data_szkolenia).toLocaleDateString()}</td>
        <td>
          <button className="trainingBtn2"  onClick={() => handleAssignTraining(training.id)}>Zapisz</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      <h3>Twoje przypisane szkolenia</h3>
      <table className="availability-table">
        <thead>
          <tr>
            <th><center>Nazwa szkolenia</center></th>
            <th><center>Data szkolenia</center></th>
            <th><center>Akcje</center></th>
          </tr>
        </thead>
        <tbody>
          {assignedTrainings.map((training) => (
            <tr key={training.id} className="employee-row">
              <td>{training.nazwa_szkolenia}</td>
              <td>{new Date(training.data_szkolenia).toLocaleDateString()}</td>
              <td>
                <button className="trainingBtn" onClick={() => handleCancelTraining(training.id)}>Zrezygnuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Training;
