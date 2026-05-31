import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// recrear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
