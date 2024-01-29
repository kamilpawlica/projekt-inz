const Pool = require("pg").Pool;
const pool = new Pool ({
    user: "postgres",
    password: "admin",
    host:  "localhost",
    port: 5432,
    database: "zarzadzanie"
});


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
      // Użytkownik już istnieje, możesz zaktualizować dane lub nic nie robić
    }
  } catch (err) {
    console.error('Error adding user to database:', err);
    // Tutaj możesz obsłużyć błąd dodawania użytkownika do bazy danych
  }
};





module.exports = {
  pool,
  addUserToDatabase,
};