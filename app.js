const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('hospital.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado a la base de datos SQLite.');
});

db.serialize(() => {
    // Tabla de Tickets
    db.run(`
        CREATE TABLE IF NOT EXISTS tickets (
            numero_ticket INTEGER PRIMARY KEY,
            nombre_paciente TEXT NOT NULL,
            edad INTEGER NOT NULL,
            genero TEXT NOT NULL,
            departamento TEXT NOT NULL,
            habitacion TEXT NOT NULL
        )
    `);

    // Tabla de Citas/Nuevos Registros
    db.run(`
        CREATE TABLE IF NOT EXISTS citas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_paciente TEXT NOT NULL,
            edad INTEGER NOT NULL,
            genero TEXT NOT NULL,
            nombre_tutor TEXT,
            edad_tutor INTEGER,
            departamento_asignado TEXT NOT NULL
        )
    `);

    // Registros iniciales
    db.run(`
        INSERT OR IGNORE INTO tickets (numero_ticket, nombre_paciente, edad, genero, departamento, habitacion)
        VALUES (1, 'Mateo López', 12, 'Masculino', 'Pediatría', 'Habitación P-102')
    `);

    db.run(`
        INSERT OR IGNORE INTO tickets (numero_ticket, nombre_paciente, edad, genero, departamento, habitacion)
        VALUES (2, 'Carlos Ruiz', 32, 'Masculino', 'General', 'Habitación G-305')
    `);

    db.run(`
        INSERT OR IGNORE INTO tickets (numero_ticket, nombre_paciente, edad, genero, departamento, habitacion)
        VALUES (3, 'Sofía Gómez', 18, 'Femenino', 'Ginecología', 'Habitación Gin-201')
    `);
});

// Rutas
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/secretaria', (req, res) => {
    res.render('secretaria');
});

// Registrar nueva consulta desde Secretaría
app.post('/registrar_cita', (req, res) => {
    const { nombre, edad, genero, nombre_tutor, edad_tutor } = req.body;
    const edadNum = parseInt(edad);

    // Lógica de asignación de departamento (Triage)
    let departamento = 'General';
    if (edadNum < 18) {
        departamento = 'Pediatría';
    } else if (genero === 'Femenino') {
        departamento = 'Ginecología / General';
    }

    const stmt = db.prepare(`
        INSERT INTO citas (nombre_paciente, edad, genero, nombre_tutor, edad_tutor, departamento_asignado)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        nombre,
        edadNum,
        genero,
        edadNum < 18 ? nombre_tutor : null,
        edadNum < 18 ? parseInt(edad_tutor) : null,
        departamento,
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Error al agendar la cita.");
            }
            res.render('confirmacion_cita', {
                id_cita: this.lastID,
                nombre,
                edad: edadNum,
                genero,
                nombre_tutor: edadNum < 18 ? nombre_tutor : null,
                departamento
            });
        }
    );
});

app.post('/buscar_ticket', (req, res) => {
    const ticketIngresado = req.body.ticket;

    db.get('SELECT * FROM tickets WHERE numero_ticket = ?', [ticketIngresado], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error en la base de datos");
        }

        if (row) {
            res.render('resultado', { encontrado: true, paciente: row });
        } else {
            res.render('resultado', { encontrado: false, ticket: ticketIngresado });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://127.0.0.1:${port}`);
});