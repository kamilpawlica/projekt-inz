import React, { useState, useEffect } from 'react';

const EmployeeAbsences = () => {
  const [employeeAbsences, setEmployeeAbsences] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/nieobecnosci');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych nieobecności pracowników');
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

        setEmployeeAbsences(groupedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="absence-management-container">
      <h2 className="absence-title"><center>Podgląd nieobecności pracowników</center></h2>
      <table className="absence-table">
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
          {[...employeeAbsences.entries()].map(([key, absences], index) => (
            <React.Fragment key={index}>
              {absences.map((absence, absenceIndex) => (
                <tr key={absenceIndex} className="absence-row">
                  {absenceIndex === 0 && (
                    <>
                      <td rowSpan={absences.length}>{absence.imie}</td>
                      <td rowSpan={absences.length}>{absence.nazwisko}</td>
                      <td rowSpan={absences.length}>{absence.email}</td>
                    </>
                  )}
                  <td>{new Date(absence.data_poczatkowa).toLocaleDateString()}</td>
                  <td>{new Date(absence.data_koncowa).toLocaleDateString()}</td>
                  <td>{absence.powod}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAbsences;
