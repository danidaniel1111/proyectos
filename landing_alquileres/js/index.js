let lat_min;
let lat_max;
let lon_min;
let lon_max; 
let evento_asignado=true;
let busqueda;
let mapa;
let control_dibujo=false;
let latitud;
let longitud;
let figuras_dibujadas;
// Inicializa el mapa y establece la vista inicial
  mapa = L.map('mapa').setView([40.02794897323571, -3.601486902892963], 20); //  latitud, longitud 40.027948973235716, -3.601486902892963

  // Carga de texturas de Mapa 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mapa);

  // Agrega un marcador en el mapa
  L.marker([40.02794897323571, -3.601486902892963]).addTo(mapa)
    .bindPopup('Mister Pixel')
    .openPopup();
//document.getElementById("ultima_busqueda").innerHTML="";

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById("zona_usuario").value.length>3 ) {
        console.log('Se pulsó la tecla Enter y hay contenido para buscar');
		calcula_zona();
       
    }
});
function asignarEventos() { 					//Disparador de eventos
    if (document.readyState == 'complete'){
		document.getElementById("calculo_hipoteca").addEventListener("click",calculo_hipoteca);
		document.getElementById("zona_usuario").addEventListener("input",muestra_boton);
		document.getElementById("modo_forma").addEventListener("click",modo_forma);
		document.getElementById("modo_comprar").addEventListener("click",crear_select);
		document.getElementById("modo_alquilar").addEventListener("click",crear_select);
		document.getElementById("modo_compartir").addEventListener("click",crear_select);
		document.getElementById("calculo_hipoteca").addEventListener("click",crear_select);
		//document.getElementById("modo_circulo").addEventListener("click",modo_circulo);
		//document.getElementById("modo_rectangulo").addEventListener("click",modo_rectangulo);
	}
}

function calculo_hipoteca(){
	window.location.href = './formulario.html';
}

