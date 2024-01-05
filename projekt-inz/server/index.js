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

/* AdminPanel */
app.get('/pracownicy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.googleid, 
        p.imie, 
        p.nazwisko, 
        p.email, 
        s.nazwa_stanowiska, 
        tu.nazwa_typu_umowy, 
        p.wynagrodzenie
      FROM pracownicy p
      INNER JOIN stanowiska s ON p.stanowisko = s.id
      INNER JOIN typ_umow tu ON p.typ_umowy = tu.id
    `);

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


app.get('/benefity_pracownicy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bp.googleid, bp.id_benefitu, b.nazwa_benefitu
      FROM benefity_pracownicy bp
      INNER JOIN benefity b ON bp.id_benefitu = b.id
    `);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'Nie znaleziono benefitów pracowników' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania benefitów pracowników' });
  }
});

app.get('/kompetencje_pracownicy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT kp.googleid, k.nazwa_kompetencji
      FROM kompetencje_pracownicy kp
      INNER JOIN kompetencje k ON kp.kompetencje = k.id
    `);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'Nie znaleziono kompetencji pracowników' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania kompetencji pracowników' });
  }
});


app.delete('/delete_benefit/:id', async (req, res) => {
  const benefitId = req.params.id;

  try {
    // Sprawdź, czy benefit o danym ID istnieje
    const checkBenefit = await pool.query('SELECT * FROM benefity WHERE id = $1', [benefitId]);

    if (checkBenefit.rows.length === 0) {
      return res.status(404).json({ message: 'Benefit o podanym ID nie istnieje' });
    }

    // Usuń benefit z tabeli
    await pool.query('DELETE FROM benefity WHERE id = $1', [benefitId]);

    res.json({ message: 'Benefit został pomyślnie usunięty' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania benefitu' });
  }
});


app.post('/add_benefit', async (req, res) => {
  const { nazwa_benefitu } = req.body;

  try {
    const result = await pool.query('INSERT INTO benefity (nazwa_benefitu) VALUES ($1) RETURNING *', [nazwa_benefitu]);

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]); // Zwróć dodany benefit
    } else {
      res.status(404).json({ message: 'Nie udało się dodać benefitu' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania benefitu' });
  }
});


app.get('/stanowiska', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stanowiska');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania stanowisk' });
  }
});

app.delete('/delete_stanowisko/:id', async (req, res) => {
  const stanowiskoId = req.params.id;

  try {
    // Sprawdź, czy stanowisko o danym ID istnieje
    const checkStanowisko = await pool.query('SELECT * FROM stanowiska WHERE id = $1', [stanowiskoId]);

    if (checkStanowisko.rows.length === 0) {
      return res.status(404).json({ message: 'Stanowisko o podanym ID nie istnieje' });
    }

    // Usuń stanowisko z tabeli
    await pool.query('DELETE FROM stanowiska WHERE id = $1', [stanowiskoId]);

    res.json({ message: 'Stanowisko zostało pomyślnie usunięte' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania stanowiska' });
  }
});


app.post('/add_stanowisko', async (req, res) => {
  const { nazwa_stanowiska } = req.body;

  try {
    const result = await pool.query('INSERT INTO stanowiska (nazwa_stanowiska) VALUES ($1) RETURNING *', [nazwa_stanowiska]);

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]); // Zwróć dodane stanowisko
    } else {
      res.status(404).json({ message: 'Nie udało się dodać stanowiska' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania stanowiska' });
  }
});


app.delete('/delete_kompetencja/:id', async (req, res) => {
  const kompetencjaId = req.params.id;

  try {
    // Sprawdź, czy kompetencja o danym ID istnieje
    const checkKompetencja = await pool.query('SELECT * FROM kompetencje WHERE id = $1', [kompetencjaId]);

    if (checkKompetencja.rows.length === 0) {
      return res.status(404).json({ message: 'Kompetencja o podanym ID nie istnieje' });
    }

    // Usuń kompetencję z tabeli
    await pool.query('DELETE FROM kompetencje WHERE id = $1', [kompetencjaId]);

    res.json({ message: 'Kompetencja została pomyślnie usunięta' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania kompetencji' });
  }
});


app.post('/add_kompetencja', async (req, res) => {
  const { nazwa_kompetencji } = req.body;

  try {
    const result = await pool.query('INSERT INTO kompetencje (nazwa_kompetencji) VALUES ($1) RETURNING *', [nazwa_kompetencji]);

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]); // Zwróć dodaną kompetencję
    } else {
      res.status(404).json({ message: 'Nie udało się dodać kompetencji' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania kompetencji' });
  }
});

app.get('/typy_umow', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM typ_umow');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania typów umów' });
  }
});


app.post('/add_typ_umowy', async (req, res) => {
  const { nazwa_typu_umowy } = req.body;

  try {
    const result = await pool.query('INSERT INTO typ_umow (nazwa_typu_umowy) VALUES ($1) RETURNING *', [nazwa_typu_umowy]);

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]); // Zwróć dodany typ umowy
    } else {
      res.status(404).json({ message: 'Nie udało się dodać typu umowy' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania typu umowy' });
  }
});

app.delete('/delete_typ_umowy/:id', async (req, res) => {
  const typUmowyId = req.params.id;

  try {
    // Sprawdź, czy typ umowy o danym ID istnieje
    const checkTypUmowy = await pool.query('SELECT * FROM typ_umow WHERE id = $1', [typUmowyId]);

    if (checkTypUmowy.rows.length === 0) {
      return res.status(404).json({ message: 'Typ umowy o podanym ID nie istnieje' });
    }

    // Usuń typ umowy z tabeli
    await pool.query('DELETE FROM typ_umow WHERE id = $1', [typUmowyId]);

    res.json({ message: 'Typ umowy został pomyślnie usunięty' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania typu umowy' });
  }
});

app.post('/add_szkolenie', async (req, res) => {
  const { nazwa_szkolenia, opis_szkolenia, data_szkolenia } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO szkolenia (nazwa_szkolenia, opis_szkolenia, data_szkolenia) VALUES ($1, $2, $3) RETURNING *',
      [nazwa_szkolenia, opis_szkolenia, data_szkolenia]
    );

    if (result.rows.length > 0) {
      res.status(201).json(result.rows[0]); // Zwróć dodane szkolenie
    } else {
      res.status(404).json({ message: 'Nie udało się dodać szkolenia' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas dodawania szkolenia' });
  }
});

app.delete('/delete_szkolenie/:id', async (req, res) => {
  const szkolenieId = req.params.id;

  try {
    // Sprawdź, czy szkolenie o danym ID istnieje
    const checkSzkolenie = await pool.query('SELECT * FROM szkolenia WHERE id = $1', [szkolenieId]);

    if (checkSzkolenie.rows.length === 0) {
      return res.status(404).json({ message: 'Szkolenie o podanym ID nie istnieje' });
    }

    // Usuń szkolenie z tabeli
    await pool.query('DELETE FROM szkolenia WHERE id = $1', [szkolenieId]);

    res.json({ message: 'Szkolenie zostało pomyślnie usunięte' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania szkolenia' });
  }
});


app.get('/szkolenia_prac', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT prac.imie, prac.nazwisko, prac.email, szk.nazwa_szkolenia
      FROM szkolenia_pracownicy sp
      INNER JOIN pracownicy prac ON sp.googleid = prac.googleid
      INNER JOIN szkolenia szk ON sp.id_szkolenia = szk.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych' });
  }
});


app.get('/urlopy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.imie, p.nazwisko, p.email, u.data_rozpoczecia, u.data_zakonczenia
      FROM urlopy u
      INNER JOIN pracownicy p ON u.googleid = p.googleid
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych urlopów' });
  }
});

app.get('/nieobecnosci', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.imie, p.nazwisko, p.email, n.data_poczatkowa, n.data_koncowa, n.powod
      FROM nieobecnosci n
      INNER JOIN pracownicy p ON n.googleid = p.googleid
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych nieobecności pracowników' });
  }
});

app.get('/dostepnosc', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.imie, p.nazwisko, p.email, d.dzien_tygodnia, d.godzina_rozpoczecia, d.godzina_zakonczenia
      FROM dostepnosc d
      INNER JOIN pracownicy p ON d.googleid = p.googleid
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania danych dyspozycji pracowników' });
  }
});


app.put('/zmien_wynagrodzenie/:googleid', async (req, res) => {
  try {
    const googleid = req.params.googleid;
    const noweWynagrodzenie = req.body.wynagrodzenie;

    if (!noweWynagrodzenie) {
      return res.status(400).json({ message: 'Brak nowego wynagrodzenia w żądaniu' });
    }

    const query = 'UPDATE pracownicy SET wynagrodzenie = $1 WHERE googleid = $2';
    const values = [noweWynagrodzenie, googleid];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pracownik o podanym ID nie istnieje' });
    }

    return res.status(200).json({ message: 'Wynagrodzenie pracownika zostało zmienione', nowe_wynagrodzenie: noweWynagrodzenie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
});


app.put('/zmien_stanowisko/:googleid', async (req, res) => {
  try {
    const { googleid } = req.params;
    const { noweStanowiskoId } = req.body; // Zakładam, że przesyłasz ID nowego stanowiska

    // Sprawdzamy, czy pracownik istnieje
    const checkEmployeeQuery = 'SELECT * FROM pracownicy WHERE googleid = $1';
    const employee = await pool.query(checkEmployeeQuery, [googleid]);

    if (employee.rows.length === 0) {
      return res.status(404).json({ message: 'Pracownik o podanym googleid nie istnieje' });
    }

    // Sprawdzamy, czy nowe stanowisko istnieje
    const checkPositionQuery = 'SELECT * FROM stanowiska WHERE id = $1';
    const position = await pool.query(checkPositionQuery, [noweStanowiskoId]);

    if (position.rows.length === 0) {
      return res.status(404).json({ message: 'Stanowisko o podanym ID nie istnieje' });
    }

    // Aktualizujemy stanowisko pracownika w tabeli pracownicy
    const updateEmployeePositionQuery = 'UPDATE pracownicy SET stanowisko = $1 WHERE googleid = $2';
    await pool.query(updateEmployeePositionQuery, [noweStanowiskoId, googleid]);

    return res.status(200).json({ message: 'Stanowisko pracownika zostało zaktualizowane' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji stanowiska pracownika' });
  }
});


app.get('/pracownicy_lista', async (req, res) => {
  try {
      const query = `
          SELECT 
              p.googleid,
              p.imie, 
              p.nazwisko, 
              p.email, 
              s.nazwa_stanowiska as stanowisko, 
              tu.nazwa_typu_umowy as typ_umowy, 
              array_agg(distinct k.nazwa_kompetencji) as kompetencje, 
              array_agg(distinct b.nazwa_benefitu) as benefity, 
              p.wynagrodzenie
          FROM 
              pracownicy p
          LEFT JOIN stanowiska s ON p.stanowisko = s.id
          LEFT JOIN typ_umow tu ON p.typ_umowy = tu.id
          LEFT JOIN kompetencje_pracownicy kp ON p.googleid = kp.googleid
          LEFT JOIN kompetencje k ON kp.kompetencje = k.id
          LEFT JOIN benefity_pracownicy bp ON p.googleid = bp.googleid
          LEFT JOIN benefity b ON bp.id_benefitu = b.id
          GROUP BY p.googleid, s.nazwa_stanowiska, tu.nazwa_typu_umowy, p.wynagrodzenie
      `;
      
      const result = await pool.query(query);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error while fetching data');
  }
});


app.put('/aktualizuj_pracownika/:googleid', async (req, res) => {
  const googleid = req.params.googleid;
  const { stanowisko, typ_umowy, kompetencje, benefity, wynagrodzenie } = req.body;

  try {
      await pool.query('BEGIN');

      const pracownikQuery = `
          UPDATE pracownicy 
          SET stanowisko = $1, typ_umowy = $2, wynagrodzenie = $3
          WHERE googleid = $4
      `;
      await pool.query(pracownikQuery, [stanowisko, typ_umowy, wynagrodzenie, googleid]);

      const updateKompetencje = async () => {
          await pool.query('DELETE FROM kompetencje_pracownicy WHERE googleid = $1', [googleid]);
          for (const kompetencja of kompetencje) {
              await pool.query('INSERT INTO kompetencje_pracownicy (googleid, kompetencje) VALUES ($1, $2)', [googleid, kompetencja]);
          }
      };
      await updateKompetencje();

      const updateBenefity = async () => {
          await pool.query('DELETE FROM benefity_pracownicy WHERE googleid = $1', [googleid]);
          for (const benefit of benefity) {
              await pool.query('INSERT INTO benefity_pracownicy (googleid, id_benefitu) VALUES ($1, $2)', [googleid, benefit]);
          }
      };
      await updateBenefity();

      await pool.query('COMMIT');
      res.status(200).send('Pracownik zaktualizowany pomyślnie.');
  } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Błąd podczas aktualizacji pracownika.');
  }
});


app.delete('/usun-benefity/:googleid', (req, res) => {
  const googleid = req.params.googleid;

  pool.query('DELETE FROM benefity_pracownicy WHERE googleid = $1', [googleid], (error, results) => {
      if (error) {
          console.error('Błąd podczas usuwania rekordów:', error);
          res.status(500).send('Wystąpił błąd podczas usuwania benefitów pracownika');
      } else {
          res.status(200).send(`Usunięto benefity pracownika o GoogleID: ${googleid}`);
      }
  });
});

app.delete('/usun-kompetencje/:googleid', (req, res) => {
  const googleid = req.params.googleid;

  pool.query('DELETE FROM kompetencje_pracownicy WHERE googleid = $1', [googleid], (error, results) => {
      if (error) {
          console.error('Błąd podczas usuwania rekordów:', error);
          res.status(500).send('Wystąpił błąd podczas usuwania kompetencji pracownika');
      } else {
          res.status(200).send(`Usunięto kompetencje pracownika o GoogleID: ${googleid}`);
      }
  });
});


app.listen("5000", () => {
  console.log("Server is running!");
});

