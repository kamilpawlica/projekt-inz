import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import AbsenceForm from '../components/AbsenceForm';
import LeaveForm from '../components/LeaveForm';
import AvailabilityForm from '../components/AvailabilityForm';
import Benefits from '../components/Benefits';
import Training from '../components/Training';
import "../pages/AdminPanel.jsx";
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


    if (userData && userData.stanowisko === 11) {
        return <Navigate to="/AdminPanel" />;
    }

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
        <div className='wrapperUserPanel'>
            <div className="headerxd"> 
                <h1 className='mainHeader'>Panel pracownika <br/></h1>
                <h2 className='secondHeader'>Witaj, {userData.imie} <br/></h2>
                {userData.aktywny === 'nie' && (
                    <p className="inactiveMessage">Nie jesteś aktywnym pracownikiem firmy.</p>
                )}
            </div>
    
            {userData.aktywny === 'nie' ? (
                null // Jeżeli pracownik nie jest aktywny, nie renderuj żadnych komponentów
            ) : (
                <div className='ukladstrony'>
                    <UserInfo usersData={userData} />
                    <Benefits />
                    <Training usersData={userData} />
                    <LeaveForm usersData={userData} />
                    <AvailabilityForm usersData={userData} />
                    <AbsenceForm usersData={userData} />
                </div>
            )}
        </div>
    );
};

export default UserPanel;
