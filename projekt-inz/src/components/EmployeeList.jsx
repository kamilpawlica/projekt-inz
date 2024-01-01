import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobierz dane pracowników
        const response = await fetch('http://localhost:5000/pracownicy');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych pracowników');
        }
        const employeeData = await response.json();

        // Pobierz dane o beneficjach pracowników
        const benefitsResponse = await fetch('http://localhost:5000/benefity_pracownicy');
        if (!benefitsResponse.ok) {
          throw new Error('Błąd podczas pobierania danych beneficjów pracowników');
        }
        const benefitsData = await benefitsResponse.json();

        // Pobierz dane o kompetencjach pracowników
        const skillsResponse = await fetch('http://localhost:5000/kompetencje_pracownicy');
        if (!skillsResponse.ok) {
          throw new Error('Błąd podczas pobierania danych kompetencji pracowników');
        }
        const skillsData = await skillsResponse.json();

        // Połącz dane pracowników z danymi o beneficjach i kompetencjach
        const employeesWithBenefitsAndSkills = employeeData.map((employee) => {
          const matchingBenefits = benefitsData.filter((benefit) => benefit.googleid === employee.googleid);
          const matchingSkills = skillsData.filter((skill) => skill.googleid === employee.googleid);
          return {
            ...employee,
            benefity: matchingBenefits.map((benefit) => benefit.nazwa_benefitu),
            kompetencje: matchingSkills.map((skill) => skill.nazwa_kompetencji),
          };
        });

        setEmployees(employeesWithBenefitsAndSkills);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <center><h2>Lista Pracowników</h2></center>
      <table>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Stanowisko</th>
            <th>Typ Umowy</th>
            <th>Wynagrodzenie</th>
            <th>Benefity</th>
            <th>Kompetencje</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.googleid}>
              <td>{employee.imie}</td>
              <td>{employee.nazwisko}</td>
              <td>{employee.email}</td>
              <td>{employee.nazwa_stanowiska || 'Brak'}</td>
              <td>{employee.nazwa_typu_umowy || 'Brak'}</td>
              <td>{employee.wynagrodzenie}</td>
              <td>{employee.benefity ? employee.benefity.join(', ') : 'Brak'}</td>
              <td>{employee.kompetencje ? employee.kompetencje.join(', ') : 'Brak'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
