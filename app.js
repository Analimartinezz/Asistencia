import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import db, {
  registrarAlumno,
  obtenerAlumnos,
  eliminarAlumno,
  actualizarAlumno,
  registrarParticipacion,
  eliminarParticipacion,
  actualizarParticipacion,
  registrarAsistencia,
  obtenerHistorialGeneral,  //consultas
  obtenerHistorialFiltrado

} from './escuela.js';

// recrear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());


// servir estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'principal.html'));
});

app.get('/alumnos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registroAlumno.html'));
});

app.get('/asistencia', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Asistencia.html'));
});

app.get('/participacion', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'participaciones.html'));
});

app.get('/consultas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Consultas.html'));
});

/* ==========================
   API ALUMNOS
========================== */

// Obtener todos los alumnos
app.get('/api/alumnos', (req, res) => {

    try {

        const alumnos = obtenerAlumnos();

        res.json(alumnos);

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});

// Registrar alumno

app.post('/api/alumnos', (req, res) => {

    try {

        const {
            matricula,
            nombre
        } = req.body;

        registrarAlumno(
            matricula,
            nombre
        );

        res.json({
            success: true,
            mensaje: 'Alumno registrado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});

// Eliminar alumno
app.delete('/api/alumnos/:matricula', (req, res) => {

    try {

        eliminarAlumno(
            req.params.matricula
        );

        res.json({
            success: true,
            mensaje: 'Alumno eliminado'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});

// Editar alumno

// Editar alumno

app.put('/api/alumnos/:matricula', (req,res)=>{

    try{

        actualizarAlumno(
            req.params.matricula,
            req.body.matricula,
            req.body.nombre
        );

        res.json({
            success:true,
            mensaje:'Alumno actualizado'
        });

    }catch(error){

        res.status(500).json({
            success:false,
            mensaje:error.message
        });

    }

});




/* ==========================
   API ASISTENCIA
========================== */

// Registrar asistencia de alumno
app.post('/api/asistencia', (req, res) => {

    try {

        const {
            matricula,
            fecha,
            estado
        } = req.body;

        registrarAsistencia(
            matricula,
            fecha,
            estado
        );

        res.json({
            success: true,
            mensaje: 'Asistencia registrada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});


/* ==========================
   API PARTICIPACION
========================== */

// Obtener el historial de participaciones con nombres
app.get('/api/participaciones', (req, res) => {

    try {

        const stmt = db.prepare(`
            SELECT participaciones.id, participaciones.matricula, participaciones.fecha, participaciones.descripcion, alumnos.nombre AS nombre
            FROM participaciones
            INNER JOIN alumnos ON participaciones.matricula = alumnos.matricula
        `);

        const lista = stmt.all();

        res.json(lista);

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});

// Registrar participación
app.post('/api/participaciones', (req, res) => {

    try {

        const {
            matricula,
            fecha,
            descripcion
        } = req.body;

        registrarParticipacion(
            matricula,
            fecha,
            descripcion
        );

        res.json({
            success: true,
            mensaje: 'Participación registrada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

});
// Eliminar participación
app.delete('/api/participaciones/:id', (req, res) => {
    try {
        // req.params.id toma el número que viene en la URL
        eliminarParticipacion(req.params.id);
        
        res.json({ 
            success: true, 
            mensaje: 'Participación eliminada' 
        });
    } catch (error) {
        console.error("Error al eliminar:", error.message);
        res.status(500).json({ 
            success: false, 
            mensaje: error.message 
        });
    }
});

// Editar participación
app.put('/api/participaciones/:id', (req, res) => {
    try {
        const { descripcion, fecha } = req.body;
        
        actualizarParticipacion(
            req.params.id, 
            descripcion, 
            fecha
        );
        
        res.json({ 
            success: true, 
            mensaje: 'Participación actualizada' 
        });
    } catch (error) {
        console.error("Error al actualizar:", error.message);
        res.status(500).json({ 
            success: false, 
            mensaje: error.message 
        });
    }
});

/* ==========================
   API CONSULTAS
========================== */
app.get('/api/consultas', (req, res) => {

    const { matricula, fecha, tipo } = req.query;

    let datos = obtenerHistorialGeneral();

    if (matricula) {
        const value = matricula.toLowerCase();

        datos = datos.filter(d =>
            (d.matricula || '').toLowerCase().includes(value) ||
            (d.nombre || '').toLowerCase().includes(value)
        );
    }

    if (fecha) {
        datos = datos.filter(d =>
            d.fecha === fecha
        );
    }

    if (tipo) {
        datos = datos.filter(d =>
            d.tipo === tipo
        );
    }

    res.json(datos);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});

