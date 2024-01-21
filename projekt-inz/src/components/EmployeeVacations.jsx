import React, { useState, useEffect } from 'react';

const EmployeeVacations = () => {
  const [employeeVacations, setEmployeeVacations] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/urlopy');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych urlopów pracowników');
        }
        const data = await response.json();
        const groupedData = data.reduce((acc, employee) => {
          const key = `${employee.imie} ${employee.nazwisko} ${employee.email}`;
          if (!acc.has(key)) {
            acc.set(key, []);
          }
          acc.get(key).push(employee);
          return acc;
        }, new Map());

        setEmployeeVacations(groupedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="vacation-management-container">
      <h2 className="vacation-title"><center>Podgląd dni urlopowych pracowników</center></h2>
      <table className="vacation-table">
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th><center>Email</center></th>
            <th>Data Rozpoczęcia Urlopu</th>
            <th>Data Zakończenia Urlopu</th>
          </tr>
        </thead>
        <tbody>
          {[...employeeVacations.entries()].map(([key, vacations], index) => (
            <React.Fragment key={index}>
              {vacations.map((vacation, vacationIndex) => (
                <tr key={vacationIndex} className="vacation-row">
                  {vacationIndex === 0 && (
                    <>
                      <td rowSpan={vacations.length}>{vacation.imie}</td>
                      <td rowSpan={vacations.length}>{vacation.nazwisko}</td>
                      <td rowSpan={vacations.length}>{vacation.email}</td>
                    </>
                  )}
                  <td>{new Date(vacation.data_rozpoczecia).toLocaleDateString()}</td>
                  <td>{new Date(vacation.data_zakonczenia).toLocaleDateString()}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeVacations;
