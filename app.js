import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  registrarAlumno,
  obtenerAlumnos,
  eliminarAlumno,
  actualizarAlumno
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

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});

