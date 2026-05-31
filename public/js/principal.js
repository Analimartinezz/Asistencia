function abrirMenu(){
    document.getElementById("menu").style.display = "block";
}

function cerrarMenu(){
    document.getElementById("menu").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function(){

    let fecha = document.getElementById("fechaActual");

    if(fecha){
        fecha.textContent =
        new Date().toLocaleDateString(
            "es-ES",
            {
                weekday:"long",
                year:"numeric",
                month:"long",
                day:"numeric"
            }
        );
    }

});