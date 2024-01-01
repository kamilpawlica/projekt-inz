import React, { useState, useEffect } from 'react';

const EmployeeVacations = () => {
  const [employeeVacations, setEmployeeVacations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/urlopy');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych urlopów pracowników');
        }
        const data = await response.json();
        setEmployeeVacations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2><center>Podgląd dni urlopowych pracowników</center></h2>
      <table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Data Rozpoczęcia Urlopu</th>
            <th>Data Zakończenia Urlopu</th>
          </tr>
        </thead>
        <tbody>
          {employeeVacations.map((employee, index) => (
            <tr key={index}>
              <td>{employee.imie}</td>
              <td>{employee.nazwisko}</td>
              <td>{employee.email}</td>
              <td>{new Date(employee.data_rozpoczecia).toLocaleDateString()}</td>
              <td>{new Date(employee.data_zakonczenia).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeVacations;
