<?php
session_start();
if(!isset($_SESSION["autenticado"]) || $_SESSION["autenticado"]!="yes"){ 
	header("Location:./jabones_scarlatti.php");
	exit();
}
else{
function conexion_bd($baseDatos,$user,$pass){
	try{
		$con=new PDO ("mysql:host=127.0.0.1;dbname=$baseDatos",$user,$pass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $con;
	}

	catch (PDOException $e){
		return 'Error: '.$e->getMessage();
	}

}
//------------------------------------------------------------------------------------------------------------------------------------	

if(isset($_GET["pagina"])){
	if($_GET["pagina"]==1){
		header("Location:aplicacion.php");     //ESTO ES CODIGO DEL SEGUNDO BLOQUE PARA PAGINAR 
	}

	else{
		$pagina_actual=$_GET["pagina"];
	}
}
else{
	$pagina_actual=1; 				
}
$paginas_totales=(int)2; 					
$empezar_desde=(int)($pagina_actual-1)*$paginas_totales;
//---------------------------------------------------------------------------------------------------------------------------------
$con=conexion_bd("jabones","jabones_usu","jabones");
	$stmt=$con->query('SELECT * FROM productos');
	if($stmt->execute()){
		$filas = $stmt->rowCount();	
		$total_paginas=ceil($filas/$paginas_totales);
		echo "Numero de registros de la consulta: $filas<br>";
		echo "Mostramos $paginas_totales registros por paginas<br>";  
		echo "Mostrando la pagina $pagina_actual de $total_paginas<br>";
	}						
//------------------------------------------------------------------------------------------------------------------------------
$stmt=$con->prepare('SELECT * FROM productos LIMIT :empezar,:pag_totales'); //CONSULTA CON LIMIT VARIABLE, QUE IRA CAMBIANDO SEGUN LA PAGINA EN LA QUE ESTEMOS (ID DE LA PAGINA)
$stmt->bindParam(':empezar',$empezar_desde,PDO::PARAM_INT);
$stmt->bindParam(':pag_totales',$paginas_totales,PDO::PARAM_INT);
if($stmt->execute()){
echo'
<style type="text/css">
	img{width: 25px; height: 25px;}
	body{text-align: center;}
	p{color: blue;}
	hr{color: red;}
	h2{color: blue;}
	table {
	width: 80%;
	margin: 0 auto; 
	background-color: #FFFFCC;
	border-collapse: collapse;
	border: 1px solid black;
	}
	th, td {
	text-align: center;
	padding: 8px;
	border: 1px solid black;
	}
	th {
	background-color: #E6E6FA;
	color: #4B0082;
	}
	#zona_funcionalidad {
  	width: 500px;
  	margin: 0 auto;
 	text-align: center;
 	background-color: Lavender;
 	border: 2px dotted red;
 	
	}
	#zona_funcionalidad a {
  	color: blue;
  	text-decoration: none;
  	font-weight: bold;
	}
	#zona_funcionalidad a:hover {
  	color: red;
	}
</style>
';
echo "<h2>Productos de Jabones Scarlatti</h2><br><br>";
$resultado="";
$resultado.="<table>";
while ($fila = $stmt->fetch(PDO::FETCH_NUM)){
	$resultado.= "<tr>";
	$resultado.= "<td>".$fila[0]."</td>";
	$resultado.= "<td>".$fila[1]."</td>";
	$resultado.= "<td>".$fila[2]."</td>";
	$resultado.= "<td>".$fila[3]."</td>";
	$resultado.= "<td>".$fila[4]."</td>";
	$imagen=$fila[5];
	$resultado.="<td><img src='./imagenes/$imagen'></td>";
	$resultado.= "</tr>";
}
$resultado.= "</table><br><br><br>";
echo $resultado;
}
//---------------------------PAGINACION EN SI-----------------------------
//--------------------------SEGUNDO BLOQUE PAGINACION------------------
if($pagina_actual==1){

	for($i=1; $i<=$total_paginas; $i++){
		echo "<a href='./aplicacion.php?pagina=$i'>$i</a>  ";
	}
	echo "<a href='./aplicacion.php?pagina=".($pagina_actual+1)."'>Siguiente</a>  ";
}

if($pagina_actual>1 && $pagina_actual<$total_paginas){
	echo "<a href='./aplicacion.php?pagina=".($pagina_actual-1)."'>Anterior</a>  ";
	for($i=1; $i<=$total_paginas; $i++){

		echo "<a href='./aplicacion.php?pagina=$i'>$i</a>  ";
	}
	echo "<a href='./aplicacion.php?pagina=".($pagina_actual+1)."'>Siguiente</a>  ";
}



if($pagina_actual==$total_paginas){
	echo "<a href='./aplicacion.php?pagina=".($pagina_actual-1)."'>Anterior</a>  ";
	for($i=1; $i<=$total_paginas; $i++){
		echo "<a href='./aplicacion.php?pagina=$i'>$i</a>  ";
	}
}

echo "<br><br><a href='./jabones_scarlatti.php'>Volver al Inicio</a><br><br><br>";

if(!isset($_SESSION["autenticado"]) || $_SESSION["autenticado"]!="yes"){ //isset
	
	echo"<div id='zona_funcionalidad'>
	<p style=\"color:red;\">Debe de estar logueado para acceder a las funcionalidades de compra</p><br><br>
	<a href='./registro.php'>Registrarse</a><br>
	</div>";
}
else{
	//MOSTRAR CESTA DE COMPRA Y ENLACES A LAS FUNCIONALIDADES DE LA PAG y CERRAR SESION
	echo "<div id='cesta'>";
	echo "<h1>Cesta</h1>";
	$email_actual=$_SESSION["email"];
	$con=conexion_bd("jabones","jabones_usu","jabones");
	$stmt=$con->prepare('SELECT cesta_id FROM cesta WHERE email=:email_actual');
	$stmt->bindParam(':email_actual',$email_actual);
	$stmt->execute();
	$num_filas = $stmt->rowCount();	
	if($num_filas>0){
		while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$cesta_id_actual=$fila["cesta_id"];
		}
		$stmt=$con->prepare('SELECT producto_id, cantidad FROM item_cesta WHERE cesta_id=:cesta_id_actual');
		$stmt->bindParam(':cesta_id_actual',$cesta_id_actual,PDO::PARAM_INT);
		$stmt->execute();
		$num_filas_cesta = $stmt->rowCount();	
		if($num_filas_cesta>0){
			echo "<table><tr><th>Id del producto</th><th>Cantidad</th></tr>";
			while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
				echo"<tr>";
				echo"<td>".$fila['producto_id']."</td><td>".$fila['cantidad']."</td>";
				echo"</tr>";
			}
			echo "</table>
			<a href='./añadir_cesta.php'>Añadir a cesta</a><br><br>
			<a href='./modificar_cesta.php'>Modificar producto de cesta</a><br><br>
			<a href='./pedido.php'>Finalizar compra</a><br><br>";
		}
		else{
			echo"<p style=\"color:Orchid;\">Cesta vacia</p>
			<a href='./añadir_cesta.php'>Añadir a cesta</a><br><br>
			<a href='./modificar_cesta.php'>Modificar producto de cesta</a><br><br>
			";
		}
	}
	else{
		echo"<p style=\"color:red;\">No se ha iniciado ninguna compra</p>
		<a href='./añadir_cesta.php'>Añadir a cesta</a><br><br>
		<a href='./modificar_cesta.php'>Modificar producto de cesta</a><br><br>";
	}
	
	echo"</div>";

}
}
?>