function crear_select(e){
	let opciones;
	document.getElementById("contenedor_select").innerHTML="";
	// mirar el id del boton pulsado , y dependiendo de cual es, creamos el select con unos valores u otros 
	console.log(e.target.id);
	switch (e.target.id) {
		case "modo_comprar":
			console.log(e.target.id);
		    opciones = {
				"obra_nueva": "Obra Nueva",
				"viviendas": "Viviendas",
				"habitacion": "Habitacion",
				"garaje": "Garajes",
				"trastero": "Trasteros",
				"oficinas": "Oficinas",
				"locales_naves": "Locales o Naves",
				"traspasos": "Traspasos",
				"terrenos": "Terrenos",
				"edificios": "Edificios"
			};
			break;

		case "modo_alquilar":
			console.log(e.target.id);
		    opciones = {
				"obra_nueva": "Obra Nueva",
				"viviendas": "Viviendas",
				"habitacion": "Habitacion",
				"garaje": "Garajes",
				"trastero": "Trasteros",
				"oficinas": "Oficinas",
				"locales_naves": "Locales o Naves",
				"traspasos": "Traspasos",
				"terrenos": "Terrenos",
				"edificios": "Edificios"
			};
			break;

		case "modo_compartir":
			console.log(e.target.id);
			opciones = {
				"viviendas": "Viviendas",
				"habitacion": "Habitacion",
				"garaje": "Garajes",
				"trastero": "Trasteros"
			};
			break;

		default:
			document.getElementById("contenedor_select").innerHTML="<p>Error en la seleccion de filtros</p>";
			break;
	}
	// Crear el elemento <select>
	let select_filtros = document.createElement('select');

	// Añadir un id al <select>
	select_filtros.id = "tipo_filtro";
	select_filtros.name = "tipo_filtro";
	
	// Crear opciones para el select
	for (let indice in opciones) {
		let option_filtro = document.createElement('option');
		console.log(`Índice: ${indice}, Contenido: ${opciones[indice]}`);
		option_filtro.value = indice; // Establece el atributo "value"
		option_filtro.textContent = opciones[indice]; // Establece el texto visible
		select_filtros.appendChild(option_filtro); // Añade la opción al select
	}
	// Agregar el <select> al DOM"
	document.getElementById('contenedor_select').appendChild(select_filtros);
}
function modo_forma(){
	// Detectar cuando se crea un rectángulo
    mapa.on('draw:created', function (event) {
    let layer = event.layer;
    figuras_dibujadas.addLayer(layer);
	// Obtén los límites del rectángulo
    let bounds = layer.getBounds();
    let latMin = bounds.getSouth();
    let lonMin = bounds.getWest();
    let latMax = bounds.getNorth();
    let lonMax = bounds.getEast();
	// Llama a la función para obtener calles dentro del área
    obtener_calles(latMin, lonMin, latMax, lonMax, layer);
    });	
	if(control_dibujo){								//Si figura no contiene falso, es que hay una forma ya , y la borra
			console.log("borra quitamos control antiguo");
			mapa.removeControl(control_dibujo);
			control_dibujo = false; // Limpia la referencia después de eliminarlo

	}
	else{
		personalizar_texto_español();
		figuras_dibujadas = new L.FeatureGroup().addTo(mapa);
		control_dibujo = new L.Control.Draw({
			draw: {
				polyline: false,  //True-False habilitar o deshabilitar
				polygon: true,    
				rectangle: false,  
				circle: false,    
				marker: true     
			},
			edit: {
				featureGroup:figuras_dibujadas,  // Donde se almacenan las formas dibujadas IMPORTANTE
				remove: true      // Habilitar la opción para eliminar figuras
			}
		});
		
		mapa.addControl(control_dibujo);
		
		//EVENTOS DE CREACION / BORRADO DE FIGURAS

		// Evento que se dispara cuando una figura es creada
		mapa.on('draw:created', function (event) {
		  let layer = event.layer;  // Obtener la capa del objeto dibujado
		  figuras_dibujadas.addLayer(layer); // Añadir la figura dibujada al grupo de figuras
		});

		// Evento que se dispara cuando se pulsa clear all
		mapa.on('draw:deleted', function (event) {

			// Aquí puedes realizar las acciones que desees cuando se borren los elementos del mapa
			console.log('Se han eliminado todos los elementos del mapa.');

			// Miramos si hay marcadores en el mapa 
			if (typeof marcadores_lugares_interes !== 'undefined') {
				marcadores_lugares_interes.forEach(marcador => {
					mapa.removeLayer(marcador);							//Lo borramos 
				});
				marcadores_lugares_interes = []; // Limpiar el array de marcadores
				console.log('Se han eliminado los marcadores de lugares de interés.');
			}

		});
	}
	
		//SACAR LAS CALLES DE LA ZONA 
function obtener_calles(latMin, lonMin, latMax, lonMax, popupLayer) {
            let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(way["highway"]["name"](${latMin},${lonMin},${latMax},${lonMax}););out;`;
			lat_min=latMin;
			lat_max=latMax;
			lon_min=lonMin;
			lon_max=lonMax;
            fetch(overpassUrl)
                .then(response => response.json())
                .then(data => {
                    let calles = []; // Para almacenar los nombres de calles

                    data.elements.forEach(element => {
                        if (element.type === "way" && element.tags.name) {
                            calles.push(element.tags.name); // Añade el nombre de la calle

                            // Dibujar la calle como polilínea
                            let puntos = element.nodes.map(node => {
                                let nodo = data.elements.find(el => el.id === node && el.type === "node");
                                return nodo ? [nodo.lat, nodo.lon] : null;
                            }).filter(coord => coord !== null);

                            if (puntos.length > 1) {
                                L.polyline(puntos, { color: 'blue' }).addTo(mapa);
                            }
                        }
                    });

                    // Muestra los nombres de las calles en un popup
                    popupLayer.bindPopup(calles.length > 0
                        ? `<b>Calles encontradas:</b><br>${calles.join('<br>')}`
                        : 'No se encontraron calles en esta área.'
                    ).openPopup();
                })
                .catch(error => console.error("Error al obtener los datos:", error));
				latitud = (lat_max + latMin) / 2;
				longitud = (lon_min + lon_max) / 2;
				buscar_lugares(latitud, longitud);
				//API Open-Meteo
				let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=precipitation,windspeed_10m,winddirection_10m,cloudcover&current_weather=true`;

				// Llamada a la API
				fetch(url)
				  .then(response => response.json())
				  .then(data => {
					// Extraer y mostrar datos del clima
					let temperatura = data.current_weather.temperature;

					// Variables adicionales
					let velocidad_viento = data.hourly.windspeed_10m[0]; // Velocidad del viento (km/h)
					let direccion_viento = data.hourly.winddirection_10m[0]; // Dirección del viento (grados)
					let nubosidad = data.hourly.cloudcover[0]; // Nubosidad (%)

					// Actualizar la interfaz
					document.getElementById('clima').innerHTML = `
					 <p>La temperatura actual es de ${temperatura}°C.</p>
					 <p> Velocidad del viento: ${velocidad_viento} km/h.</p>
					 <p>Dirección del viento: ${direccion_viento}°.</p>
					 <p>Nubosidad: ${nubosidad}%.</p>
					`;
				  })
				  .catch(error => console.error('Error al obtener datos de clima:', error));
        }
}



