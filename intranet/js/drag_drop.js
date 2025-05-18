// Obtener referencias a los elementos del DOM
const zona_arrastre = document.getElementById('zona_arrastre');
const input_archivos = document.getElementById('input_archivos');
const vista_previa = document.getElementById('vista_previa');
const boton_subir = document.getElementById('boton_subir');
let contenedor_errores_validar = document.getElementById("errores_drag_drop");
let archivos = [];

// Asignar eventos cuando la página esté completamente cargada
function asignarEventos() {
    if (document.readyState == 'complete') {
        zona_arrastre.addEventListener('dragover', modo_arrastrar); // Detectar que se está arrastrando
        zona_arrastre.addEventListener('dragleave', modo_no_arrastrar); // Detectar que se deja de arrastrar
        zona_arrastre.addEventListener('drop', modo_soltar); // Detectar que se sueltan archivos
        zona_arrastre.addEventListener('click', () => input_archivos.click()); // Simular clic en input oculto
        input_archivos.addEventListener('change', (e) => manejar_archivos(e.target.files)); // Al seleccionar archivos
        boton_subir.addEventListener('click', subir_archivos); // Al pulsar el botón subir
    }
}

// Mostrar archivos seleccionados y generar vista previa
function manejar_archivos(archivos_seleccionados) {
    archivos = [...archivos, ...archivos_seleccionados]; // Añadir nuevos archivos
    vista_previa.innerHTML = ""; // Limpiar vista previa

    archivos.forEach((archivo, index) => {
        const lector = new FileReader(); // Instancia de lector
        lector.onload = (e) => {
            // Crear imagen de vista previa
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = "imagen_vista_previa";

            // Crear botón para eliminar imagen
            const boton_eliminar = document.createElement('img');
            boton_eliminar.src = "./iconos/form_subir_pisos/eliminar_fotos.svg";
            boton_eliminar.alt = "Icono Eliminar";
            boton_eliminar.style.cursor = "pointer";
            boton_eliminar.id = index;
            boton_eliminar.className = "icono_eliminar";
            boton_eliminar.addEventListener('click', eliminar_imagen); // Evento para eliminar

            // Contenedor imagen + botón
            const contenedor_imagen = document.createElement('div');
            contenedor_imagen.className = "contenedor_imagen_vista_previa";
            contenedor_imagen.appendChild(img);
            contenedor_imagen.appendChild(boton_eliminar);

            vista_previa.appendChild(contenedor_imagen); // Agregar a vista previa
        };
        lector.readAsDataURL(archivo); // Leer como URL
    });

    boton_subir.classList.add('animacion_boton_archivos'); // Añadir animación a botón
}

// Eliminar una imagen de la vista previa y del array
function eliminar_imagen(e) {
    let index_imagen = parseInt(e.target.id);
    archivos.splice(index_imagen, 1); // Quitar del array
    console.log("Archivos despues de borrado");
    for (let archivo of archivos) {
        console.log(archivo.name); // Mostrar nombres restantes
    }
    const contenedor_padre = e.target.parentElement;
    contenedor_padre.remove(); // Eliminar contenedor del DOM
}

// Eventos de drag and drop
function modo_arrastrar(e) {
    e.preventDefault();
    zona_arrastre.classList.add('arrastrando'); // Añadir estilo al arrastrar
}

function modo_no_arrastrar() {
    zona_arrastre.classList.remove('arrastrando'); // Quitar estilo al dejar de arrastrar
}

function modo_soltar(e) {
    e.preventDefault();
    zona_arrastre.classList.remove('arrastrando');
    const archivos_soltados = e.dataTransfer.files;
    manejar_archivos(archivos_soltados); // Pasar archivos soltados
}

// Validar campo de precio individual
function validar_precio(precio_validar) {
    let valor = parseFloat(precio_validar);
    let mensaje_error = "";
    if (valor === "") {
        mensaje_error = "El campo no puede estar vacío.";
    } else if (parseFloat(valor) < 0) {
        mensaje_error = "El precio mínimo no puede ser negativo.";
    }

    if (mensaje_error) {
        alert(mensaje_error);
        return false; // No permitir envío
    }
    return true; // OK
}

// Variables del formulario
let transaccion;
let precio;
let superficie;
let es_piso;
let es_casa;
let habitaciones;
let baños;
let extras;

