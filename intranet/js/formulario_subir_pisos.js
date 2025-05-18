// Obtener todos los botones de restar y sumar por clase
let botones_calculo_restar = document.getElementsByClassName("boton_restar");
let botones_calculo_sumar = document.getElementsByClassName("boton_sumar");

// Obtener todos los botones que alternan la visibilidad de secciones
const toggleButtons = document.querySelectorAll(".toggle_button");

// Obtener los checkbox generales de tipo de vivienda
let checkbox_generales_vivienda = document.getElementsByClassName("check_vivienda_todos");

// Función que asigna los eventos al cargar completamente la página
function asignarEventos() {
    if (document.readyState == 'complete') {
        // Evento al cambiar la transacción (comprar, alquilar, etc.)
        document.getElementById("subir_piso_transaccion").addEventListener("change", comprueba_tipos_inmuebles);
        
        // Eventos para botones de restar valores
        for (let boton_resta of botones_calculo_restar) {
            boton_resta.addEventListener("click", restar_div);
        }

        // Eventos para botones de sumar valores
        for (let boton_sumar of botones_calculo_sumar) {
            boton_sumar.addEventListener("click", sumar_div);
        }

        // Evento para alternar visibilidad de secciones
        toggleButtons.forEach(button => {
            button.addEventListener("click", function() {
                const targetId = this.getAttribute("data-target");
                const section = document.getElementById(targetId);

                // Alternar visibilidad con flex/none
                if (section.style.display === "none" || section.style.display === "") {
                    section.style.display = "flex";
                } else {
                    section.style.display = "none";
                }
            });
        });
    }

    // Eventos para los checkbox de tipo de vivienda
    for (let checkbox_general of checkbox_generales_vivienda) {
        checkbox_general.addEventListener("change", crear_select_tipo_viviendas);
    }
}

// Función que crea un select específico según el tipo de vivienda marcado
function crear_select_tipo_viviendas(e) {
    // Limpiar contenedores anteriores
    document.getElementById("contenedor_select").innerHTML = "";
    document.getElementById("contenedor_titulo").innerHTML = "";

    // Obtener el ID del checkbox marcado
    let check_marcado = e.target.id;
    console.log(check_marcado);

    // Crear título para el select
    let titulo_select = document.createElement("h3");
    titulo_select.textContent = "Concrete el tipo (Opcional)";
    document.getElementById("contenedor_titulo").appendChild(titulo_select);

    let select_pulsado;
    let opciones;

    // Opciones según tipo de vivienda
    if (check_marcado == "tipo_piso_subir_vivienda") {
        select_pulsado = document.createElement("select");
        select_pulsado.id = "piso_concreto_subir_piso";
        opciones = [
            { valor: " ", texto: " " },
            { valor: "pisos_plantas_intermedias", texto: "Plantas intermedias" },
            { valor: "pisos_apartamento", texto: "Apartamento" },
            { valor: "pisos_atico", texto: "Ático" },
            { valor: "pisos_duplex", texto: "Duplex" },
            { valor: "pisos_loft", texto: "Loft" },
            { valor: "pisos_planta_baja", texto: "Planta Baja" },
            { valor: "pisos_estudio", texto: "Estudio" }
        ];
    }

    if (check_marcado == "tipo_casa_subir_vivienda") {
        select_pulsado = document.createElement("select");
        select_pulsado.id = "tipo_casa_subir_vivienda";
        opciones = [
            { valor: " ", texto: " " },
            { valor: "casa_chalet", texto: "Casa o Chalet" },
            { valor: "casa_finca_rustica", texto: "Finca rústica" },
            { valor: "casa_adosada", texto: "Casa adosada" }
        ];
    }

    // Agregar las opciones al select
    opciones.forEach(opcion => {
        const elemento_opcion = document.createElement("option");
        elemento_opcion.value = opcion.valor;
        elemento_opcion.textContent = opcion.texto;
        elemento_opcion.id = opcion.valor;
        select_pulsado.appendChild(elemento_opcion);
    });

    // Añadir el select al contenedor
    document.getElementById("contenedor_select").appendChild(select_pulsado);

    // Deseleccionar los demás checkboxes
    for (let checkbox_general of checkbox_generales_vivienda) {
        checkbox_general.checked = false;
    }

    // Seleccionar solo el checkbox actual
    e.target.checked = true;
}

// Crear select inicial de tipos de inmueble
crear_tipos_inmueble();

// Función para restar en los contadores
function restar_div(e) {
    let div_padre = e.target.parentElement;
    let id_padre = div_padre.id;
    console.log(id_padre);
    let contenedor_a_restar = id_padre.split("_");
    let contenedor_padre = contenedor_a_restar[1] + "_" + contenedor_a_restar[2] + "_" + contenedor_a_restar[3];
    let anterior_contenido = parseInt(document.getElementById(contenedor_padre).textContent);
    if (anterior_contenido > 0) {
        document.getElementById(contenedor_padre).textContent = anterior_contenido - 1;
    }
}

// Función para sumar en los contadores
function sumar_div(e) {
    let div_padre = e.target.parentElement;
    let id_padre = div_padre.id;
    console.log(id_padre);
    let contenedor_a_sumar = id_padre.split("_");
    let contenedor_padre = contenedor_a_sumar[1] + "_" + contenedor_a_sumar[2] + "_" + contenedor_a_sumar[3];
    let anterior_contenido = parseInt(document.getElementById(contenedor_padre).textContent);
    document.getElementById(contenedor_padre).textContent = anterior_contenido + 1;
}

