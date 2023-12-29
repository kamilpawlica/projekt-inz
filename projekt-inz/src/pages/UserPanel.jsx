import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import AbsenceForm from '../components/AbsenceForm';
import LeaveForm from '../components/LeaveForm';
import AvailabilityForm from '../components/AvailabilityForm';
import Danezdj from "../img/dane.PNG";
import { Link } from "react-router-dom";
import "../pages/UserPanel.css"
const UserPanel = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Używamy useLocation do uzyskania dostępu do obiektu location
    const location = useLocation();

    // Funkcja do wyciągania parametrów zapytania z URL
    const getQueryParam = (param) => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get(param);
    };

    // Pobieramy googleId z URL
    const googleId = getQueryParam('google_id');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${googleId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                // Dodaj logowanie zawartości odpowiedzi
                const text = await response.text();
                
        
                const data = JSON.parse(text);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        

        if (googleId) {
            fetchUserData();
        }
    }, [googleId]);

    if (!googleId) {
        return <p>Nie podano Google ID.</p>;
    }

    if (isLoading) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div>
            <h1><center>Panel pracownika </center></h1>
            <h2><center>Witaj, {userData.imie} </center></h2>
            {userData ? (
                <div className='ukladstrony'>
                
                    {/* komponenty */}
                {/*  */}
                <UserInfo usersData={userData} />
                <AbsenceForm usersData={userData} />
                <LeaveForm usersData={userData} />
                <AvailabilityForm usersData={userData} />
                   
                </div>
            ) : (
                <p>Użytkownik nie znaleziony.</p>
            )}
        </div>
    );
};

export default UserPanel;
