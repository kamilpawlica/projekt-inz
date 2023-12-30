const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const bodyParser = require('body-parser');
const Pool = require("pg").Pool;
const pool = new Pool ({
    user: "postgres",
    password: "admin",
    host:  "localhost",
    port: 5432,
    database: "zarzadzanie"
});


app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRoute);



// Endpoint do pobierania informacji o aktualnie zalogowanym użytkowniku
app.get('/user/:googleid', async (req, res) => {
  try {
    const googleId = req.params.googleid;
    const result = await pool.query('SELECT * FROM pracownicy WHERE googleid = $1', [googleId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych użytkownika' });
  }
});



// do wszystkich userow

app.get('/users', async (req, res) => {
  try {
      const result = await pool.query('SELECT googleid, imie, nazwisko, email FROM pracownicy');

      if (result.rows.length > 0) {
          res.json(result.rows);
      } else {
          res.status(404).json({ message: 'Nie znaleziono użytkowników' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych użytkowników' });
  }
});




// Pobieranie nazwy stanowiska na podstawie ID
app.get('/stanowiska/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT nazwa_stanowiska FROM stanowiska WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Zwracamy pierwszą pasującą nazwę stanowiska
    } else {
      res.status(404).json({ message: 'Stanowisko nie znalezione' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania stanowiska' });
  }
});


// Pobieranie nazwy benefita na podstawie ID
app.get('/benefity/:googleid', async (req, res) => {
  try {
    const googleId = req.params.googleid;
    const query = `
      SELECT b.nazwa_benefitu
      FROM benefity_pracownicy bp
      JOIN benefity b ON bp.id_benefitu = b.id
      WHERE bp.googleid = $1
    `;
    const { rows } = await pool.query(query, [googleId]);

    if (rows.length > 0) {
      const benefity = rows.map(row => row.nazwa_benefitu);
      res.json(benefity);
    } else {
      res.status(404).json({ message: 'Benefity nie znalezione' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania benefitów' });
  }
});


// Pobieranie wszystkich kompetencji
app.get('/kompetencje', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kompetencje');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania kompetencji' });
  }
});

// Pobieranie wszystkich benefitow
app.get('/benefity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM benefity');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania benefitow' });
  }
});

// Pobieranie nazwy umowy na podstawie id
app.get('/typ_umow/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT nazwa_typu_umowy FROM typ_umow WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Zwracamy pierwszą pasującą nazwę umowy
    } else {
      res.status(404).json({ message: 'Typ umowy nie znaleziony' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania typu umowy' });
  }
});


app.get('/kompetencje/:googleid', async (req, res) => {
  try {
    const googleId = req.params.googleid;
    // Pobierz nazwy kompetencji dla danego googleid z tabeli kompetencje_pracownicy
    const query = `
      SELECT k.nazwa_kompetencji
      FROM kompetencje_pracownicy kp
      JOIN kompetencje k ON kp.kompetencje = k.ID
      WHERE kp.googleid = $1
    `;
    const { rows } = await pool.query(query, [googleId]);

    // Zwróć nazwy kompetencji jako odpowiedź HTTP
    const kompetencje = rows.map(row => row.nazwa_kompetencji);
    res.json(kompetencje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania kompetencji' });
  }
});



// Endpoint do wstawiania danych nieobecności
app.post('/insert-absence', async (req, res) => {
  try {
    const { googleid, data_poczatkowa, data_koncowa, powod } = req.body;

    // Tutaj możesz dodać walidację danych wejściowych, jeśli jest to wymagane

    // Wstawienie danych do tabeli 'nieobecnosc'
    const queryText = `
      INSERT INTO nieobecnosci (googleid, data_poczatkowa, data_koncowa, powod)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [googleid, data_poczatkowa, data_koncowa, powod];

    await pool.query(queryText, values);

    res.status(201).json({ message: 'Dane nieobecności zostały dodane pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas wstawiania danych nieobecności:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas wstawiania danych nieobecności.' });
  }
});

app.get('/employee-absences/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;

    // Pobierz nieobecności pracownika na podstawie jego googleid
    const queryText = `
      SELECT * FROM nieobecnosci
      WHERE googleid = $1
    `;
    const { rows } = await pool.query(queryText, [googleid]);

    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania nieobecności pracownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania nieobecności pracownika.' });
  }
});

app.delete('/delete-absence/:absenceId', async (req, res) => {
  try {
    const { absenceId } = req.params;

    // Usuwanie nieobecności na podstawie ID nieobecności
    const queryText = `
      DELETE FROM nieobecnosci
      WHERE ID = $1
    `;
    const values = [absenceId];

    const result = await pool.query(queryText, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Nieobecność została usunięta pomyślnie.' });
    } else {
      res.status(404).json({ message: 'Nie znaleziono nieobecności do usunięcia.' });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania nieobecności:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania nieobecności.' });
  }
});





// Endpoint do wstawiania danych urlopu przez pracownika
app.post('/insert-leave', async (req, res) => {
  try {
    const { googleid, data_rozpoczecia, data_zakonczenia } = req.body;

    // Tutaj możesz dodać walidację danych wejściowych, jeśli jest to wymagane

    // Wstawienie danych do tabeli 'urlopy'
    const queryText = `
      INSERT INTO urlopy (googleid, data_rozpoczecia, data_zakonczenia)
      VALUES ($1, $2, $3)
    `;
    const values = [googleid, data_rozpoczecia, data_zakonczenia];

    await pool.query(queryText, values);

    res.status(201).json({ message: 'Urlop został dodany pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas dodawania urlopu:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania urlopu.' });
  }
});




// Endpoint do pobierania danych urlopów pracownika
app.get('/employee-leaves/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;

    // Pobierz urlopy pracownika na podstawie jego googleid
    const queryText = `
      SELECT * FROM urlopy
      WHERE googleid = $1
    `;
    const { rows } = await pool.query(queryText, [googleid]);

    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania urlopów pracownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania urlopów pracownika.' });
  }
});




// Endpoint do usuwania danych urlopów pracownika
app.delete('/delete-leave/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;

    // Usuwanie urlopu na podstawie ID urlopu
    const queryText = `
      DELETE FROM urlopy
      WHERE ID = $1
    `;
    const values = [leaveId];

    const result = await pool.query(queryText, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Urlop został usunięty pomyślnie.' });
    } else {
      res.status(404).json({ message: 'Nie znaleziono urlopu do usunięcia.' });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania urlopu:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania urlopu.' });
  }
});



app.post('/insert-availability', async (req, res) => {
  try {
    const { googleid, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia } = req.body;

    // Tutaj możesz dodać walidację danych wejściowych, jeśli jest to wymagane

    // Wstawienie danych do tabeli 'dostepnosc'
    const queryText = `
      INSERT INTO dostepnosc (googleid, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [googleid, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia];

    await pool.query(queryText, values);

    res.status(201).json({ message: 'Dostępność została dodana pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas dodawania dostępności:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania dostępności.' });
  }
});


app.get('/employee-availability/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;

    // Pobierz dostępność pracownika na podstawie jego googleid
    const queryText = `
      SELECT * FROM dostepnosc
      WHERE googleid = $1
    `;
    const { rows } = await pool.query(queryText, [googleid]);

    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania dostępności pracownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dostępności pracownika.' });
  }
});


app.delete('/delete-availability/:availabilityId', async (req, res) => {
  try {
    const { availabilityId } = req.params;

    // Usuwanie dostępności na podstawie ID dostępności
    const queryText = `
      DELETE FROM dostepnosc
      WHERE ID = $1
    `;
    const values = [availabilityId];

    const result = await pool.query(queryText, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Dostępność została usunięta pomyślnie.' });
    } else {
      res.status(404).json({ message: 'Nie znaleziono dostępności do usunięcia.' });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania dostępności:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania dostępności.' });
  }
});


app.delete('/delete-employee-training/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;

    // Usuwanie rekordu z tabeli szkolenia_pracownicy na podstawie googleid
    const queryText = `
      DELETE FROM szkolenia_pracownicy
      WHERE googleid = $1
    `;
    const values = [googleid];

    const result = await pool.query(queryText, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Rekord został usunięty pomyślnie.' });
    } else {
      res.status(404).json({ message: 'Nie znaleziono rekordu do usunięcia.' });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania rekordu:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania rekordu.' });
  }
});


app.get('/assigned-trainings/:googleid', async (req, res) => {
  const { googleid } = req.params;

  try {
    const result = await pool.query(`
      SELECT sz.*, sp.googleid
      FROM szkolenia_pracownicy sp
      JOIN szkolenia sz ON sp.id_szkolenia = sz.id
      WHERE sp.googleid = $1
    `, [googleid]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przypisanych szkoleń pracownika.' });
  }
});

app.get('/szkolenia_pracownicy/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;

    // Pobierz szkolenia przypisane do pracownika na podstawie jego googleid
    const queryText = `
    SELECT * FROM szkolenia_pracownicy
    WHERE googleid = $1
    `;
    const { rows } = await pool.query(queryText, [googleid]);

    res.json(rows);
  } catch (error) {
    console.error('Błąd podczas pobierania szkoleń pracownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania szkoleń pracownika.' });
  }
});

