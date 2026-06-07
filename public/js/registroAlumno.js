    let matriculaEditar = null;

        function editarAlumno(matricula, nombre){

            console.log("EDITANDO:", matricula, nombre);

            document.getElementById('nombre').value = nombre;
            document.getElementById('matricula').value = matricula;

            matriculaEditar = matricula;
        }
                
        function abrirMenu(){
            document.getElementById("menu").style.display = "block";
        }

        function cerrarMenu(){
            document.getElementById("menu").style.display = "none";
        }

        async function guardarAlumno(){

        const nombre =
            document.getElementById('nombre').value.trim();

        const matricula =
            document.getElementById('matricula').value.trim();

        let url = '/api/alumnos';
        let metodo = 'POST';

        if(matriculaEditar !== null){

            url =
                '/api/alumnos/' +
                matriculaEditar;

            metodo = 'PUT';
        }

        const respuesta = await fetch(
            url,
            {
                method: metodo,

                headers:{
                    'Content-Type':'application/json'
                },

                body:JSON.stringify({
                    nombre,
                    matricula
                })
            }
        );

        const datos =
            await respuesta.json();

        alert(datos.mensaje);

        document.getElementById(
            'nombre'
        ).value='';

        document.getElementById(
            'matricula'
        ).value='';

        matriculaEditar = null;

        cargarAlumnos();
    }

        
        async function cargarAlumnos(){

            const respuesta =
                await fetch('/api/alumnos');

            const alumnos =
                await respuesta.json();

            let html = '';

            alumnos.forEach((alumno,index)=>{

                html += `
                <tr>

                    <td>${index+1}</td>

                    <td>${alumno.nombre}</td>

                    <td>${alumno.matricula}</td>

                    <td class="acciones">

                        <button
                            class="w3-button w3-small w3-orange"
                            onclick="editarAlumno('${alumno.matricula}','${alumno.nombre}')">
                            ✏️
                        </button>

                        <button
                            class="w3-button w3-small w3-red"
                            onclick="eliminarAlumno('${alumno.matricula}')">

                            🗑️

                        </button>

                    </td>

                </tr>
                `;

            });

            document.getElementById(
                'tablaAlumnos'
            ).innerHTML = html;

        }

        cargarAlumnos();

        function buscarAlumno(){

            const filtro =
                document.getElementById('buscarAlumno')
                .value
                .toLowerCase();

            const filas =
                document.querySelectorAll(
                    '#tablaAlumnos tr'
                );

            filas.forEach(fila => {

                const texto =
                    fila.textContent.toLowerCase();

                if(texto.includes(filtro)){

                    fila.style.display = '';

                }else{

                    fila.style.display = 'none';

                }

            });

        }

        async function eliminarAlumno(matricula){

            const confirmar = confirm(
                '¿Desea eliminar este alumno?'
            );

            if(!confirmar){
                return;
            }

            try{

                const respuesta = await fetch(
                    '/api/alumnos/' + matricula,
                    {
                        method:'DELETE'
                    }
                );

                const datos = await respuesta.json();

                alert(datos.mensaje);

                cargarAlumnos();

            }catch(error){

                console.error(error);

                alert('Error al eliminar alumno');

            }

        }