import React, { useState, useEffect } from 'react';

const EmployeeAvailability = () => {
  const [employeeAvailability, setEmployeeAvailability] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

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

  return (
    <div>
      <h2><center>Dane Dostępności Pracowników</center></h2>
      <table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Dzień Tygodnia</th>
            <th>Godzina Rozpoczęcia</th>
            <th>Godzina Zakończenia</th>
          </tr>
        </thead>
        <tbody>
          {employeeAvailability.map((employee, index) => (
            <tr key={index}>
              <td>{employee.imie}</td>
              <td>{employee.nazwisko}</td>
              <td>{employee.email}</td>
              <td>{employee.dzien_tygodnia}</td>
              <td>{employee.godzina_rozpoczecia}</td>
              <td>{employee.godzina_zakonczenia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAvailability;
