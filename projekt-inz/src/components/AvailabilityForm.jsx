import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailabilityForm = ({ usersData }) => {
  const initialFormData = {
    data: "",
    godzina_rozpoczecia: "",
    godzina_zakonczenia: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, godzina_rozpoczecia, godzina_zakonczenia } = formData;

    // Sprawdź, czy godzina zakończenia jest późniejsza niż godzina rozpoczęcia
    if (new Date(`2000-01-01 ${godzina_zakonczenia}`) <= new Date(`2000-01-01 ${godzina_rozpoczecia}`)) {
      toast.error("Godzina zakończenia nie może być wcześniejsza lub równa godzinie rozpoczęcia.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Sprawdź, czy wybrana data jest późniejsza niż dzisiaj
    const selectedDate = new Date(data);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ustaw na początek dzisiejszego dnia

    if (selectedDate <= today) {
      toast.error("Nie możesz ustawić dostępności na wcześniejsze dni niż dzisiaj.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Sprawdź, czy wybrana data jest maksymalnie 30 dni w przyszłość
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Dodaj 30 dni

    if (selectedDate > maxDate) {
      toast.error("Możesz ustawić dostępność maksymalnie na 30 kolejnych dni.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Tutaj możesz dodać dodatkową walidację danych wejściowych, jeśli jest to wymagane

    try {
      const response = await fetch("http://localhost:5000/insert-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleid: usersData.googleid,
          dzien_tygodnia: data, // Zmieniamy pole "data" na "dzien_tygodnia"
          godzina_rozpoczecia,
          godzina_zakonczenia,
        }),
      });

      if (response.ok) {
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success("Dane dostępności zostały dodane pomyślnie.", {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Wyczyść pola formularza i błąd
        setFormData(initialFormData);
        setError("");
        // Odśwież listę dostępności
        fetchAvailability();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
        console.error("Błąd podczas dodawania danych dostępności.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const handleDeleteAvailability = async (availabilityID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-availability/${availabilityID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success("Dostępność została usunięta pomyślnie.", {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Odśwież listę dostępności po usunięciu
        fetchAvailability();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
        console.error("Błąd podczas usuwania dostępności.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania HTTP:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/employee-availability/${usersData.googleid}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Błąd podczas pobierania dostępności pracownika:", error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [usersData.googleid]);


  return (
    <div className="availabilityForm">
    <ToastContainer />
    {usersData.typ_umowy !== 2 ? (
  <div>
    <h2>Wprowadź dostępność</h2>
    <p>Zgłoszenie dostępności przysługuje pracownikom pracującym na zlecenie.</p>
  </div>
) : (
  <div>
    <h2>Wprowadź dostępność</h2>
    <form onSubmit={handleSubmit} className="form">
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Data (dzień):</label>
        <input className="inputPlace"
          type="date"
          name="data"
          value={formData.data}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Godzina rozpoczęcia:</label>
        <input className="inputPlace"
          type="time"
          name="godzina_rozpoczecia"
          value={formData.godzina_rozpoczecia}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Godzina zakończenia:</label>
        <input className="inputPlace"
          type="time"
          name="godzina_zakonczenia"
          value={formData.godzina_zakonczenia}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <button type="submit">Dodaj dostępność</button>
      </div>
    </form>
    {availability.length > 0 && (
      <div className="availabilityList">
      <h3 className="h3settings">Twoja dostępność:</h3>
      <table className="availability-table">
        <thead>
          <tr>
            <th><center> Data </center></th>
            <th><center> Godzina rozpoczęcia</center></th>
            <th><center>Godzina zakończenia</center></th>
            <th><center>Akcje</center></th>
          </tr>
        </thead>
        <tbody>
          {availability.map((available) => (
            <tr key={available.id} className="employee-row">
              <td>{new Date(available.dzien_tygodnia).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", weekday: "long" })}</td>
              <td>{available.godzina_rozpoczecia}</td>
              <td>{available.godzina_zakonczenia}</td>
              <td>
                <button onClick={() => handleDeleteAvailability(available.id)}>
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
)}

    </div>
  );
};

export default AvailabilityForm;
