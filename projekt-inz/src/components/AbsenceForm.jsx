import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AbsenceForm = ({ usersData }) => {
  const initialFormData = {
    data_poczatkowa: "",
    data_koncowa: "",
    powod: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [absences, setAbsences] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data_poczatkowa, data_koncowa, powod } = formData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(data_poczatkowa) < today || new Date(data_koncowa) < today) {
      toast.error(
        "Nie można ustawić nieobecności w dniu wcześniejszym niż dzisiaj.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      return;
    }

    if (new Date(data_poczatkowa) > new Date(data_koncowa)) {
      toast.error(
        "Data początkowa nie może być wcześniejsza niż data końcowa.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/insert-absence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleid: usersData.googleid,
          data_poczatkowa,
          data_koncowa,
          powod,
        }),
      });

      if (response.ok) {
        toast.success("Dane nieobecności zostały dodane pomyślnie.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setFormData(initialFormData);
        setError("");
        fetchAbsences();
      } else {
        console.error("Błąd podczas dodawania danych nieobecności.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const handleDeleteAbsence = async (absenceID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-absence/${absenceID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Nieobecność została usunięta pomyślnie.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        fetchAbsences();
      } else {
        console.error("Błąd podczas usuwania nieobecności.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/employee-absences/${usersData.googleid}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAbsences(data);
    } catch (error) {
      console.error("Błąd podczas pobierania nieobecności pracownika:", error);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [usersData.googleid]);

  return (
    <div className="absenceForm">
      <ToastContainer />
      <h2>Dodaj nieobecność</h2>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Data początkowa:</label>
          <input
            className="inputPlace"
            type="date"
            name="data_poczatkowa"
            value={formData.data_poczatkowa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Data końcowa:</label>
          <input
            className="inputPlace"
            type="date"
            name="data_koncowa"
            value={formData.data_koncowa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Powód:</label>
          <input
            className="inputPlace"
            type="text"
            name="powod"
            value={formData.powod}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Dodaj nieobecność</button>
        </div>
      </form>
      {absences.length > 0 && (
        <div className="absences">
          <h3 className="h3settings">Twoje nieobecności:</h3>
          <table className="availability-table">
            <thead>
              <tr>
                <th><center>Data początkowa</center></th>
                <th><center>Data końcowa</center></th>
                <th><center>Powód</center></th>
                <th><center>Akcje</center></th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id} className="employee-row">
                  <td>
                    {new Date(absence.data_poczatkowa).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(absence.data_koncowa).toLocaleDateString()}
                  </td>
                  <td>{absence.powod}</td>
                  <td>
                    <button onClick={() => handleDeleteAbsence(absence.id)}>
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AbsenceForm;
