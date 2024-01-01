import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    nazwa_szkolenia: '',
    opis_szkolenia: '',
    data_szkolenia: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/szkolenia');
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych szkoleń');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_szkolenie/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania szkolenia');
      }

      // Aktualizuj listę szkoleń po usunięciu
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);

      // Pokaż toast po pomyślnym usunięciu
      toast.success('Szkolenie zostało pomyślnie usunięte', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.nazwa_szkolenia || !newCourse.opis_szkolenia || !newCourse.data_szkolenia) {
      // Wyświetl toast, jeśli któreś z pól jest puste
      toast.error('Wszystkie pola są wymagane', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add_szkolenie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania szkolenia');
      }

      // Aktualizuj listę szkoleń po dodaniu
      const addedCourse = await response.json();
      setCourses([...courses, addedCourse]);

      // Wyczyść pola formularza po dodaniu
      setNewCourse({
        nazwa_szkolenia: '',
        opis_szkolenia: '',
        data_szkolenia: '',
      });

      // Pokaż toast po pomyślnym dodaniu
      toast.success('Szkolenie zostało pomyślnie dodane', {
        position: 'top-right',
        autoClose: 3000, // Czas wyświetlania toastu w milisekundach
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Zarządzanie Szkoleniami</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa Szkolenia</th>
            <th>Opis Szkolenia</th>
            <th>Data Szkolenia</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.nazwa_szkolenia}</td>
              <td>{course.opis_szkolenia}</td>
              <td>{course.data_szkolenia}</td>
              <td>
                <button onClick={() => handleDeleteCourse(course.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Dodaj nowe szkolenie:</h3>
        <input
          type="text"
          placeholder="Nazwa Szkolenia"
          value={newCourse.nazwa_szkolenia}
          onChange={(e) => setNewCourse({ ...newCourse, nazwa_szkolenia: e.target.value })}
        />
        <input
          type="text"
          placeholder="Opis Szkolenia"
          value={newCourse.opis_szkolenia}
          onChange={(e) => setNewCourse({ ...newCourse, opis_szkolenia: e.target.value })}
        />
        <input
          type="date"
          value={newCourse.data_szkolenia}
          onChange={(e) => setNewCourse({ ...newCourse, data_szkolenia: e.target.value })}
        />
        <button onClick={handleAddCourse}>Dodaj</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CourseManagement;
