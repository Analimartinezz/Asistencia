function buscarRegistros() {

    const matricula =
        document.getElementById("buscarMatricula").value;

    const matricula =
        document.getElementById("buscarAlumno").value;

    const fecha =
        document.getElementById("fechaFiltro").value;

    const tipo =
        document.getElementById("tipoFiltro").value;

    fetch('/buscarConsultas', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            matricula,
            fecha,
            tipo
        })

    })
    .then(res => res.json())
    .then(datos => {

        mostrarResultados(datos);

    })
    .catch(error => {

        console.error(error);

    });
}

function mostrarResultados(datos) {

    const tabla =
        document.getElementById("tablaConsultas");

    tabla.innerHTML = `
        <tr>
            <th>Matrícula</th>
            <th>Alumno</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
        </tr>
    `;

    datos.forEach(registro => {

        tabla.innerHTML += `
            <tr>
                <td>${registro.matricula}</td>
                <td>${registro.alumno}</td>
                <td>${registro.fecha}</td>
                <td>${registro.tipo}</td>
                <td>${registro.descripcion}</td>
            </tr>
        `;
    });
}