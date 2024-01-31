const { Pool } = require('pg');
const dbConfig = require('./dbconfig');

const pool = new Pool(dbConfig);

const addUserToDatabase = async (userData) => {
  const { google_id, first_name, last_name, email } = userData;

  try {
    // Sprawdzamy, czy tabela pracownicy jest pusta
    const checkEmptyResponse = await pool.query('SELECT COUNT(*) FROM pracownicy');
    const isEmpty = parseInt(checkEmptyResponse.rows[0].count) === 0;

    // Sprawdź, czy użytkownik już istnieje
    const res = await pool.query('SELECT * FROM pracownicy WHERE googleid = $1', [google_id]);
    if (res.rows.length === 0) {
      // Użytkownik nie istnieje, dodaj do bazy danych
      await pool.query(
        'INSERT INTO pracownicy (googleid, imie, nazwisko, email, stanowisko) VALUES ($1, $2, $3, $4, $5)',
        [google_id, first_name, last_name, email, isEmpty ? 11 : null]
      );
    } else {
      //Istnieje
    }
  } catch (err) {
    console.error('Error adding user to database:', err);
    
  }
};





module.exports = {
  pool,
  addUserToDatabase,
};