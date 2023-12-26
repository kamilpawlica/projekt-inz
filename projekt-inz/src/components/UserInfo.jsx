import React, { useState, useEffect } from 'react';

const UserInfoList = ({ usersData }) => {
  const [userInfo, setUserInfo] = useState(usersData);
  const [stanowisko, setStanowisko] = useState('');

  useEffect(() => {
    // Funkcja do pobierania nazwy stanowiska
    const fetchStanowiskoName = async () => {
      try {
        if (userInfo.stanowisko) {
          const response = await fetch(`http://localhost:5000/stanowiska/${userInfo.stanowisko}`);
          if (response.ok) {
            const data = await response.json();
            setStanowisko(data.nazwa_stanowiska);
          } else {
            console.error('Błąd podczas pobierania nazwy stanowiska');
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania nazwy stanowiska:', error);
      }
    };

    // Wywołaj funkcję pobierania nazwy stanowiska po zmianie wartości userInfo.stanowisko
    fetchStanowiskoName();
  }, [userInfo.stanowisko]);

  useEffect(() => {
    // Dodaj efekt do monitorowania zmiany stanowiska i ponownego renderowania komponentu
  }, [stanowisko]);

  if (!userInfo) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h1>Dane użytkownika</h1>
      <ul>
        <li>Typ umowy: {userInfo.typ_umowy}</li>
        <li>
          Stanowisko: {stanowisko ? stanowisko : 'Brak stanowiska'}
        </li>
        <li>Wynagrodzenie: {userInfo.wynagrodzenie} PLN</li>
        <li>Benefity: {userInfo.benefity}</li>
      </ul>
    </div>
  );
};

export default UserInfoList;
