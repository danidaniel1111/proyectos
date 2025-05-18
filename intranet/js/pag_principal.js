
function asignarEventos() { 
    // Verifica si la página está completamente cargada
    if (document.readyState == 'complete'){
		document.getElementById("zona_usuario").addEventListener("mouseover",cambiar_imagen_div);
		document.getElementById("zona_usuario").addEventListener("mouseout",restaurar_imagen_div);
		document.getElementById("zona_usuario").addEventListener("click",botones_formulario_venta_piso);

	
	}
}
function botones_formulario_venta_piso(){
	window.location.href = "./subir_pisos.html";
}


function cambiar_imagen_div(){
	document.getElementById("imagen_subir_texto").src="./iconos/pag_principal/vender_casa_activado.svg";	
}
function restaurar_imagen_div(){
	document.getElementById("imagen_subir_texto").src="./iconos/pag_principal/vender_casa.svg";
}

function obtener_cookie(nombre){
    let nombre_cookie = nombre + "=";
    let cookie_limpia = decodeURIComponent(document.cookie);
    let cookies = cookie_limpia.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nombre_cookie) == 0){
            return cookie.substring(nombre_cookie.length, cookie.length);
        }
    }
    return "";
}

let usuario_cookie=obtener_cookie("usuario");
console.log(usuario_cookie);
if(usuario_cookie !== ""){
	console.log("estas logueado: "+usuario_cookie);
	
	
}
else{
	console.log("No estas logueado");	
}





// Asignar los eventos después de que la página se haya cargado completamente
document.addEventListener('readystatechange', asignarEventos, false);




