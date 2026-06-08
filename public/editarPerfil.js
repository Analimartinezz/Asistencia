const idUsuario = sessionStorage.getItem("idUsuario");

console.log("JS cargado");
function guardarCambios() {

    const nombre =
        document.getElementById("nombreUsuario").value;

    const correo =
        document.getElementById("correoUsuario").value;

    const password =
        document.getElementById("nuevaPassword").value;

    const confirmar =
        document.getElementById("confirmarPassword").value;

    // ❗ VALIDACIÓN 1: no vacíos
    if (!nombre || !correo || !password || !confirmar) {
        alert("Todos los campos son obligatorios");
        return;
    }

    // ❗ VALIDACIÓN 2: contraseñas iguales
    if (password !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // ❗ VALIDACIÓN 3: longitud mínima
    if (password.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres");
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
.then(async res => {

    const data = await res.json();

    if (!res.ok) {
        alert(data.mensaje);
        return;
    }

    alert(data.mensaje);
    window.location.href = "perfil.html";

})
.catch(error => {
    console.log(error);
    alert("Error al actualizar perfil");
});
}