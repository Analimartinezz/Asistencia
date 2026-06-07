function abrirMenu(){
    document.getElementById("menu").style.display="block";
}

function cerrarMenu(){
    document.getElementById("menu").style.display="none";
}

document.getElementById("fechaActual").textContent =
new Date().toLocaleDateString(
    "es-ES",
    {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    }
);

async function cargarContadorAlumnos(){

    const respuesta = await fetch('/api/alumnos');
    const alumnos = await respuesta.json();

    const total = alumnos.length;

    document.getElementById('totalAlumnosDashboard').textContent = total;
}

document.addEventListener('DOMContentLoaded', function () {
    cargarContadorAlumnos();
});

setInterval(cargarContadorAlumnos, 3000);
