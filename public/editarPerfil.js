function guardarCambios() {

    const nombre =
        document.getElementById("nombreUsuario").value;

    const correo =
        document.getElementById("correoUsuario").value;

    const password =
        document.getElementById("nuevaPassword").value;

    const confirmar =
        document.getElementById("confirmarPassword").value;

    if (password !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    fetch('/actualizarPerfil', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            nombre,
            correo,
            password
        })

    })
    .then(res => res.json())
    .then(data => {

        alert(data.mensaje);

        window.location.href = "perfil.html";

    })
    .catch(error => {

    console.log("ERROR COMPLETO:");
    console.log(error);

    alert(error);

});

}