function muestra_boton(){
	if(document.getElementById("zona_usuario").value.length >3){
		document.getElementById("busqueda").style.display="block";
	}
	else{
		document.getElementById("busqueda").style.display="none";
	}
	if(evento_asignado){
		document.getElementById("busqueda").addEventListener("click",calcula_zona);
		evento_asignado=false
	}
	
}


function calcula_zona(){
	document.getElementById("ultima_busqueda").style.display="block";
	document.getElementById("mensaje_error").innerHTML="";
	if(document.getElementById("tipo_filtro")){
		console.log("Entra con valor: "+document.getElementById("tipo_filtro".value));
		busqueda=document.getElementById("zona_usuario").value+"/"+document.getElementById("tipo_filtro").value;
		document.getElementById("ultima_busqueda").innerHTML+="<p>"+busqueda+"</p>";
		//document.getElementById("filtro_+_zona").innerHTML="";
		//document.getElementById("filtro_+_zona").innerHTML="<p>"+busqueda+"</p>";
		// Obtener la dirección escrita por el usuario
		let direccion = document.getElementById("zona_usuario").value;
		let direccion_busqueda;
		let latitud_busqueda;
		let longitud_busqueda;
		// URL de la API Nominatim para hacer la búsqueda
		let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
		// Realizar la solicitud HTTP para obtener los datos de geolocalización
		fetch(url)
			.then(response => response.json())  // Convertimos la respuesta en formato JSON
			.then(data => {
			// Si la API devuelve resultados
			if (data.length > 0) {
					 // Obtener las coordenadas del primer resultado
					latitud_busqueda = data[0].lat;
					longitud_busqueda = data[0].lon;
					direccion_busqueda = data[0].display_name;
					// Inicializar el mapa solo si las coordenadas son válidas
					if (latitud_busqueda && longitud_busqueda) {
					// Si el mapa no ha sido inicializado, lo inicializamos
					if (!mapa) {
						mapa = L.map('mapa').setView([latitud_busqueda, longitud_busqueda], 13);
						L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mapa);
					} 
					else {
						// Si el mapa ya ha sido inicializado, solo actualizamos la vista
						mapa.setView([latitud_busqueda, longitud_busqueda], 13);
					}

					// Agregar un marcador en el mapa
					L.marker([latitud_busqueda, longitud_busqueda]).addTo(mapa)
							.bindPopup(direccion_busqueda)
							.openPopup();
					}
				} 
				else {
					document.getElementById("filtro_+_zona").innerHTML = "<p>No se encontraron resultados.</p>";
					}
					})
					.catch(error => {
						document.getElementById("filtro_+_zona").innerHTML = `<p>Error al obtener los datos: ${error}</p>`;
					});
    }
	else{
		document.getElementById("mensaje_error").innerHTML="<p>Por favor, seleccione un filtro</p>";
	}
}


// Variable global para almacenar los marcadores de lugares de interés
let marcadores_lugares_interes = [];

