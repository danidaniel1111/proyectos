function asignarEventos() { 
    // Verifica si la página está completamente cargada
    if (document.readyState == 'complete'){
        document.getElementById("porcentaje_entrada").addEventListener("input", visualizar_valor);
        document.getElementById("calcular_hipoteca").addEventListener("click", calcular_hipoteca);
    }
}
document.getElementById("resultado_simulador").style.display="none";

function visualizar_valor() {
    // Muestra el valor del porcentaje de entrada de forma dinámica
    document.getElementById("porcentaje_entrada_value").innerText = document.getElementById("porcentaje_entrada").value + "%";
}

function calcular_cuota_mensual(P, i, n) {
    // Fórmula para calcular la cuota mensual de una hipoteca
    return (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

function validar_formulario() {
    // Obtener los valores de los campos
    let monto = parseFloat(document.getElementById("monto").value);
    let plazo = parseInt(document.getElementById("plazo").value);
    let interes = parseFloat(document.getElementById("interes").value);
    let tipo_interes = document.getElementById("tipo_interes").value;
    let cuota_inicial = parseFloat(document.getElementById("cuota_inicial").value);
    let porcentaje_entrada = parseFloat(document.getElementById("porcentaje_entrada").value);

    // Validar Monto del préstamo
    if (isNaN(monto) || monto <= 0) {
        alert("El monto del préstamo debe ser un número positivo mayor a 0.");
        return false;
    }

    // Validar Plazo de la hipoteca
    if (isNaN(plazo) || plazo < 1 || plazo > 50) {
        alert("El plazo de la hipoteca debe ser un número positivo entre 1 y 50 años.");
        return false;
    }

    // Validar Tasa de interés
    if (isNaN(interes) || interes <= 0 || interes > 100) {
        alert("La tasa de interés debe ser un número mayor que 0 y menor o igual a 100.");
        return false;
    }

    // Validar Tipo de interés (solo debe ser uno de los valores posibles)
    if (tipo_interes !== "fijo" && tipo_interes !== "variable" && tipo_interes !== "mixto") {
        alert("El tipo de interés debe ser 'fijo', 'variable' o 'mixto'.");
        return false;
    }

    // Validar Cuota inicial
    if (isNaN(cuota_inicial) || cuota_inicial < 0) {
        alert("La cuota inicial debe ser un número positivo o 0.");
        return false;
    }

    // Validar Porcentaje de entrada
    if (isNaN(porcentaje_entrada) || porcentaje_entrada < 0 || porcentaje_entrada > 100) {
        alert("El porcentaje de entrada debe ser un número entre 0 y 100.");
        return false;
    }

    // Si todo es válido, se puede proceder
    return true;
}

function calcular_hipoteca() {
    // Obtener los valores de los inputs
	document.getElementById("resultado_simulador").innerHTML="";
	document.getElementById("resultado_simulador").style.display="block";
	let validacion=validar_formulario();
	if(validacion){
		const monto = parseFloat(document.getElementById("monto").value);
		const plazo = parseInt(document.getElementById("plazo").value);
		const interes_anual = (parseFloat(document.getElementById("interes").value)) / 100; // Dividir por 100 para convertirlo en porcentaje
		const tipo_interes = document.getElementById("tipo_interes").value;
		const cuota_inicial = parseFloat(document.getElementById("cuota_inicial").value) || 0;

		// Asegurarse de que los valores sean números válidos
		if (isNaN(monto) || isNaN(plazo) || isNaN(interes_anual)) {
			alert("Por favor, ingresa valores válidos para todos los campos.");
			return;
		}

		// Calcular el monto financiado (descontando la cuota inicial)
		const P = monto - cuota_inicial; 
		console.log("Interes anual: "+interes_anual);
		const i = interes_anual / 12; // Interés mensual
		const n = plazo * 12; // Número total de pagos (en meses)

		// Calcular la cuota mensual inicial
		let cuota_mensual = calcular_cuota_mensual(P, i, n);
		let resultado = `La cuota mensual inicial será alrededor de: €${cuota_mensual.toFixed(2)}\n`;

		// Lógica adicional según tipo de interés
		if (tipo_interes === 'variable') {
			// Si el interés es variable, se ajusta después de 5 años (60 meses)
			const años_cambio = 5;
			const n_restante = n - (años_cambio * 12);
			const nuevo_interes_anual = interes_anual + 0.01; // Aumento del 1% en el interés
			const nuevo_interes_mensual = nuevo_interes_anual / 12;
			// Calcular el capital restante después de 5 años de pagos
			const capital_restante = P * Math.pow(1 + i, años_cambio * 12) - cuota_mensual * ((Math.pow(1 + i, años_cambio * 12) - 1) / i);
			// Calcular la nueva cuota mensual después del cambio de interés
			const nueva_cuota = calcular_cuota_mensual(capital_restante, nuevo_interes_mensual, n_restante);
			resultado += `Después de ${años_cambio} años, la nueva cuota mensual será alrededor de: €${nueva_cuota.toFixed(2)}\n`;
		} else if (tipo_interes === 'mixto') {
			// Si el interés es mixto, se mantiene fijo por los primeros 10 años
			const periodo_fijo = 10;
			const n_restante = n - (periodo_fijo * 12);
			const nuevo_interes_anual = interes_anual + 0.02; // Aumento del 2% en el interés
			const nuevo_interes_mensual = nuevo_interes_anual / 12;
			// Calcular el capital restante después de 10 años de pagos
			const capital_restante = P * Math.pow(1 + i, periodo_fijo * 12) - cuota_mensual * ((Math.pow(1 + i, periodo_fijo * 12) - 1) / i);
			// Calcular la nueva cuota mensual después del cambio de interés
			const nueva_cuota = calcular_cuota_mensual(capital_restante, nuevo_interes_mensual, n_restante);
			resultado += `<p>Después de ${periodo_fijo} años, la nueva cuota mensual será alrededor de: ${nueva_cuota.toFixed(2)}€</p>`;
		}

		// Mostrar el resultado en la página

		document.getElementById("resultado_simulador").innerHTML = `<p>${resultado}</p>`;
	}
	else{
		document.getElementById("resultado_simulador").innerHTML = "<p>Error con alguno de los datos</p>";		
	}
}

// Asignar los eventos después de que la página se haya cargado completamente
document.addEventListener('readystatechange', asignarEventos, false);




