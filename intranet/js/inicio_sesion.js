let usuario;
let pass;

// Asigna eventos a los botones solo cuando la página esté completamente cargada
function asignarEventos() { 
    if (document.readyState == 'complete'){
        document.getElementById("borrar_login").addEventListener("click", borrar_datos_login);
        document.getElementById("verificar_login").addEventListener("click", verificar_datos_login);
    }
}

function borrar_datos_login(){
    // Selecciona todos los inputs de la página y los vacía
    let inputs_login = document.querySelectorAll("input");
    inputs_login.forEach(input_valor => {
        input_valor.value = "";
    });

    // Comentario sugerido: también deberías vaciar las variables globales usuario y pass aquí
    // Ejemplo: usuario = ""; pass = "";
}

function verificar_datos_login(){
    // Comentario sugerido: Esta función valida los datos del login y si son válidos crea una cookie
    // Nota: en una implementación real, la validación y la creación de la cookie debería hacerse del lado del servidor

    let valido_usuario = false;
    let valido_pass = false;
    let mensaje_error_usu = "";
    let mensaje_error_pass = "";

    // Obtiene y limpia los valores del formulario
    usuario = document.getElementById("usuario_login").value.trim();
    pass = document.getElementById("pass_login").value.trim();
    usuario_limpio = usuario.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    pass_limpia = pass.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    // Limpia errores anteriores
    document.getElementById("error_usuario").innerHTML = "";
    document.getElementById("error_pass").innerHTML = "";

    // Define patrones de validación
    const patron_usu = /^[a-zA-Z0-9_]+$/; // Letras, números y guiones bajos
    const patron_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;

    // Comentario sugerido: Aquí puedes personalizar más los mensajes de error según qué parte del patrón falla

    // Validación del usuario
    if (usuario_limpio.length == 0) {
        console.log("No hay contenido en usuario");
        mensaje_error_usu += "<p>Error en el usuario, no puede ser vacio</p>";		
    } 
    else if (!patron_usu.test(usuario_limpio)) {
        console.log("No sigue el patrón usu");
        mensaje_error_usu += "<p>Error en el usuario, no contiene alguno de los caracteres necesarios: </p>";
        mensaje_error_usu += "<ul id='lista_error_caracteres'><li>Letras</li><li>Números</li><li>Guiones Bajos</li></ul>";
    } 
    else {
        valido_usuario = true;
    }

    // Validación de la contraseña
    if (pass_limpia.length == 0) {
        console.log("No hay contenido en pass");
        mensaje_error_pass += "<p>Error en la contraseña, no puede ser vacia</p>";		
    } 
    else if (pass_limpia.length < 10) {
        console.log("Longitud < 10 pass");
        mensaje_error_pass += "<p>Error en la contraseña, debe tener una longitud minima de 10 caracteres</p>";
    } 
    else if (!patron_pass.test(pass_limpia)) {
        console.log("No sigue el patrón pass");
        mensaje_error_pass += "<p>Error en la contraseña, no contiene alguno de los caracteres necesarios: </p>";
        mensaje_error_pass += "<ul id='lista_error_caracteres'><li>Tenga una longitud mínima (por ejemplo, 8 caracteres).</li><li>Contenga al menos una letra mayúscula.</li><li>Contenga al menos una letra minúscula.</li><li>Contenga al menos un número.</li><li>Contenga al menos un carácter especial (por ejemplo: !@#$%^&*).</li></ul>";
    } 
    else {
        valido_pass = true;
    }

    if (valido_pass && valido_usuario) {
        console.log("Todo ok");

        // Crea una cookie de forma simple en el cliente (mejor hacerlo desde servidor por seguridad)
        document.cookie = `usuario=${encodeURIComponent(usuario_limpio)}; 
                        path=/; 
                        secure; 
                        SameSite=Strict`;

        // Redirige a la página principal tras una pequeña pausa
        setTimeout(function() {
            window.location.href = "./pag_principal.html";
        }, 500);
    } else {
        // Muestra los errores debajo de cada campo
        document.getElementById("error_pass").innerHTML = mensaje_error_pass;
        document.getElementById("error_usuario").innerHTML = mensaje_error_usu;
    }
}

// Permite enviar el formulario al pulsar la tecla Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        console.log('Se pulsó la tecla Enter y se verifica');
        verificar_datos_login()
    }
});

// Asigna los eventos cuando cambie el estado de carga del documento
document.addEventListener('readystatechange', asignarEventos, false);