// Función para buscar lugares y agregar marcadores al mapa
function buscar_lugares(lat, lon) {

    document.getElementById("vecindario").innerHTML = "";
    console.log("Buscando lugares en:", lat, lon);
	const categorias = {											//Traduccir lugares de interes 
		"restaurant": "Restaurante",
		"bank": "Banco",
		"cafe": "Cafetería",
		"bar": "Bar",
		"hospital": "Hospital",
		"school": "Escuela",
		"supermarket": "Supermercado",
		"park": "Parque",
		"hotel": "Hotel",
		"veterinary": "Veterinario",
		"pub": "Bar Pub",
		"clinic": "Clínica",
		"place_of_worship": "Lugar de culto",
		"music_school": "Escuela de Música",
		"nightclub": "Discoteca",
		"theatre": "Teatro",
		"pharmacy": "Farmacia",
		"parking": "Aparcamiento",
		"library": "Biblioteca",
		"dentist": "Dentista",
		"fast_food": "Local de Comida Rápida",
		"townhall": "Ayuntamiento",
		"parking_entrance": "Entrada de aparcamiento",
		"doctors": "Médicos/Urgencias",
		"post_office": "Oficina de correos",
		"prison": "Prisión",
		"residential": "Edificio Residencial",
		"apartments": "Apartamentos",
		"hostel": "Hostal",
		"guest_house": "Casa de Huéspedes",
		"camp_site": "Camping",
		"caravan_site": "Área de Caravanas",
		"highway": "Carretera",
		"primary": "Carretera Principal",
		"secondary": "Carretera Secundaria",
		"railway_station": "Estación de Tren",
		"airport": "Aeropuerto",
		"helipad": "Helipuerto",
		"bus_station": "Estación de Autobuses",
		"cinema": "Cine",
		"museum": "Museo",
		"sports_centre": "Centro Deportivo",
		"stadium": "Estadio",
		"swimming_pool": "Piscina",
		"fitness_centre": "Gimnasio",
		"natural_wood": "Bosque",
		"natural_water": "Cuerpo de Agua",
		"natural_peak": "Pico Montañoso",
		"natural_beach": "Playa",
		"forest": "Área Forestal",
		"farmland": "Área Agrícola",
		"atm": "Cajero Automático",
		"fuel": "Gasolinera",
		"toilets": "Baños Públicos",
		"fire_station": "Estación de Bomberos",
		"police": "Comisaría de Policía",
		"water_tower": "Torre de Agua",
		"garden": "Jardín",
		"bicycle_rental": "Alquiler de Bicicletas",
		"post_box": "Oficinas de Envios"
	};
	mapa.setView([lat, lon], 20); // Centrar el mapa
    let radio = 200;  // 200 metros (rango de búsqueda)
    let url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radio},${lat},${lon})["amenity"];out;`;
    console.log("Llamando a URL:", url);

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta de Overpass API");
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            if (data.elements.length === 0) {
                document.getElementById('vecindario').innerHTML = '<p>No se encontraron lugares cercanos.</p>';
                return;
            }

            // Limpiar mapa
            mapa.eachLayer(layer => {
                if (layer instanceof L.Marker && !layer.options.permanent) mapa.removeLayer(layer);
            });

            // Vaciar la lista de marcadores antes de agregar nuevos
            marcadores_lugares_interes = [];

            // Procesar datos
            let html = '';
            data.elements.forEach(el => {
                if (el.tags && el.tags.name) {
                    // Traducir categoría
                    let categoria = el.tags.amenity ? categorias[el.tags.amenity] || el.tags.amenity : "Desconocido";
                    
                    // Crear una clase basada en la categoría
                    let clase_marcador = `marcador_${el.tags.amenity}`;

                    html += `<p><strong>${el.tags.name}</strong> (${categoria})</p>`;
                    
                    // Crear marcador con una clase personalizada según la categoría
                    let marcador = L.marker([el.lat, el.lon], {
                        icon: L.divIcon({
                            className: clase_marcador, // Asignar la clase personalizada
                            html: `<div class="icono-mark"><p>${categoria.charAt(0)}</p></div>`, // Contenido del marcador
                            iconSize: [30, 30] // Tamaño del icono
                        })
                    })
                    .addTo(mapa)
                    .bindPopup(`${el.tags.name} (${categoria})`);

                    // Guardar el marcador en el array de marcadores PARA BORRAR CON EVENTO CLEAR ALL 
                    marcadores_lugares_interes.push(marcador);
                }
            });

            document.getElementById('vecindario').innerHTML = html || '<p>No se encontraron lugares cercanos.</p>';
        })
        .catch(error => {
            console.error("Error al obtener lugares:", error);
            document.getElementById('vecindario').innerHTML = '<p>Error al cargar datos. Revisa la consola.</p>';
        });
}

 function personalizar_texto_español() {
	// Personalizar los textos de las herramientas de dibujo
	L.drawLocal.draw.toolbar.buttons.polygon = 'Dibuja un polígono';
	L.drawLocal.draw.toolbar.buttons.polyline = 'Dibuja una línea elegante';
	L.drawLocal.draw.toolbar.buttons.rectangle = 'Dibuja un rectángulo';
	L.drawLocal.draw.toolbar.buttons.circle = 'Dibuja un círculo perfecto';
	L.drawLocal.draw.toolbar.buttons.marker = 'Añadir marcador aquí';
	L.drawLocal.draw.toolbar.buttons.circlemarker = 'Dibuja un marcador circular';

	// Personalizar los textos de las acciones de la barra de herramientas
	L.drawLocal.draw.toolbar.actions.title = 'Cancelar dibujo';
	L.drawLocal.draw.toolbar.actions.text = 'Cancelar';

	// Personalizar los textos de finalizar el dibujo
	L.drawLocal.draw.toolbar.finish.title = 'Finalizar dibujo';
	L.drawLocal.draw.toolbar.finish.text = 'Terminar';

	// Personalizar los textos de deshacer acción
	L.drawLocal.draw.toolbar.undo.title = 'Deshacer';
	L.drawLocal.draw.toolbar.undo.text = 'Deshacer último paso';


	// Personalizar los textos de la barra de herramientas cuando se está dibujando
	L.drawLocal.draw.handlers.polygon.tooltip.start = 'Haz clic para empezar el polígono';
	L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Haz clic para añadir más puntos';
	L.drawLocal.draw.handlers.polygon.tooltip.end = 'Haz clic en el primer punto para cerrar el polígono';

	L.drawLocal.draw.handlers.polyline.tooltip.start = 'Haz clic para empezar la línea';
	L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Haz clic para añadir más puntos';
	L.drawLocal.draw.handlers.polyline.tooltip.end = 'Haz clic para terminar la línea';

	L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Haz clic y arrastra para dibujar el rectángulo';
	L.drawLocal.draw.handlers.rectangle.tooltip.end = 'Suelta para terminar el rectángulo';

	L.drawLocal.draw.handlers.circle.tooltip.start = 'Haz clic y arrastra para dibujar el círculo';
	L.drawLocal.draw.handlers.circle.tooltip.end = 'Suelta para terminar el círculo';

	L.drawLocal.draw.handlers.marker.tooltip.start = 'Haz clic para colocar el marcador';

	// Personalizar los textos de la barra de herramientas al editar
	L.drawLocal.edit.toolbar.buttons.edit = 'Editar objetos';
	L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ningún objeto seleccionado para editar';
	L.drawLocal.edit.toolbar.buttons.remove = 'Eliminar objetos';
	L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Ningún objeto seleccionado para eliminar';
	
	// Personalizamos los textos del CircleMarker
    L.drawLocal.draw.handlers.circlemarker.tooltip.start = 'Haz clic y arrastra para dibujar el marcador circular'; // Cuando empieza a dibujar
    L.drawLocal.draw.handlers.circlemarker.tooltip.continue = 'Sigue arrastrando para ajustar el tamaño'; // Mientras arrastra
    L.drawLocal.draw.handlers.circlemarker.tooltip.end = 'Haz clic para finalizar'; // Cuando termina de dibujar
    L.drawLocal.draw.handlers.circlemarker.radius = 'Radio del marcador'; // Texto cuando se cambia el radio del marcador
	

}

document.addEventListener('readystatechange', asignarEventos, false); //Disparador de eventos