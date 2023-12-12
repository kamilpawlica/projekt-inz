const Pool = require("pg").Pool;

const pool = new Pool ({
    user: "postgres",
    password: "admin",
    host:  "localhost",
    port: 5432,
    database: "zarzadzanie"
});


const addUserToDatabase = async (userData) => {
    const { google_id, first_name, last_name } = userData;
  
    // Sprawdź, czy użytkownik już istnieje
    const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);
    if (res.rows.length === 0) {
      // Użytkownik nie istnieje, dodaj do bazy danych
      await pool.query(
        'INSERT INTO users (google_id, first_name, last_name) VALUES ($1, $2, $3)',
        [google_id, first_name, last_name]
      );
    } else {
      // Użytkownik już istnieje, możesz zaktualizować dane lub nic nie robić
    }
  };    
  
  

module.exports = {
    pool,
    addUserToDatabase
};