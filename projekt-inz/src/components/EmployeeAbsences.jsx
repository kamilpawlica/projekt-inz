import React, { useState, useEffect } from 'react';

const EmployeeAbsences = () => {
  const [employeeAbsences, setEmployeeAbsences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/nieobecnosci');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych nieobecności pracowników');
        }
        const data = await response.json();
        setEmployeeAbsences(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2><center>Podgląd nieobecności pracowników</center></h2>
      <table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Data Początkowa</th>
            <th>Data Końcowa</th>
            <th>Powód</th>
          </tr>
        </thead>
        <tbody>
          {employeeAbsences.map((employee, index) => (
            <tr key={index}>
              <td>{employee.imie}</td>
              <td>{employee.nazwisko}</td>
              <td>{employee.email}</td>
              <td>{new Date(employee.data_poczatkowa).toLocaleDateString()}</td>
              <td>{new Date(employee.data_koncowa).toLocaleDateString()}</td>
              <td>{employee.powod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAbsences;
