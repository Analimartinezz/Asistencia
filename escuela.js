import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta segura
const dbPath = path.join(__dirname, 'db', 'escuela.db');
const db = new Database(dbPath);

// Activar claves foráneas
db.pragma('foreign_keys = ON');

// Crear tablas
db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alumnos (
    matricula TEXT PRIMARY KEY,
    nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL,
    fecha TEXT NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (matricula) REFERENCES alumnos(matricula)
);

CREATE TABLE IF NOT EXISTS participaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL,
    fecha TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (matricula) REFERENCES alumnos(matricula)
);

CREATE TABLE IF NOT EXISTS consultas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL,
    fecha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (matricula) REFERENCES alumnos(matricula)
);
`);

console.log('Base de datos creada correctamente.');

/* ==========================
   USUARIOS
========================== */

export function registrarUsuario(nombre, correo, password, rol) {
    try {

        const stmt = db.prepare(`
            INSERT INTO usuarios
            (nombre, correo, password, rol)
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(
            nombre,
            correo,
            password,
            rol
        );

        return {
            success: true,
            mensaje: 'Usuario registrado correctamente'
        };

    } catch (error) {

        return {
            success: false,
            mensaje: error.message
        };

    }
}

export function iniciarSesion(correo, password) {

    const stmt = db.prepare(`
        SELECT *
        FROM usuarios
        WHERE correo = ?
    `);

    const usuario = stmt.get(correo);

    if (!usuario) {

        return {
            success: false,
            mensaje: 'Usuario no encontrado'
        };

    }

    if (usuario.password !== password) {

        return {
            success: false,
            mensaje: 'Contraseña incorrecta'
        };

    }

    return {
        success: true,
        usuario
    };
}

/* ==========================
   ALUMNOS
========================== */

export function registrarAlumno(matricula, nombre) {

    const stmt = db.prepare(`
        INSERT INTO alumnos
        (matricula, nombre)
        VALUES (?, ?)
    `);

    stmt.run(
        matricula,
        nombre
    );
}

export function obtenerAlumnos() {

    const stmt = db.prepare(`
        SELECT *
        FROM alumnos
    `);

    return stmt.all();
}

export function eliminarAlumno(matricula) {

    const stmt = db.prepare(`
        DELETE FROM alumnos
        WHERE matricula = ?
    `);

    stmt.run(matricula);
}

export function actualizarAlumno(
    matriculaOriginal,
    nuevaMatricula,
    nuevoNombre
){

    const stmt = db.prepare(`
        UPDATE alumnos
        SET matricula = ?,
            nombre = ?
        WHERE matricula = ?
    `);

    stmt.run(
        nuevaMatricula,
        nuevoNombre,
        matriculaOriginal
    );
}


/* ==========================
   ASISTENCIAS
========================== */

export function registrarAsistencia(
    matricula,
    fecha,
    estado
) {

    const stmt = db.prepare(`
        INSERT INTO asistencias
        (matricula, fecha, estado)
        VALUES (?, ?, ?)
    `);

    stmt.run(
        matricula,
        fecha,
        estado
    );
}

/* ==========================
   PARTICIPACIONES
========================== */

export function registrarParticipacion(
    matricula,
    fecha,
    descripcion
) {

    const stmt = db.prepare(`
        INSERT INTO participaciones
        (matricula, fecha, descripcion)
        VALUES (?, ?, ?)
    `);

    stmt.run(
        matricula,
        fecha,
        descripcion
    );
}

/* ==========================
   CONSULTAS
========================== */

export function registrarConsulta(
    matricula,
    fecha,
    tipo,
    descripcion
) {

    const stmt = db.prepare(`
        INSERT INTO consultas
        (matricula, fecha, tipo, descripcion)
        VALUES (?, ?, ?, ?)
    `);

    stmt.run(
        matricula,
        fecha,
        tipo,
        descripcion
    );
}

/* ==========================
   PRUEBAS (opcional)
========================== */

// Descomenta para probar

/*
registrarUsuario(
    'Administrador',
    'admin@escuela.com',
    '1234',
    'profesor'
);

registrarAlumno(
    '22110001',
    'Juan Pérez'
);

registrarAsistencia(
    '22110001',
    '2026-06-07',
    'Presente'
);

registrarParticipacion(
    '22110001',
    '2026-06-07',
    'Respondió una pregunta'
);

registrarConsulta(
    '22110001',
    '2026-06-07',
    'Asesoría',
    'Solicitó ayuda con el proyecto'
);
*/

export default db;