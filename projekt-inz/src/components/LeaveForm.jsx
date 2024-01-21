import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveForm = ({ usersData }) => {
  const initialFormData = {
    data_rozpoczecia: "",
    data_zakonczenia: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [absences, setAbsences] = useState([]);
  const [usedDays, setUsedDays] = useState(0);
  const maxLeaveDays = usersData.staz_pracy >= 10 ? 26 : 20;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data_rozpoczecia, data_zakonczenia } = formData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(data_rozpoczecia) < today || new Date(data_zakonczenia) < today) {
      toast.error("Nie można ustawić dni urlopowych w dniu wcześniejszym niż dzisiaj.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    if (new Date(data_rozpoczecia) > new Date(data_zakonczenia)) {
      toast.error("Data początkowa nie może być wcześniejsza niż data końcowa.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(data_rozpoczecia);
    const endDate = new Date(data_zakonczenia);
    const daysDiff = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    if (usedDays + daysDiff > maxLeaveDays) {
      toast.error(`Przekroczyłeś limit ${maxLeaveDays} dni urlopu.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/insert-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleid: usersData.googleid,
          data_rozpoczecia,
          data_zakonczenia,
        }),
      });

      if (response.ok) {
        toast.success("Dni urlopowe zostały dodane pomyślnie.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setUsedDays(usedDays + daysDiff);
        setFormData(initialFormData);
        setError("");
        fetchAbsences();
      } else {
        console.error("Błąd podczas dodawania dni urlopowych.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const handleDeleteAbsence = async (absenceID, daysDiff) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-leave/${absenceID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Dni urlopowe zostały usunięte pomyślnie.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setUsedDays(usedDays - daysDiff);
        fetchAbsences();
      } else {
        console.error("Błąd podczas usuwania dni urlopowych.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/employee-leaves/${usersData.googleid}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAbsences(data);

      let totalUsedDays = 0;
      data.forEach((absence) => {
        const startDate = new Date(absence.data_rozpoczecia);
        const endDate = new Date(absence.data_zakonczenia);
        const daysDiff =
          Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
        totalUsedDays += daysDiff;
      });

      setUsedDays(totalUsedDays);
    } catch (error) {
      console.error("Błąd podczas pobierania urlopu pracownika:", error);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [usersData.googleid]);

  if (usersData.typ_umowy !== 1) {
    return (
      <div className="absenceForm">
        <h2>Zaplanuj urlop</h2>
        Urlop przysługuje pracownikom posiadającym umowę o pracę.
      </div>
    );
  }

  return (
    <div className="absenceForm">
      <ToastContainer />
      <h2>Zaplanuj urlop</h2>
      <p>
        Dostępne dni urlopu: {maxLeaveDays - usedDays} / {maxLeaveDays}
      </p>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Data początkowa:</label>
          <input
            className="inputPlace"
            type="date"
            name="data_rozpoczecia"
            value={formData.data_rozpoczecia}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Data końcowa:</label>
          <input
            className="inputPlace"
            type="date"
            name="data_zakonczenia"
            value={formData.data_zakonczenia}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Dodaj dni urlopowe</button>
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
                <th><center>Akcje</center></th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id} className="employee-row">
                  <td>
                    {new Date(absence.data_rozpoczecia).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(absence.data_zakonczenia).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeleteAbsence(
                          absence.id,
                          Math.round(
                            Math.abs(
                              (new Date(absence.data_rozpoczecia) -
                                new Date(absence.data_zakonczenia)) /
                                (24 * 60 * 60 * 1000)
                            )
                          )
                        )
                      }
                    >
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

export default LeaveForm;
