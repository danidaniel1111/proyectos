<?php
session_start();
if($_SESSION["autenticado"]!="yes"){
	header("Location:./jabones_scarlatti.php");
	exit();
}

else{
	require('./PHPMailer-master/src/PHPMailer.php');
	require('./PHPMailer-master/src/SMTP.php');
function envia_email($usuario, $contraseña,$email,$remitente,$titulo,$contenido,$attach="ninguna"){ //VALOR POR DEFECTO , POR SI NO QUEREMOS ENVIAR NINGUNA IMAGEN EN EL CORREO
	$email = new PHPMailer();
	$email ->isSMTP();
	$email->Host ='localhost';
	$email ->Mailer = "SMTP";
	$email -> SMTPAuth = true;			
	$email -> isHTML(true);
	$email -> Port = 25;
	$email -> Username ="$usuario";		//IMPORTANTE "" Y ''
	$email -> Password ="$contraseña";
	$email -> setFrom('$email');
	$email ->CharSet = 'UTF-8';
	$email->AddAddress($remitente);
	$email->Subject =$titulo;
	$email -> SMTPAutoTLS = false;
	if($attach!=="ninguna"){
		$email->addAttachment($attach);		
	}
	$email->Body =$contenido;
	if($email->Send()){
		
		return "<br><br>Email enviado correctamente a $remitente<br><br>";
	}
	else{
		
		return $email->ErrorInfo;
	}
}


	$baseDatos="jabones";
	$user="jabones_usu";
	$pass="jabones";
	include './conexionBD.php';
	include 'tabla.php';
	$email_actual=$_SESSION["email"];
	$array_productos=array();
	$array_cantidad=array();
	$array_precio=array();
	$pedido_id="";
	$fecha=new DateTime('now');
	$fecha_final=$fecha->format('Y-m-d');
	$fecha->modify('+14 days');
	$fecha_entrega=$fecha->format('Y-m-d');
	$booleano=0;
	//crear registro en pedidos 
	
	$stmt = $con->prepare('SELECT * FROM pedidos WHERE email=:email');
	$stmt->bindValue(':email',$email_actual);
	$stmt->execute();
	$num_filas = $stmt->rowCount();
	if($num_filas==0){
		echo "No existe pedido relacionado a su email<br><br>";
		$stmt = $con->prepare('INSERT INTO `pedidos`(`email`, `fecha_pedido`, `fecha_entrega`, `entregado`) VALUES (:email, :fecha_pedido, :fecha_entrega, :entregado)');
		$stmt->bindParam(':email',$email_actual);
		$stmt->bindParam(':fecha_pedido',$fecha_final);
		$stmt->bindParam(':fecha_entrega',$fecha_entrega);
		$stmt->bindParam(':entregado',$booleano,PDO::PARAM_INT);
		if($stmt->execute()){
			echo "Se ha creado registro en pedido";
		}
		else{
			echo "No se ha podido crear registro";
		}
	}
	//PROCESAMOS PEDIDO volcar pedido id(pedidos), productoid, cantidad y precio(tabla productos) a itempedido
	$stmt = $con->prepare('SELECT pedido_id FROM pedidos WHERE email=:email');			//SACAMOS PEDIDO ID DEL USUARIO ACTUAL
	$stmt->bindValue(':email',$email_actual);
	$stmt->execute();
	while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
		$pedido_id=$fila['pedido_id'];
	}

	$stmt=$con->prepare('SELECT cesta_id FROM cesta WHERE email=:email');				//SACAMOS LA CESTA ID DEL USUARIO ACTUAL
	$stmt->bindParam(':email',$email_actual);
	if($stmt->execute()){
		while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$cesta_id_actual=$fila['cesta_id'];
			}
	}
	$contador_item_cesta=0;
	$stmt = $con->prepare('SELECT producto_id, cantidad FROM item_cesta WHERE cesta_id=:cesta');			//SACAMOS PRODUCTOS DEL CARRITO PARA SABER SU PRECIO
	$stmt->bindValue(':cesta',$cesta_id_actual);
	$stmt->execute();
	while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
		$array_productos[$contador_item_cesta]=(int)$fila['producto_id'];
		$array_cantidad[$contador_item_cesta]=(int)$fila['cantidad'];
		$contador_item_cesta++;
	}
	$contador_item_cesta=0;
	foreach($array_productos as $productos){	//2 tengo
		$stmt = $con->prepare('SELECT precio FROM productos WHERE producto_id=:id');			//SACAMOS SU PRECIO
		$stmt->bindValue(':id',$productos,PDO::PARAM_INT);
		$stmt->execute();
		while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$array_precio[$contador_item_cesta]=floatval($fila['precio']);
			$contador_item_cesta++;
		}
	}
	
	//CREAMOS EL REGISTRO EN ITEMPEDIDO
	$contador_registro=0;
	for($cont=0;$cont<count($array_productos);$cont++){		//$pedido_id, $productos,$array_cantidad,$array_precio
		$productos_2=$array_productos[$cont];
		$cantidad=$array_cantidad[$cont];
		$precio=$array_precio[$cont];
		$stmt = $con->prepare('INSERT INTO `item_pedido`(`pedido_id`, `producto_id`, `unidades`, `precio`) VALUES (:pedido_id, :producto, :cantidad, :precio)');
		$stmt->bindValue(':pedido_id',$pedido_id,PDO::PARAM_INT);
		$stmt->bindValue(':producto',$productos_2,PDO::PARAM_INT);
		$stmt->bindValue(':cantidad',$cantidad,PDO::PARAM_INT);
		$stmt->bindValue(':precio',$precio);
		if($stmt->execute()){
			echo "Producto registrado<br>";
		}
		else{
			echo "ERROR Producto registrado<br>";
		}
	}
	//RELLENAR TOTAL PEDIDO 
	$stmt = $con->prepare('UPDATE pedidos SET total_pedido=:calculo WHERE pedido_id=:id');
	$acumulador=0;
	$contador_registro=0;
	foreach($array_cantidad as $cantidad){
		$precio_producto=$array_precio[$contador_registro];
		$acumulador=$acumulador+($cantidad * $precio_producto);
		$contador_registro++;	
	}
	$stmt->bindValue(':id',$pedido_id,PDO::PARAM_INT);
	$stmt->bindValue(':calculo',$acumulador);
	if($stmt->execute()){
		echo "actualizado";
	}
	else{
		echo "no actualizado";
	}
	//CREAMOS EL PDF Y LO MANDAMOS POR CORREO 
	require_once('./TCPDF-main/tcpdf.php');
	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
	$pdf->SetCreator(PDF_CREATOR);
	$pdf->SetAuthor('Daniel Perez');
	$pdf->SetTitle('Albaran');

	// Deshabilitar la cabecera y pie de página predeterminados
	$pdf->setPrintHeader(false);
	$pdf->setPrintFooter(false);

	// Establecer la margen de la página
	$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

	// Agregar una nueva página al documento
	$pdf->AddPage();

	// Escribir HTML en la página
	$html ="<h3>Gracias por su compra en Jabones scarlatti</h3>";
	$html.="<p> Coste total de compra: $acumulador €<p>
	<p> EL pedido se le entregará en fecha: $fecha_entrega</p>
	<h1>ARTICULOS COMPRADOS</h1>";
	$contador_cantidad=0;
	$html.="<table><tr><th>Nombre</th><th>Descripcion</th><th>Cantidad</th></tr>";
	foreach($array_productos as $productos){
			$stmt = $con->prepare('SELECT nombre, descripcion FROM productos WHERE producto_id=:id');	//ES PREPARE , SI AGREGAMOS DATOS A LA CONSULTA
			$stmt->bindValue(':id',$productos,PDO::PARAM_INT);
			$stmt->execute();
			while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$html.="<tr><td>".$fila['nombre']."</td><td>".$fila['descripcion']."</td><td>".$array_cantidad[$contador_cantidad]."</td></tr>"; 
			$contador_cantidad++;
		}
			
	}
	$html.="</table>";
	$pdf->writeHTML($html, true, false, true, false, '');
	// Salida del documento PDF
	$pdf->Output(__DIR__ ."/pdf/albaran.pdf", 'F');
	echo $html;
	
	//ENVIAR EMAIL
	echo envia_email("daniel", "daniel","daniel@domenico.es",$email_actual,"Jabones Scarlatti",$html,"./pdf/albaran.pdf");
	echo envia_email("daniel", "daniel","daniel@domenico.es","depa_quimica@domenico.es","Albaran",$html,"./pdf/albaran.pdf");
	//AL ENVIAR EMAIL, BORRAR PEDIDOS E ITEM_PEDIDOS $pedido_id
	
	$stmt = $con->prepare('DELETE FROM `item_pedido` WHERE pedido_id=:pedido');
	$stmt->bindParam(':pedido',$pedido_id,PDO::PARAM_INT);
	$stmt->execute();
	
	$stmt = $con->prepare('DELETE FROM `pedidos` WHERE pedido_id=:pedido');
	$stmt->bindParam(':pedido',$pedido_id,PDO::PARAM_INT);
	$stmt->execute();
	
}
?>
