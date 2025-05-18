<?php
date_default_timezone_set('Europe/Madrid');
session_start();
$cesta_id_actual;
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
	function insertar($con,$cesta_id_actual,$producto_insertar,$cantidad){
		$stmt = $con->prepare('INSERT INTO `item_cesta`(`cesta_id`, `producto_id`, `cantidad`) VALUES (:cesta_id,:producto_id,:cantidad)');
		$stmt->bindParam(':cesta_id',$cesta_id_actual,PDO::PARAM_INT);	//CREAMOS EL REGISTRO DEL PRODUCTO EN ITEM CESTA
		$stmt->bindParam(':producto_id',$producto_insertar,PDO::PARAM_INT);
		$stmt->bindParam(':cantidad',$cantidad,PDO::PARAM_INT);
		if($stmt->execute()){
			return true;
		}
		else{
			return false;
		}
	}

	if(isset($_GET["pagina"])){
		if($_GET["pagina"]==1){
			header("Location:añadir_cesta.php");     //ESTO ES CODIGO DEL SEGUNDO BLOQUE PARA PAGINAR 
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
			echo "<a href='./añadir_cesta.php?pagina=$i'>$i</a>  ";
		}
		echo "<a href='./añadir_cesta.php?pagina=".($pagina_actual+1)."'>Siguiente</a>  ";
	}

	if($pagina_actual>1 && $pagina_actual<$total_paginas){
		echo "<a href='./añadir_cesta.php?pagina=".($pagina_actual-1)."'>Anterior</a>  ";
		for($i=1; $i<=$total_paginas; $i++){

			echo "<a href='./añadir_cesta.php?pagina=$i'>$i</a>  ";
		}
		echo "<a href='./añadir_cesta.php?pagina=".($pagina_actual+1)."'>Siguiente</a>  ";
	}



	if($pagina_actual==$total_paginas){
		echo "<a href='./añadir_cesta.php?pagina=".($pagina_actual-1)."'>Anterior</a>  ";
		for($i=1; $i<=$total_paginas; $i++){
			echo "<a href='./añadir_cesta.php?pagina=$i'>$i</a>  ";
		}
	}
	echo '<br><br><br><form action="./añadir_cesta.php" method="post" target="_self">';
	echo "Producto: <input type='text' name='nombre_producto'><br><br>			
	      Cantidad: <select name='cantidad_producto'>
  		<option value='1'>1</option>
  		<option value='2'>2</option>
		</select>	
	     <input type='submit' name='enviar' value='Añadir al carro'><br><br></form>";
	//SACAR EL ID SEGUN EL NOMBRE
if(isset($_POST['enviar'])) {//-----------------------------------------------------------------------------------
		$tiene_cesta=false;
		$email_actual=$_SESSION["email"];
		$con=conexion_bd("jabones","jabones_usu","jabones");
		$stmt=$con->prepare('SELECT * FROM cesta WHERE email=:email');
		$stmt->bindParam(':email',$email_actual);
		$stmt->execute();
		$num_filas = $stmt->rowCount();	
		if($num_filas==0){
			$fecha=new DateTime();
			$fecha_creacion=$fecha->format('Y-m-d');
			echo "No existe cesta, creando cesta...";
			$stmt = $con->prepare('INSERT INTO `cesta`(`email`, `fecha_creacion`) VALUES (:email, :fecha)');
			$stmt->bindParam(':email',$email_actual);
			$stmt->bindParam(':fecha',$fecha_creacion);
			if($stmt->execute()){
				echo "Se ha creado la cesta correctamente";
				$tiene_cesta=true;
				$stmt=$con->prepare('SELECT cesta_id FROM cesta WHERE email=:email');
				$stmt->bindParam(':email',$email_actual);
				if($stmt->execute()){
					while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
						$cesta_id_actual=$fila['cesta_id'];
					}
				}
				
			}
			else{
				echo "Error al crear la cesta";
			}
		}
		else{
			echo "Ya existe una cesta vinculada al usuario...";
			$tiene_cesta=true;
			$stmt=$con->prepare('SELECT cesta_id FROM cesta WHERE email=:email');
			$stmt->bindParam(':email',$email_actual);
			if($stmt->execute()){
				while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
					$cesta_id_actual=$fila['cesta_id'];
				}
			}
		}
		if($tiene_cesta){						//SI EL USUARIO TIENE UNA CESTA YA( YA SEA ANTES, O CREADA AHORA....)
			$nombre_producto=$_POST['nombre_producto'];
			$cantidad=(int)$_POST['cantidad_producto'];
			//try {
				$con=conexion_bd("jabones","jabones_usu","jabones");
				$stmt = $con->prepare('SELECT producto_id FROM productos WHERE nombre=:nombre');
				$stmt->bindParam(':nombre',$nombre_producto);
				$stmt->execute();
				$num_filas = $stmt->rowCount();
				if($num_filas>0){
					while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
						$producto_insertar=$fila['producto_id'];				//SACAMOS LA ID A PARTIR DEL NOMBRE DEL PRODUCTO
					}
					$stmt = $con->prepare('SELECT cantidad FROM item_cesta WHERE producto_id=:producto AND cesta_id=:cesta');	//MIRAMOS SI EL PRODUCTO EXISTE YA EN LA CESTA
					$stmt->bindParam(':producto',$producto_insertar,PDO::PARAM_INT);
					$stmt->bindParam(':cesta',$cesta_id_actual,PDO::PARAM_INT);
					$stmt->execute();
					$num_filas = $stmt->rowCount();
					if(!$num_filas>0){								//SI NO EXISTE, LO METEMOS ENTERO
						if(insertar($con,$cesta_id_actual,$producto_insertar,$cantidad)){
							header("Refresh: 3; URL=./aplicacion.php");
							echo "Producto insertado correctamente en la cesta";
						}
						else{
							echo "Error insertando en cesta";
						}
					}
					else{
						//SACAMOS  LA CANTIDAD QUE TIENE, SI LA CANTIDAD EN BD + $CANTIDAD <=2, lo metemos, si no , NO se puede 
						while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
							$cantidad_bd=(int)$fila['cantidad'];
						}
						if(($cantidad_bd+$cantidad)<=2){
											//UPDATE DEL PRODUCTO CON LA CANTIDAD QUE TIENE MAS LA QUE AGREGO
							$stmt = $con->prepare('UPDATE item_cesta SET cantidad=cantidad+:cant WHERE producto_id=:id AND cesta_id=:cesta');
							$stmt->bindParam(':cant',$cantidad,PDO::PARAM_INT);
							$stmt->bindParam(':id',$producto_insertar,PDO::PARAM_INT);
							$stmt->bindParam(':cesta',$cesta_id_actual,PDO::PARAM_INT);
							if($stmt->execute()){
								header("Refresh: 3; URL=./aplicacion.php");
								echo "Producto insertado correctamente en la cesta";
							}
							else{
								echo "Error insertando en cesta";
							}
						}
						else{
							echo "Se ha excedido el limite en la cantidad de ese producto";
						}
					}
				}
				else{
					echo "Error en el nombre del producto, reviselo por favor";
				}
			//}
			/*
			catch (PDOException $e) {
				echo "Error en el nombre del producto, reviselo por favor";
			}
			*/
		}


	}

	echo "<br><br><a href='./jabones_scarlatti.php'>Volver al Inicio</a><br><br><br>";
	echo "<br><br><a href='./aplicacion.php'>Volver a aplicacion</a><br><br><br>";

}
?>
