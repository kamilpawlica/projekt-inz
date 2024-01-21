import React, { useState, useEffect } from 'react';

const EmployeeAvailability = () => {
  const [employeeAvailability, setEmployeeAvailability] = useState([]);
  const [employeesData, setEmployeesData] = useState({}); // Obiekt do przechowywania danych pracowników

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dostepnosc');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych dostępności pracowników');
        }
        const data = await response.json();
        setEmployeeAvailability(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Tworzenie obiektu zawierającego dane pracowników
    const employeesDataObj = {};

    // Iteracja przez dostępności pracowników i agregacja danych
    employeeAvailability.forEach((employee) => {
      const { imie, nazwisko, email } = employee;
      const key = `${imie}_${nazwisko}_${email}`;
      if (!employeesDataObj[key]) {
        employeesDataObj[key] = { imie, nazwisko, email, dostepnosci: [] };
      }
      employeesDataObj[key].dostepnosci.push(employee);
    });

    // Aktualizacja stanu z danymi pracowników
    setEmployeesData(employeesDataObj);
  }, [employeeAvailability]);

  return (
    <div className="employee-availability-container">
    <h2 className="availability-title">Dane Dostępności Pracowników</h2>
    <table className="availability-table">
        <thead>
            <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th><center>Email</center></th>
                <th>Dostępności</th>
            </tr>
        </thead>
        <tbody>
            {Object.values(employeesData).map((employee, index) => (
                <tr key={index} className="employee-row">
                    <td>{employee.imie}</td>
                    <td>{employee.nazwisko}</td>
                    <td>{employee.email}</td>
                    <td>
                        <ul>
                            {employee.dostepnosci.map((availability, index) => (
                                <li key={index} className="availability-item">
                                    Dzień Tygodnia: {new Date(availability.dzien_tygodnia).toLocaleDateString()}, Godzina Rozpoczęcia: {availability.godzina_rozpoczecia}, Godzina Zakończenia: {availability.godzina_zakonczenia}
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

  );
};

export default EmployeeAvailability;