app.get('/szkolenia_pracownicy', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM szkolenia_pracownicy');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania szkolen' });
  }
});

//pobieranie wszystkich szkolen w firmie
app.get('/szkolenia', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM szkolenia');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania szkolen' });
  }
});


//wstawianie szkolenia 
app.post('/insert-training', async (req, res) => {
  try {
    const { nazwa_szkolenia, opis_szkolenia, data_szkolenia } = req.body;

    // Tutaj możesz dodać walidację danych wejściowych, jeśli jest to wymagane

    // Wstawienie danych do tabeli 'szkolenia'
    const queryText = `
      INSERT INTO szkolenia (nazwa_szkolenia, opis_szkolenia, data_szkolenia)
      VALUES ($1, $2, $3)
    `;
    const values = [nazwa_szkolenia, opis_szkolenia, data_szkolenia];

    await pool.query(queryText, values);

    res.status(201).json({ message: 'Szkolenie zostało dodane pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas dodawania szkolenia:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania szkolenia.' });
  }
});


app.post('/assign-training', async (req, res) => {
  try {
    const { googleid, id_szkolenia } = req.body;

    // Tutaj możesz dodać walidację danych wejściowych, jeśli jest to wymagane

    // Przypisanie pracownika do szkolenia w tabeli 'szkolenia_pracownicy'
    const queryText = `
      INSERT INTO szkolenia_pracownicy (googleid, id_szkolenia)
      VALUES ($1, $2)
    `;
    const values = [googleid, id_szkolenia];

    await pool.query(queryText, values);

    res.status(201).json({ message: 'Przypisanie szkolenia do pracownika zostało wykonane pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas przypisywania szkolenia do pracownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas przypisywania szkolenia do pracownika.' });
  }


 

});


app.listen("5000", () => {
  console.log("Server is running!");
});

