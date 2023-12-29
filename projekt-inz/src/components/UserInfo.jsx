import React, { useState, useEffect } from 'react';
import "../pages/UserPanel.css"; 
const UserInfoList = ({ usersData }) => {
  const [userInfo, setUserInfo] = useState(usersData);
  const [stanowisko, setStanowisko] = useState('');
  const [benefity, setBenefity] = useState([]);
  const [kompetencje, setKompetencje] = useState([]);
  const [typUmowy, setTypUmowy] = useState('');

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

    // Funkcja do pobierania nazw benefitów
    const fetchBenefity = async () => {
      try {
        if (userInfo.googleid) {
          const response = await fetch(`http://localhost:5000/benefity/${userInfo.googleid}`);
          if (response.ok) {
            const data = await response.json();
            setBenefity(data);
          } else {
            console.error('Błąd podczas pobierania benefitów');
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania benefitów:', error);
      }
    };

    // Funkcja do pobierania kompetencji pracownika
    const fetchKompetencje = async () => {
      try {
        if (userInfo.googleid) {
          const response = await fetch(`http://localhost:5000/kompetencje/${userInfo.googleid}`);
          if (response.ok) {
            const data = await response.json();
            setKompetencje(data);
          } else {
            console.error('Błąd podczas pobierania kompetencji');
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania kompetencji:', error);
      }
    };

    // Funkcja do pobierania nazwy typu umowy
    const fetchTypUmowyName = async () => {
      try {
        if (userInfo.typ_umowy) {
          const response = await fetch(`http://localhost:5000/typ_umow/${userInfo.typ_umowy}`);
          if (response.ok) {
            const data = await response.json();
            setTypUmowy(data.nazwa_typu_umowy);
          } else {
            console.error('Błąd podczas pobierania nazwy typu umowy');
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania nazwy typu umowy:', error);
      }
    };

    // Wywołaj funkcje pobierania danych po zmianie odpowiednich wartości
    fetchStanowiskoName();
    fetchBenefity();
    fetchKompetencje();
    fetchTypUmowyName();
  }, [userInfo.stanowisko, userInfo.googleid, userInfo.typ_umowy]);

  if (!userInfo) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className='pozycja'>
      <h1>Dane użytkownika</h1>
      <ul>
        <li>Typ umowy: {typUmowy}</li>
        <li>
          Stanowisko: {stanowisko ? stanowisko : 'Brak stanowiska'}
        </li>
        <li>Wynagrodzenie: {userInfo.wynagrodzenie} PLN</li>
        <li>Kompetencje: {kompetencje.join(', ')}</li>
        <li>Benefity: {benefity.length > 0 ? benefity.join(', ') : 'Brak benefitów'}</li>
      </ul>
    </div>
  );
};

export default UserInfoList;
