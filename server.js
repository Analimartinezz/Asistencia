const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// DB
const db = new sqlite3.Database('./public/escuela');

// Ver tablas
db.all(
  "SELECT name FROM sqlite_master WHERE type='table'",
  [],
  (err, rows) => {
    console.log("TABLAS:", rows);
  }
);

// 🔵 MIDDLEWARE (SOLO UNA VEZ)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// HOME
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Consultas.html'));
});

// CONSULTAS
app.get('/consultasDB', (req, res) => {
    db.all('SELECT * FROM consultas', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// BUSCAR CONSULTAS
app.post('/buscarConsultas', (req, res) => {

    const { alumno, fecha, tipo } = req.body;

    let sql = "SELECT * FROM consultas WHERE 1=1";
    let parametros = [];

    if (alumno) {
        sql += " AND alumno LIKE ?";
        parametros.push(`%${alumno}%`);
    }

    if (fecha) {
        sql += " AND fecha = ?";
        parametros.push(fecha);
    }

    if (tipo) {
        sql += " AND tipo = ?";
        parametros.push(tipo);
    }

    db.all(sql, parametros, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// PERFIL
app.get('/perfilDB', (req, res) => {

    db.get(
        'SELECT * FROM usuarios WHERE id = 1',
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(row);

        }
    );

});

// 🔥 ACTUALIZAR PERFIL (CORREGIDO)
app.post('/actualizarPerfil', (req, res) => {

    console.log("BODY RECIBIDO:", req.body); // DEBUG IMPORTANTE

    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).json({
            mensaje: "Faltan datos"
        });
    }

    db.run(
        `UPDATE usuarios SET nombre=?, correo=?, password=? WHERE id=1`,
        [nombre, correo, password],
        function (err) {

            if (err) {
                console.log("ERROR SQL:", err);

                return res.status(500).json({
                    mensaje: "Error al actualizar",
                    error: err.message
                });
            }

            return res.json({
                mensaje: "Perfil actualizado correctamente"
            });

        }
    );

});

// START SERVER
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});