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


app.listen("5000", () => {
  console.log("Server is running!");
});

