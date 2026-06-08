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

export function eliminarParticipacion(id) {
<<<<<<< HEAD
=======

    const stmt = db.prepare(`
        DELETE FROM participaciones
        WHERE id = ?
    `);

    stmt.run(id);
}

export function actualizarParticipacion(
    id,
    nuevaDescripcion,
    nuevaFecha
) {

    const stmt = db.prepare(`
        UPDATE participaciones
        SET descripcion = ?,
            fecha = ?
        WHERE id = ?
    `);

    stmt.run(
        nuevaDescripcion,
        nuevaFecha,
        id
    );
}

/* ==========================
   CONSULTAS
========================== */
>>>>>>> julian

    const stmt = db.prepare(`
        DELETE FROM participaciones
        WHERE id = ?
    `);

    stmt.run(id);
}

export function actualizarParticipacion(
    id,
    nuevaDescripcion,
    nuevaFecha
) {

    const stmt = db.prepare(`
        UPDATE participaciones
        SET descripcion = ?,
            fecha = ?
        WHERE id = ?
    `);

    stmt.run(
        nuevaDescripcion,
        nuevaFecha,
        id
    );
}

/* ==========================
   CONSULTAS
========================== */

export function obtenerConsulta(matricula, fecha, tipo) {

    let query = `
        SELECT al.matricula, al.nombre, a.fecha, 'Asistencia' AS tipo, a.estado AS detalle
        FROM alumnos al
        JOIN asistencias a ON al.matricula = a.matricula

        UNION ALL

        SELECT al.matricula, al.nombre, p.fecha, 'Participación' AS tipo, p.descripcion AS detalle
        FROM alumnos al
        JOIN participaciones p ON al.matricula = p.matricula
    `;

    const stmt = db.prepare(query);
    return stmt.all();
}

export function obtenerHistorialGeneral() {

    const stmt = db.prepare(`
        SELECT 
            al.matricula,
            al.nombre,
            a.fecha,
            a.estado AS detalle,
            'Asistencia' AS tipo
        FROM alumnos al
        JOIN asistencias a ON al.matricula = a.matricula

        UNION ALL

        SELECT 
            al.matricula,
            al.nombre,
            p.fecha,
            p.descripcion AS detalle,
            'Participación' AS tipo
        FROM alumnos al
        JOIN participaciones p ON al.matricula = p.matricula

        ORDER BY fecha DESC
    `);

    return stmt.all();
}

export function obtenerHistorialFiltrado(matricula) {

    const stmt = db.prepare(`
        SELECT 
            al.matricula,
            al.nombre,
            a.fecha,
            a.estado AS detalle,
            'Asistencia' AS tipo
        FROM alumnos al
        JOIN asistencias a ON al.matricula = a.matricula
        WHERE al.matricula = ?

        UNION ALL

        SELECT 
            al.matricula,
            al.nombre,
            p.fecha,
            p.descripcion AS detalle,
            'Participación' AS tipo
        FROM alumnos al
        JOIN participaciones p ON al.matricula = p.matricula
        WHERE al.matricula = ?

        ORDER BY fecha DESC
    `);

    return stmt.all(matricula, matricula);
}

/* ==========================
   DATOS DE PRUEBA (SEED DB)
========================== */
/* 
export function insertarDatosPrueba() {

    try {

        // =========================
        // ALUMNOS (PRIMERO SIEMPRE)
        // =========================
        db.prepare(`
            INSERT OR IGNORE INTO alumnos (matricula, nombre)
            VALUES (?, ?)
        `).run('22110001', 'Juan Pérez');

        db.prepare(`
            INSERT OR IGNORE INTO alumnos (matricula, nombre)
            VALUES (?, ?)
        `).run('22110002', 'María López');


        // =========================
        // ASISTENCIAS
        // =========================
        db.prepare(`
            INSERT INTO asistencias (matricula, fecha, estado)
            VALUES (?, ?, ?)
        `).run('22110001', '2026-06-07', 'Presente');

        db.prepare(`
            INSERT INTO asistencias (matricula, fecha, estado)
            VALUES (?, ?, ?)
        `).run('22110002', '2026-06-07', 'Falta');


        // =========================
        // PARTICIPACIONES
        // =========================
        db.prepare(`
            INSERT INTO participaciones (matricula, fecha, descripcion)
            VALUES (?, ?, ?)
        `).run('22110001', '2026-06-07', 'Respondió pregunta');

        db.prepare(`
            INSERT INTO participaciones (matricula, fecha, descripcion)
            VALUES (?, ?, ?)
        `).run('22110002', '2026-06-07', 'Participó en equipo');


        console.log('✔ DATOS INSERTADOS EN BD');

    } catch (error) {
        console.error('ERROR SEED:', error.message);
    }
}*/

export default db;