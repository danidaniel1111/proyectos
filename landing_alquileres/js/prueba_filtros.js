let filtro_numero_habitaciones=0;
let filtro_numero_baños=0;
let boton_anterior_habitaciones;
let boton_anterior_baños;
let botones_filtro_habitacion=document.getElementsByClassName("boton_filtrado");
let botones_extras=document.getElementsByClassName("boton_extras");
let radio_filtro_fechas=document.getElementsByClassName("checkbox_filtro_fecha");
let fecha_tipo;	
let botones_mapa= document.getElementsByClassName("leaflet-top");                  // contenedor con los controles del mapa, para ocultarlos al desplegar el pop up 
function asignarEventos() { 
    // Verifica si la página está completamente cargada
    if (document.readyState == 'complete'){
		document.getElementById("abrir_pop_up").addEventListener("click",abrir_cerrar_pop_up);
		document.getElementById("cerrar_pop_up").addEventListener("click",abrir_cerrar_pop_up);
		document.getElementById("transaccion").addEventListener("change",comprueba_tipos_inmuebles);
		document.getElementById("todos_pisos_selector_general").addEventListener("change",check_todos);
		document.getElementById("todas_casas_selector_general").addEventListener("change",check_todos);
		document.getElementById("buscar").addEventListener("click",filtrar_anuncios);
		for (let boton_evento of botones_filtro_habitacion) {
			boton_evento.addEventListener("click",boton_filtrado_habitaciones_baños);
		}
		for (let boton_evento of botones_extras) {
			boton_evento.addEventListener("click",crear_consulta_extras);
		}
		for (let radio_evento of radio_filtro_fechas) {
			radio_evento.addEventListener("change",filtro_fecha);
		}
	}
}
async function filtrar_anuncios() {
    const formData = new FormData();

    // Parte 1: Filtro select
    formData.append('transaccion', document.getElementById("transaccion").value);
    formData.append('tipo_inmueble', document.getElementById("tipos_inmueble").value);

    // Parte 1.5: Saber si el usuario ha filtrado con radiobutton opcional
    let radio_tipo_construccion = document.getElementsByClassName("radio_tipo_construccion");
    for (let radio_filtro of radio_tipo_construccion){
        if (radio_filtro.checked) {
            formData.append('tipo_construccion', radio_filtro.value);
        }
    }

    // Parte 2: Filtro precio
    let precio_min = document.getElementById("precio_min").value;
    let precio_max = document.getElementById("precio_max").value;
    if (precio_min && precio_max) {
        if (validar_precio(precio_min) && validar_precio(precio_max)) {
            let precio_min_num = parseFloat(precio_min);
            let precio_max_num = parseFloat(precio_max);
            if (precio_min_num <= precio_max_num) {
                formData.append('precio_min', precio_min_num);
                formData.append('precio_max', precio_max_num);
            }
        }
    }

    // Parte 3: Filtrar por superficies
    const valores_superficies_validar = ["60", "80", "100", "120", "140", "160", "180", "200", "220", "230"];
    if (document.getElementById("superficie_minima").value !== "no_superficie_minima" && document.getElementById("superficie_maxima").value !== "no_superficie_maxima") {
        if (valores_superficies_validar.includes(document.getElementById("superficie_minima").value) && valores_superficies_validar.includes(document.getElementById("superficie_maxima").value)) {
            let superficie_min = parseInt(document.getElementById("superficie_minima").value);
            let superficie_max = parseInt(document.getElementById("superficie_maxima").value);
            if (superficie_min <= superficie_max) {
                formData.append('superficie_min', document.getElementById("superficie_minima").value);
                formData.append('superficie_max', document.getElementById("superficie_maxima").value);
            }
        }
    }

    // Parte 4: Tipo de vivienda
    let check_viviendas = document.getElementsByClassName("filtro_checkbox_vivienda");
    for (let comprobar of check_viviendas) {
        if (comprobar.checked) {
            formData.append('viviendas', comprobar.value);
        }
    }

    // Parte 5: Contenido de las variables que contiene el valor de los botones habitaciones y baños
    if (filtro_numero_habitaciones !== undefined && filtro_numero_baños !== undefined) {
        if (!isNaN(filtro_numero_habitaciones) && !isNaN(filtro_numero_baños)) {
            formData.append('habitaciones', filtro_numero_habitaciones);
            formData.append('baños', filtro_numero_baños);
        }
    }

    // Parte 6: Extras
	for (let extra_seleccionado	of extras) {
		formData.append('extras[]', extra_seleccionado);
	}

    // Parte 7: Hora actual
    if (fecha_tipo !== undefined) {
        formData.append('fecha_tipo', fecha_tipo);
    }

    // Mostrar el contenido de FormData para depuración
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Parte 8: Enviar los datos al servidor de manera asincrónica
    try {
        const response = await fetch('/filtrar_anuncios.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json(); // Suponiendo que el servidor devuelve JSON
        console.log('Datos filtrados:', data);
    } 
	catch (error) {
        console.log('Error en la comunicación con el servidor:', error);
    }
}

function filtro_fecha(e){
	console.log(e.target.value);	//SOLO ENVIA LA FECHA, LUEGO EN PHP SE ARREGLA PARA FILTRAR
	let fecha = new Date();  //fecha actual
	let fecha_bd = fecha.toISOString();  // Convertir a formato ISO 8601
	console.log(fecha_bd);
	fecha_tipo=e.target.value+"/"+fecha_bd;
}
let extras=[];
function crear_consulta_extras(e){
	let icono_seleccionado=e.target.querySelector('img');
	let ruta_icono=icono_seleccionado.src;
	console.log(ruta_icono);
	let partes_ruta = ruta_icono.split('/');
	let nombre_imagen=partes_ruta[(partes_ruta.length-1)];
	let partes_nombre=nombre_imagen.split('.');
	
	if(!e.target.classList.contains("boton_extra_activo")){
		console.log("Valor actual: "+e.target.value);
		const valores_botones_validar = [
		"ascensor", "amueblado", "parking", "piscina", "terraza", 
		"balcon", "calefaccion", "trastero", "jardin", "no_amueblado", 
		"aire_acondicionado", "electrodomesticos", "mascotas"
		];
		if(valores_botones_validar.includes(e.target.value)){
			extras.push(e.target.value);
		}
		else{
			alert("Error en el valor de Extras");
		}
		e.target.classList.add("boton_extra_activo");
		//Cambiar el icono al modo blanco
		console.log( "Svg sin extension ni nada "+partes_nombre[0]);
		partes_ruta[(partes_ruta.length-1)]=partes_nombre[0]+"_activado.svg";
		let icono_ruta_final=partes_ruta.join('/');
		icono_seleccionado.src=icono_ruta_final;
	}
	else{
		//Modificar el string quitando la opcion 
		console.log("Modificar el string de extras quitando la opcion");
		let quitar_parte=e.target.value;
		let index = extras.indexOf(quitar_parte);
		if (index !== -1) {
			extras.splice(index, 1); // Elimina 1 elemento en el índice encontrado
		}
		e.target.classList.remove("boton_extra_activo");
		// Volver al icono negro
		let parte_nombre_activado=partes_nombre[0].split('_');
		console.log( "Svg sin extension ni nada "+partes_nombre[0]);
		partes_ruta[(partes_ruta.length-1)]=parte_nombre_activado[0]+".svg";
		let icono_ruta_final=partes_ruta.join('/');
		icono_seleccionado.src=icono_ruta_final;
	}
	console.log("Consulta para extras:"+extras);
}
function boton_filtrado_habitaciones_baños(e){
	if(e.target.classList.contains('boton_habitaciones')){
		if (isNaN(e.target.value)) {
		  alert("El valor no es un número válido");
		} 
		else {
			if (boton_anterior_habitaciones){
				boton_anterior_habitaciones.classList.remove("boton_h_b_activo");
			}
			filtro_numero_habitaciones=e.target.value;
			e.target.classList.add("boton_h_b_activo");
			boton_anterior_habitaciones=e.target;
		}
	}else if(e.target.classList.contains('boton_baños')){
		if (isNaN(e.target.value)) {
		  alert("El valor no es un número válido");
		} 
		else {
			if (boton_anterior_baños){
				boton_anterior_baños.classList.remove("boton_h_b_activo");
			}
			filtro_numero_baños=e.target.value;
			e.target.classList.add("boton_h_b_activo");
			boton_anterior_baños=e.target;
		}		
	}
	else{
		alert("Error en botones");
	}
	console.log("Habitaciones para filtrar:"+filtro_numero_habitaciones);
	console.log("Baños para filtrar:"+filtro_numero_baños);
}
crear_tipos_inmueble();

function check_todos(e) {
  // Obtén el id del elemento que disparó el evento
  let selector_general = e.target.id;
  
  // Cuando se seleccionan todos los pisos
  if (selector_general == "todos_pisos_selector_general") {
    let checkbox_viviendas = document.getElementsByClassName('checkbox_pisos');
    
    // Si el checkbox "todos_pisos_selector_general" está marcado
    if (e.target.checked) {
      for (let checkbox_seleccionado of checkbox_viviendas) {
        checkbox_seleccionado.checked = true; // Marca todos los checkboxes de pisos
      }
    } 
	else {
      for (let checkbox_seleccionado of checkbox_viviendas) {
        checkbox_seleccionado.checked = false; // Desmarca todos los checkboxes de pisos
      }
    }
  }
  
  // Cuando se seleccionan todas las casas
  else if (selector_general == "todas_casas_selector_general") {
    let checkbox_casas = document.getElementsByClassName('checkbox_casas');
    
    // Si el checkbox "todas_casas_selector_general" está marcado
    if (e.target.checked) {
      for (let checkbox_seleccionado of checkbox_casas) {
        checkbox_seleccionado.checked = true; // Marca todos los checkboxes de casas
      }
    } 
	else {
      for (let checkbox_seleccionado of checkbox_casas) {
        checkbox_seleccionado.checked = false; // Desmarca todos los checkboxes de casas
      }
    }
  }
}




function validar_precio(precio_validar) {													//FUNCION PARA VALIDAR EL CAMPO DE PRECIOS
	let valor = parseFloat(precio_validar);
    let mensaje_error = "";
	// Validar si el campo está vacío
    if (valor === "") {
		mensaje_error = "El campo no puede estar vacío.";
    }
    // Validar si el valor es mayor o igual al mínimo especificado
    else if (parseFloat(valor) < 0) {
		mensaje_error = "El precio mínimo no puede ser negativo.";
    }
    // Si todo es válido, se permite el envío del formulario
    if (mensaje_error) {
		alert(mensaje_error);
		return false;  // Evitar el envío del formulario si hay error
    }
	return true;  // Permitir el envío del formulario si no hay error
}

function crear_tipos_inmueble(){
    document.getElementById("zona_tipo_inmueble").innerHTML="";
    // Crear el <label>
    let label = document.createElement("label");
    label.setAttribute("for", "tipos_inmueble");
    label.textContent = "Tipos de Inmuebles";
	// Crear el <select>
    let select = document.createElement("select");
    select.name = "tipos_inmueble";  // Asignar el atributo name
    select.id = "tipos_inmueble";    // Asignar el id
	// Opciones para el select
    let opciones = [
		{ value: "vivienda", text: "Vivienda" },
		{ value: "promociones", text: "Promociones" },
		{ value: "local_nave", text: "Local y Nave" },
		{ value: "garaje", text: "Garaje" },
		{ value: "oficina", text: "Oficina" },
		{ value: "trastero", text: "Trastero" },
		{ value: "terreno", text: "Terreno" },
		{ value: "edificio", text: "Edificio" }
    ];
	// Crear las opciones del select
    for (let i = 0; i < opciones.length; i++) {
        let option = document.createElement("option");
        option.value = opciones[i].value;   // Asignar el valor de la opción
        option.textContent = opciones[i].text; // Asignar el texto visible de la opción
        select.appendChild(option);  // Agregar la opción al <select>
    }
	// Agregar el <label> y <select> al DOM
    document.getElementById("zona_tipo_inmueble").appendChild(label); // Agregar el label al body
    document.getElementById("zona_tipo_inmueble").appendChild(select); // Agregar el select al body	
	document.getElementById("tipos_inmueble").addEventListener("mouseleave",despliega_check_box);
	document.getElementById("transaccion").addEventListener("mouseleave",despliega_check_box);
	
}
function abrir_cerrar_pop_up(){
	let estilo = window.getComputedStyle(document.getElementById("fondo_pop_up")); // obtiene todos los atributos css, incluidos los del .css y cambiados por js
	if(estilo.display == "none"){
		document.getElementById("fondo_pop_up").style.display="flex";
		for (let boton of botones_mapa) {
			boton.style.display="none";
		}
	}
	else{
		document.getElementById("fondo_pop_up").style.display="none";	
		for (let boton of botones_mapa) {
			boton.style.display="block";
		}
	}
}

// Al pulsar en fondo negro dle pop up, se cierra
document.getElementById("fondo_pop_up").addEventListener('click', (e) => {
    if (e.target === (document.getElementById("fondo_pop_up"))) {
		document.getElementById("fondo_pop_up").style.display="none";
		for (let boton of botones_mapa) {
			boton.style.display="block";
		}
    }
});

function comprueba_tipos_inmuebles(){
	console.log(document.getElementById("transaccion").value);
	switch (document.getElementById("transaccion").value) {
		case "comprar":
		case "alquilar":
			crear_tipos_inmueble();
			break;
		case "compartir":
		case "alquiler_opcion_compra":
			document.getElementById("tipos_inmueble").innerHTML="";
			let option_alquiler = document.createElement("option");
			option_alquiler.value = "vivienda";   // Asignar el valor de la opción
			option_alquiler.textContent = "Vivienda"; // Asignar el texto visible de la opción
			document.getElementById("tipos_inmueble").appendChild(option_alquiler);  // Agregar la opción al <select>			
			break;
		case "trapaso":
			document.getElementById("tipos_inmueble").innerHTML="";
			let option_traspaso = document.createElement("option");
			option_traspaso.value = "local_nave";   // Asignar el valor de la opción
			option_traspaso.textContent = "Local y Nave"; // Asignar el texto visible de la opción
			document.getElementById("tipos_inmueble").appendChild(option_traspaso);  // Agregar la opción al <select>	
			break;
		default:
			alert("Error en la introduccion de datos");
			window.location.reload();
	}
}

function despliega_check_box(){
	let estilo_check = window.getComputedStyle(document.getElementById("zona_tipo_construccion")); // obtiene todos los atributos css, incluidos los del .css y cambiados por js
	console.log(document.getElementById("transaccion").value +" y "+document.getElementById("tipos_inmueble").value);
	if(document.getElementById("tipos_inmueble").value=="vivienda"){
		//Mostramos tipo vivienda
		console.log("Mostramos tipo vivienda");
		document.getElementById("filtros_tipo_vivienda").style.display="flex";
		document.getElementById("titulo_filtros_viviendas").style.display="flex";
	}
	else{
		console.log("Ocultamos tipo vivienda");	
		document.getElementById("filtros_tipo_vivienda").style.display="none";
		document.getElementById("titulo_filtros_viviendas").style.display="none";
		let borrar_checks=document.getElementsByClassName("filtro_checkbox_vivienda");
		for(let borrar of borrar_checks){
			borrar.checked=false;
		}
		borrar_checks=document.getElementsByClassName("check_vivienda_todos");
		for(let borrar of borrar_checks){
			borrar.checked=false;
		}
	}
	if(document.getElementById("tipos_inmueble").value=="vivienda" || document.getElementById("tipos_inmueble").value=="promociones"){
		//Mostramos habitaciones y baños
		console.log("Mostramos habitaciones y baños");
		document.getElementById("filtros_habitaciones_baños").style.display="flex";

		//Mostramos extras
		console.log("Mostramos extras");
		document.getElementById("filtros_extras").style.display="flex";
		document.getElementById("titulo_filtros_extras").style.display="flex";
	}
	else{
		//Mostramos habitaciones y baños
		console.log("Mostramos habitaciones y baños");
		document.getElementById("filtros_habitaciones_baños").style.display="none";
		document.getElementById("filtros_extras").style.display="none";
		document.getElementById("titulo_filtros_extras").style.display="none";
		// Selecciona todos los botones del documento
		let botones = document.querySelectorAll('button');

		// Recorre cada botón y quita las clases
		botones.forEach(boton => {
			boton.classList.remove('boton_h_b_activo'); 
			boton.classList.remove('boton_extra_activo');			
		});
		filtro_numero_habitaciones=0;
		filtro_numero_baños=0;
		extras=[];
	}
	if((document.getElementById("transaccion").value=="comprar" || document.getElementById("transaccion").value=="alquilar") && document.getElementById("tipos_inmueble").value=="vivienda"){
		console.log("Destapa");
		document.getElementById("zona_tipo_construccion").style.display="flex";

	}
	else{
		document.getElementById("zona_tipo_construccion").style.display="none";
		let desmarcar_checkbox= document.getElementsByClassName("radio_tipo_construccion");
		desmarcar_checkbox[0].checked=false;
		desmarcar_checkbox[1].checked=false;
	
	}
}
 
let contenedor_arriba = document.getElementById('contenedor_boton');
let contenedor_abajo = document.getElementById('contenedor_boton_abajo');
let boton_buscar = document.getElementById('buscar');

let contenedor_scroll= document.getElementById('pop_up');

// Escuchar el evento de scroll
contenedor_scroll.addEventListener('scroll', () => {
  if (contenedor_scroll.scrollTop >= 100) {
    // Mover el botón al contenedor de abajo si no está ya ahí
    if (!contenedor_abajo.contains(boton_buscar)) {
      contenedor_abajo.appendChild(boton_buscar);
    }
  } else {
    // Mover el botón al contenedor de arriba si no está ya ahí
    if (!contenedor_arriba.contains(boton_buscar)) {
      contenedor_arriba.appendChild(boton_buscar);
    }
  }
});

 
 
 
 
 
// Asignar los eventos después de que la página se haya cargado completamente
document.addEventListener('readystatechange', asignarEventos, false);




