import React, { useState, useEffect } from 'react';

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pobieranie danych z endpointa /benefity po zamontowaniu komponentu
    fetch('http://localhost:5000/benefity')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Wystąpił błąd podczas pobierania benefitów');
        }
        return response.json();
      })
      .then((data) => {
        setBenefits(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h2>Benefity oferowane przez firmę</h2>
      
      <ul>
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <strong>{benefit.nazwa_benefitu}</strong> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Benefits;
