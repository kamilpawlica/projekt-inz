import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';

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

        setEditEmployee({
            ...employee,
            stanowisko: positionId,
            typ_umowy: contractTypeId,
            kompetencje: employee.kompetencje,
            benefity: employee.benefity,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditEmployee(prevState => ({
            ...prevState,
            [name]: name === 'stanowisko' ? parseInt(value) : value
        }));
    };

    const handleChangeCompetencies = (selected) => {
        setSelectedCompetencies(selected);
        setEditEmployee(prevState => ({
            ...prevState,
            kompetencje: selected.map(s => s.value)
        }));
    };

    const handleChangeBenefits = (selected) => {
        setSelectedBenefits(selected);
        setEditEmployee(prevState => ({
            ...prevState,
            benefity: selected.map(s => s.value)
        }));
    };

    const handleSubmit = async () => {
        const { googleid, stanowisko, typ_umowy, kompetencje, benefity, wynagrodzenie } = editEmployee;
        try {
            const response = await fetch(`http://localhost:5000/aktualizuj_pracownika/${googleid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stanowisko,
                    typ_umowy,
                    kompetencje,
                    benefity,
                    wynagrodzenie
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setEditEmployee(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Lista Pracowników</h1>
            <ul>
                {employees.map(employee => (
                    <li key={employee.googleid}>
                        <strong>Imię:</strong> {employee.imie}<br />
                        <strong>Nazwisko:</strong> {employee.nazwisko}<br />
                        <strong>Email:</strong> {employee.email}<br />
                        <button onClick={() => handleEditClick(employee)}>Edytuj</button>
                    </li>
                ))}
            </ul>

            {editEmployee && (
                <div>
                    <h2>Edytuj Pracownika</h2>
                    <select name="stanowisko" value={editEmployee.stanowisko} onChange={handleChange}>
                        {positions.map(position => (
                            <option key={position.id} value={position.id}>
                                {position.nazwa_stanowiska}
                            </option>
                        ))}
                    </select>
                    <select name="typ_umowy" value={editEmployee.typ_umowy} onChange={handleChange}>
                        {contractTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.nazwa_typu_umowy}
                            </option>
                        ))}
                    </select>
                    <MultiSelect
                        options={allCompetencies}
                        value={selectedCompetencies}
                        onChange={handleChangeCompetencies}
                        labelledBy={'Wybierz kompetencje'}
                    />
                    <MultiSelect
                        options={allBenefits}
                        value={selectedBenefits}
                        onChange={handleChangeBenefits}
                        labelledBy={'Wybierz benefity'}
                    />
                    <input name="wynagrodzenie" value={editEmployee.wynagrodzenie} onChange={handleChange} />
                    <button onClick={handleSubmit}>Zapisz zmiany</button>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
