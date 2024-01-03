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
  const [usedDays, setUsedDays] = useState(0); // Licznik wykorzystanych dni urlopu

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data_rozpoczecia: data_rozpoczecia, data_zakonczenia: data_zakonczenia } = formData;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ustaw godzinę na północ, aby porównywać tylko daty

    // Sprawdź, czy data początkowa i data końcowa są wcześniejsze niż dzisiaj
    if (new Date(data_rozpoczecia) < today || new Date(data_zakonczenia) < today) {
      
      // Wyświetl komunikat o błędzie za pomocą react-toastify
      toast.error(
        "Nie można ustawić dni urlopowych w dniu wcześniejszym niż dzisiaj.",
        {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      return;
    }

    // Sprawdź, czy data początkowa jest wcześniejsza niż data końcowa
    if (new Date(data_rozpoczecia) > new Date(data_zakonczenia)) {
      
      // Wyświetl komunikat o błędzie za pomocą react-toastify
      toast.error(
        "Data początkowa nie może być wcześniejsza niż data końcowa.",
        {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      return;
    }

    // Oblicz liczbę dni urlopu między datą początkową a datą końcową
    const oneDay = 24 * 60 * 60 * 1000; // Liczba milisekund w jednym dniu
    const startDate = new Date(data_rozpoczecia);
    const endDate = new Date(data_zakonczenia);
    const daysDiff = Math.round(
      Math.abs((startDate - endDate) / oneDay)
    );

    // Sprawdź, czy użytkownik nie przekracza limitu 20 dni urlopu
    if (usedDays + daysDiff > 20) {
      
      // Wyświetl komunikat o błędzie za pomocą react-toastify
      toast.error("Przekroczyłeś limit 20 dni urlopu.", {
        position: "top-right",
        autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
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
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success("Dni urlopowe zostały dodane pomyślnie.", {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Zaktualizuj licznik wykorzystanych dni urlopu
        setUsedDays(usedDays + daysDiff);

        // Wyczyść pola formularza i błąd
        setFormData(initialFormData);
        setError("");
        // Odśwież listę nieobecności
        fetchAbsences();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
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
        // Wyświetl komunikat o sukcesie za pomocą react-toastify
        toast.success("Dni urlopowe zostały usunięte pomyślnie.", {
          position: "top-right",
          autoClose: 3000, // Czas wyświetlania komunikatu (3 sekundy)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Zaktualizuj licznik wykorzystanych dni urlopu po usunięciu
        setUsedDays(usedDays - daysDiff);

        // Odśwież listę nieobecności
        fetchAbsences();
      } else {
        // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
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
    } catch (error) {
      console.error("Błąd podczas pobierania urlopu pracownika:", error);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [usersData.googleid]);

  return (
    <div className='pozycja'>
      <ToastContainer />
      <h2>Zaplanuj urlop</h2>
      <p>
        Dostępne dni urlopu: {20 - usedDays} / 20
      </p>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Data początkowa:</label>
          <input
            type="date"
            name="data_rozpoczecia"
            value={formData.data_rozpoczecia}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data końcowa:</label>
          <input
            type="date"
            name="data_zakonczenia"
            value={formData.data_zakonczenia}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Dodaj dni urlopowe</button>
        </div>
      </form>
      {absences.length > 0 && (
        <div>
          <h3>Twoje nieobecności:</h3>
          <ul>
            {absences.map((absence) => (
              <li key={absence.id}>
                Data początkowa:{" "}
                {new Date(absence.data_rozpoczecia).toLocaleDateString()}, Data
                końcowa: {new Date(absence.data_zakonczenia).toLocaleDateString()}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeaveForm;