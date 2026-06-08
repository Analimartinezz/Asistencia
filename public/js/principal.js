function abrirMenu(){
    document.getElementById("menu").style.display="block";
}

function cerrarMenu(){
    document.getElementById("menu").style.display="none";
}

document.addEventListener("DOMContentLoaded", () => {

    // FECHA
    document.getElementById("fechaActual").textContent =
        new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    // CONTADORES INICIALES
    cargarContadorAlumnos();
    cargarContadorParticipaciones();
    cargarContadorAsistencias();
    cargarContadorAsistencias();

    // REFRESCO AUTOMÁTICO
    setInterval(cargarContadorAlumnos, 3000);
    setInterval(cargarContadorParticipaciones, 3000);
});

async function cargarContadorAlumnos(){

    const respuesta = await fetch('/api/alumnos');
    const alumnos = await respuesta.json();

    document.getElementById('totalAlumnosDashboard').textContent =
        alumnos.length;
}

async function cargarContadorParticipaciones() {

    const respuesta = await fetch('/api/participaciones');
    const lista = await respuesta.json();

    document.getElementById('totalParticipacionesDashboard').textContent =
        lista.length;
}

async function cargarContadorAsistencias() {

    const respuesta = await fetch('/api/asistencia');
    const lista = await respuesta.json();

    document.getElementById('totalAsistenciasDashboard').textContent =
        lista.length;
}