// Validar el formulario completo
function validar_formulario() {
    let errores = [];

    transaccion = document.getElementById('subir_piso_transaccion').value;
    if (!transaccion) {
        errores.push('Debe seleccionar un tipo de transacción.');
    }

    precio = parseFloat(document.getElementById('precio_subir_vivienda').value);
    if (isNaN(precio) || precio <= 0) {
        errores.push('Debe ingresar un precio válido mayor a 0.');
    }

    superficie = parseFloat(document.getElementById('superficie_subir_vivienda').value);
    if (isNaN(superficie) || superficie <= 0) {
        errores.push('Debe ingresar una superficie válida mayor a 0.');
    }

    es_piso = document.getElementById('tipo_piso_subir_vivienda').checked;
    es_casa = document.getElementById('tipo_casa_subir_vivienda').checked;
    if (!es_piso && !es_casa) {
        errores.push('Debe seleccionar al menos Piso o Casa.');
    }

    habitaciones = parseInt(document.getElementById('habitaciones_subir_vivienda').textContent);
    if (isNaN(habitaciones) || habitaciones < 1) {
        errores.push('Debe indicar al menos una habitación.');
    }

    baños = parseInt(document.getElementById('baños_subir_vivienda').textContent);
    if (isNaN(baños) || baños < 1) {
        errores.push('Debe indicar al menos un baño.');
    }

    extras = document.querySelectorAll('.subir_piso_extras:checked');
    if (extras.length === 0) {
        errores.push('Debe seleccionar al menos un extra.');
    }

    if (errores.length > 0) {
        contenedor_errores_validar.style.display = "flex";
        let lista = document.createElement('ul');
        errores.forEach((elemento) => {
            let item = document.createElement('li');
            item.textContent = elemento;
            lista.appendChild(item);
        });
        contenedor_errores_validar.appendChild(lista);
        return false;
    } else {
        return true;
    }
}

// Subida de archivos al servidor (AJAX)
async function subir_archivos() {
    if (!validar_archivos(archivos)) {
        return;
    } else {
        contenedor_errores_validar.innerHTML = "";
        console.log("Todo correcto, subimos al servidor");

        const formData = new FormData();
        archivos.forEach((archivo) => {
            formData.append('imagenes[]', archivo); // Añadir cada imagen
        });

        let validacion_datos = validar_formulario();
        if (validacion_datos) {
            // Añadir datos del formulario al FormData
            formData.append('transaccion', transaccion);

            let radio_tipo_construccion = document.getElementById('subir_piso_obra_nueva');
            if (radio_tipo_construccion.checked) {
                formData.append('tipo_construccion', "obra_nueva");
            } else {
                formData.append('tipo_construccion', "segunda_mano");
            }

            formData.append('precio', precio);
            formData.append('superficie', superficie);
            formData.append('tipo_vivienda', es_piso ? es_piso : es_casa);

            if (!document.getElementById("piso_concreto_subir_piso").value !== " ") {
                let dato_opcional = document.getElementById("piso_concreto_subir_piso").value;
                formData.append('tipo_vivienda_opcional', dato_opcional);
            }

            formData.append('habitaciones', habitaciones);
            formData.append('baños', baños);
            for (let extras_seleccionados of extras) {
                formData.append('extras[]', extras_seleccionados.value);
            }

            console.log(formData);

            try {
                const respuesta = await fetch('/subir.php', {
                    method: 'POST',
                    body: formData,
                });

                if (respuesta.ok) {
                    const resultado = await respuesta.text();
                    console.log('Imágenes subidas con éxito:\n' + resultado);
                    archivos = [];
                    vista_previa.innerHTML = '';
                    boton_subir.disabled = true;
                    transaccion = "";
                    precio = "";
                    superficie = "";
                    es_piso = "";
                    es_casa = "";
                    habitaciones = "";
                    baños = "";
                    extras = "";
                } else {
                    console.log("Código error servidor");
                    contenedor_errores_validar.style.display = "flex";
                    contenedor_errores_validar.innerHTML += "<p>Error en la subida de archivos</p>";
                }
            } catch (error) {
                console.log("Error conexión con el servidor");
                contenedor_errores_validar.style.display = "flex";
                contenedor_errores_validar.innerHTML += "<p>No se ha podido conectar con el servidor</p>";
            }
        }
    }
}

// Validaciones previas al envío de imágenes
function validar_archivos(archivos) {
    contenedor_errores_validar.innerHTML = "";
    const tamaño_maximo = 10 * 1024 * 1024; // 10 MB
    let tamaño_total = 0;
    const formatos_permitidos = ['image/jpeg', 'image/png'];
    const max_archivos = 10;

    if (archivos.length == 0) {
        contenedor_errores_validar.style.display = "flex";
        contenedor_errores_validar.innerHTML = "<p>Es obligatorio la subida de una imagen</p>";
        boton_subir.classList.remove('todo_ok');
        return false;
    }

    if (archivos.length > max_archivos) {
        contenedor_errores_validar.style.display = "flex";
        contenedor_errores_validar.innerHTML = "<p>Solo se pueden subir más de  " + max_archivos + " archivos.</p>";
        boton_subir.classList.remove('todo_ok');
        return false;
    }

    for (const archivo of archivos) {
        tamaño_total += archivo.size;
    }

    if (tamaño_total > tamaño_maximo) {
        contenedor_errores_validar.style.display = "flex";
        contenedor_errores_validar.innerHTML = "<p>El tamaño total de los archivos supera el máximo permitido de: " + (tamaño_maximo / (1024 * 1024)) + " MB</p>";
        boton_subir.classList.remove('todo_ok');
        return false;
    }

    for (const archivo of archivos) {
        if (!formatos_permitidos.includes(archivo.type)) {
            contenedor_errores_validar.style.display = "flex";
            contenedor_errores_validar.innerHTML = "<p>Formato no permitido, solo se aceptan imágenes JPEG y PNG.</p>";
            boton_subir.classList.remove('todo_ok');
            return false;
        }
    }

    return true;
}

// Ejecutar asignación de eventos cuando el DOM cambie de estado
document.addEventListener('readystatechange', asignarEventos, false);