// Crea el select para los tipos de inmueble
function crear_tipos_inmueble() {
    document.getElementById("subir_piso_tipo_inmueble").innerHTML = "";

    let label = document.createElement("label");
    label.setAttribute("for", "subir_tipos_inmueble");
    label.textContent = "Tipos de Inmuebles";

    let select = document.createElement("select");
    select.name = "subir_tipos_inmueble";
    select.id = "subir_tipos_inmueble";

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

    for (let i = 0; i < opciones.length; i++) {
        let option = document.createElement("option");
        option.value = opciones[i].value;
        option.textContent = opciones[i].text;
        select.appendChild(option);
    }

    document.getElementById("subir_piso_tipo_inmueble").appendChild(label);
    document.getElementById("subir_piso_tipo_inmueble").appendChild(select);

    // Asignar eventos para desplegar filtros según tipo y transacción
    document.getElementById("subir_tipos_inmueble").addEventListener("mouseleave", despliega_check_box);
    document.getElementById("subir_piso_transaccion").addEventListener("mouseleave", despliega_check_box);
}

// Reacciona al cambio en el tipo de transacción (comprar, alquilar, etc.)
function comprueba_tipos_inmuebles() {
    console.log(document.getElementById("subir_piso_transaccion").value);
    switch (document.getElementById("subir_piso_transaccion").value) {
        case "comprar":
        case "alquilar":
            crear_tipos_inmueble();
            break;
        case "compartir":
        case "alquiler_opcion_compra":
            document.getElementById("subir_tipos_inmueble").innerHTML = "";
            let option_alquiler = document.createElement("option");
            option_alquiler.value = "vivienda";
            option_alquiler.textContent = "Vivienda";
            document.getElementById("subir_tipos_inmueble").appendChild(option_alquiler);
            break;
        case "trapaso":
            document.getElementById("subir_tipos_inmueble").innerHTML = "";
            let option_traspaso = document.createElement("option");
            option_traspaso.value = "local_nave";
            option_traspaso.textContent = "Local y Nave";
            document.getElementById("subir_tipos_inmueble").appendChild(option_traspaso);
            break;
        default:
            alert("Error en la introduccion de datos");
            window.location.reload();
    }
}

// Despliega/oculta filtros según tipo de inmueble seleccionado
function despliega_check_box() {
    let estilo_check = window.getComputedStyle(document.getElementById("subir_piso_tipo_construccion"));
    console.log(document.getElementById("subir_piso_transaccion").value + " y " + document.getElementById("subir_tipos_inmueble").value);

    if (document.getElementById("subir_tipos_inmueble").value == "vivienda") {
        console.log("Mostramos tipo vivienda");
        document.getElementById("boton_desplegar_vivienda").style.display = "flex";
    } else {
        console.log("Ocultamos tipo vivienda");
        document.getElementById("boton_desplegar_vivienda").style.display = "none";
        document.getElementById("filtros_tipo_vivienda").style.display = "none";
        document.getElementById("contenedor_titulo").innerHTML = "";
        document.getElementById("contenedor_select").innerHTML = "";
        let desmarcar_tipo_vivienda = document.getElementsByClassName("check_vivienda_todos");
        desmarcar_tipo_vivienda[0].checked = false;
        desmarcar_tipo_vivienda[1].checked = false;
    }

    if (document.getElementById("subir_tipos_inmueble").value == "vivienda" || document.getElementById("subir_tipos_inmueble").value == "promociones") {
        console.log("Mostramos habitaciones y baños");
        document.getElementById("boton_desplegar_h_b").style.display = "flex";
        console.log("Mostramos extras");
        document.getElementById("boton_desplegar_filtros_extras").style.display = "flex";
    } else {
        console.log("Ocultamos habitaciones y baños");
        document.getElementById("boton_desplegar_h_b").style.display = "none";
        document.getElementById("boton_desplegar_filtros_extras").style.display = "none";
        document.getElementById("filtros_habitaciones_baños").style.display = "none";
        document.getElementById("filtros_extras").style.display = "none";
        document.getElementById("habitaciones_subir_vivienda").textContent = "0";
        document.getElementById("baños_subir_vivienda").textContent = "0";

        let checkbox_extras = document.getElementsByClassName("subir_piso_extras");
        for (let checkbox_actual of checkbox_extras) {
            if (checkbox_actual.checked == true) {
                checkbox_actual.checked = false;
            }
        }
    }

    if ((document.getElementById("subir_piso_transaccion").value == "comprar" || document.getElementById("subir_piso_transaccion").value == "alquilar") && document.getElementById("subir_tipos_inmueble").value == "vivienda") {
        console.log("Destapa");
        document.getElementById("subir_piso_tipo_construccion").style.display = "flex";
    } else {
        document.getElementById("subir_piso_tipo_construccion").style.display = "none";
        let desmarcar_checkbox = document.getElementsByClassName("radio_tipo_construccion");
        desmarcar_checkbox[0].checked = false;
        desmarcar_checkbox[1].checked = false;
    }
}

// Asignar los eventos una vez que se haya leído el DOM
document.addEventListener('readystatechange', asignarEventos, false);



