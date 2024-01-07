import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        // Użytkownik nie jest zalogowany, przekierowujemy na stronę logowania
        return <Navigate to="/login" />;
    }

    // Użytkownik jest zalogowany, renderujemy komponent dziecko
    return children;
};

export default ProtectedRoute;