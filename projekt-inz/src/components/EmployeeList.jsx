import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [allCompetencies, setAllCompetencies] = useState([]);
  const [allBenefits, setAllBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const MAX_SALARY = 99999999;

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
    fetchContractTypes();
    fetchCompetencies();
    fetchBenefits();
  }, []);

  const fetchEmployees = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/pracownicy_lista')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const fetchPositions = () => {
    fetch('http://localhost:5000/stanowiska')
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => console.error('Error fetching positions:', error));
  };

  const fetchContractTypes = () => {
    fetch('http://localhost:5000/typy_umow')
      .then(response => response.json())
      .then(data => setContractTypes(data))
      .catch(error => console.error('Error fetching contract types:', error));
  };

  const fetchCompetencies = () => {
    fetch('http://localhost:5000/kompetencje')
      .then(response => response.json())
      .then(data => setAllCompetencies(data.map(comp => ({ label: comp.nazwa_kompetencji, value: comp.id }))))
      .catch(error => console.error('Error fetching competencies:', error));
  };

  const fetchBenefits = () => {
    fetch('http://localhost:5000/benefity')
      .then(response => response.json())
      .then(data => setAllBenefits(data.map(benefit => ({ label: benefit.nazwa_benefitu, value: benefit.id }))))
      .catch(error => console.error('Error fetching benefits:', error));
  };

  const handleEditClick = (employee) => {
    const positionId = positions.find(p => p.nazwa_stanowiska === employee.stanowisko)?.id;
    const employeeCompetencies = allCompetencies.filter(c => employee.kompetencje.includes(c.value));
    const employeeBenefits = allBenefits.filter(b => employee.benefity.includes(b.value));
    const contractTypeId = contractTypes.find(c => c.nazwa_typu_umowy === employee.typ_umowy)?.id;

    setSelectedCompetencies(employeeCompetencies);
    setSelectedBenefits(employeeBenefits);

    if (editEmployee && editEmployee.googleid === employee.googleid) {
      // Jeśli obecnie jesteśmy w trybie edycji tego samego pracownika, to wyłącz tryb edycji.
      setIsEditMode(false);
      setEditEmployee(null);
    } else {
      // W przeciwnym razie, przełącz się w tryb edycji dla tego pracownika.
      setIsEditMode(true);
      setEditEmployee({
        ...employee,
        stanowisko: positionId,
        typ_umowy: contractTypeId,
        kompetencje: employee.kompetencje,
        benefity: employee.benefity,
        staz_pracy: employee.staz_pracy, // Dodane pole staz_pracy
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditEmployee(prevState => ({
      ...prevState,
      [name]: name === 'stanowisko' ? parseInt(value) : value,
    }));
  };

  const handleChangeCompetencies = (selected) => {
    setSelectedCompetencies(selected);
    setEditEmployee(prevState => ({
      ...prevState,
      kompetencje: selected.map(s => s.value),
    }));
  };

  const handleChangeBenefits = (selected) => {
    setSelectedBenefits(selected);
    setEditEmployee(prevState => ({
      ...prevState,
      benefity: selected.map(s => s.value),
    }));
  };

  const validateForm = () => {
    const { stanowisko, typ_umowy, kompetencje, benefity, wynagrodzenie, staz_pracy } = editEmployee;
    if (!stanowisko || !typ_umowy || !kompetencje || !benefity || !wynagrodzenie || !staz_pracy) {
      toast.error('Proszę wypełnić wszystkie pola formularza');
      return false;
    }
    if (parseFloat(wynagrodzenie) >= MAX_SALARY) {
      toast.error(`Maksymalna wartość wynagrodzenia to ${MAX_SALARY}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Sprawdź czy formularz jest poprawnie wypełniony
    if (!validateForm()) {
      return;
    }

    const { googleid, stanowisko, typ_umowy, kompetencje, benefity, wynagrodzenie, staz_pracy } = editEmployee;
    try {
      const response = await fetch(`http://localhost:5000/aktualizuj_pracownika/${googleid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stanowisko,
          typ_umowy,
          kompetencje,
          benefity,
          wynagrodzenie,
          staz_pracy
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Informuj o pomyślnym zapisie zmian
      toast.success('Pomyślnie zapisano zmiany');
      setIsEditMode(false);
      setEditEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Proszę wypełnić wszystkie pola formularza');
    }
  };



    const handleDeleteCompetencies = async (googleid) => {
        try {
            const response = await fetch(`http://localhost:5000/usun-kompetencje/${googleid}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            toast.success("Pomyślnie usunięto kompetencje pracownika");
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting competencies:', error);
            toast.error("Błąd podczas usuwania kompetencji");
        }
    };

    const handleDeleteBenefits = async (googleid) => {
        try {
            const response = await fetch(`http://localhost:5000/usun-benefity/${googleid}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            toast.success("Pomyślnie usunięto benefity pracownika");
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting benefits:', error);
            toast.error("Błąd podczas usuwania benefitów");
        }
    };

    const handleDeleteEmployee = async (googleid) => {
      try {
        const response = await fetch(`http://localhost:5000/delete-employee/${googleid}`, {
          method: 'DELETE',
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        toast.success("Pracownik został usunięty pomyślnie");
        fetchEmployees(); // Odświeżanie listy pracowników po usunięciu
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error("Błąd podczas usuwania pracownika");
      }
    };
    


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

console.log(employees)

    return (
    <div className="employee-availability-container">
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <h2 className='h2emplo'>Lista Pracowników</h2>
    <table className="availability-table">
        <thead>
            <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th><center>Email</center></th>
                <th>Stanowisko</th>
                <th>Kompetencje</th>
                <th>Benefity</th>
                <th>Wynagrodzenie</th>
                <th><center>Staż pracy</center></th>
                <th><center>Akcje</center></th>
            </tr>
        </thead>
        <tbody>
            {employees.map(employee => (
                <tr key={employee.googleid} className="employee-row">
                    <td>{employee.imie}</td>
                    <td>{employee.nazwisko}</td>
                    <td>{employee.email}</td>
                    <td><center>{employee.stanowisko}</center></td>
                    <td><center>{employee.kompetencje.join(", ")}</center></td>
                    <td><center>{employee.benefity.join(", ")}</center></td>
                    <td><center>{employee.wynagrodzenie}</center></td>
                    <td><center>{employee.staz_pracy} lat</center></td>
                    <td className="action-buttons">
                        <button className="edit-button dwa" onClick={() => handleEditClick(employee)}>
                            {isEditMode && editEmployee && editEmployee.googleid === employee.googleid ? 'Anuluj' : 'Edytuj'}
                        </button>
                        <button className="delete-button dwa" onClick={() => handleDeleteCompetencies(employee.googleid)}>
                            Usuń kompetencje
                        </button>
                        <button className="delete-button dwa" onClick={() => handleDeleteBenefits(employee.googleid)}>
                            Usuń benefity
                        </button>
                        {employee.stanowisko !== "administrator" && (
          <button className="delete-button dwa" onClick={() => handleDeleteEmployee(employee.googleid)}>Usuń pracownika</button>
        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

            {editEmployee && isEditMode && (
                <div className="edit-employee">
                    <h2 className='h2emplo'>Edytuj Pracownika 
                    </h2>
                    <h3 className='h3emplo'> {editEmployee.imie} {editEmployee.nazwisko}
                    </h3>
                    <label htmlFor="stanowisko" className="edit-label">Stanowisko:</label>
                    <select  name="stanowisko" id="stanowisko" value={editEmployee.stanowisko} onChange={handleChange} className="edit-select">
                        {positions.map(position => (
                            <option key={position.id} value={position.id}>
                                {position.nazwa_stanowiska}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="typ_umowy" className="edit-label">Typ Umowy:</label>
                    <select name="typ_umowy" id="typ_umowy" value={editEmployee.typ_umowy} onChange={handleChange} className="edit-select">
                        {contractTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.nazwa_typu_umowy}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="kompetencje" className="edit-label">Wybierz kompetencje:</label>
                    <MultiSelect
                        options={allCompetencies}
                        value={selectedCompetencies}
                        onChange={handleChangeCompetencies}
                        labelledBy={'kompetencje'}
                        className="rmsc"
                    />
                    <label htmlFor="benefity" className="edit-label">Wybierz benefity:</label>
                    <MultiSelect
                        options={allBenefits}
                        value={selectedBenefits}
                        onChange={handleChangeBenefits}
                        labelledBy={'benefity'}
                        className="rmsc"
                    />
                    <label htmlFor="wynagrodzenie" className="edit-label">Wynagrodzenie:</label>
                    <input name="wynagrodzenie" id="wynagrodzenie" value={editEmployee.wynagrodzenie} onChange={handleChange} className="edit-select" />

                    <label htmlFor="staz_pracy" className="edit-label">Staż pracy:</label>
                    <input name="staz_pracy" id="staz_pracy" value={editEmployee.staz_pracy} onChange={handleChange} className="edit-select" />

                    <button onClick={handleSubmit} className="edit-button save">Zapisz zmiany</button>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
