<?php
$cesta_id_actual="";
include 'tabla.php';
session_start();
if(!isset($_SESSION["autenticado"]) || $_SESSION["autenticado"]!="yes"){ 
	header("Location:./jabones_scarlatti.php");
	exit();
}
else{
	
	$baseDatos="jabones";
	$user="jabones_usu";
	$pass="jabones";
	include './conexionBD.php';
	$email_actual=$_SESSION["email"];
	$stmt=$con->prepare('SELECT cesta_id FROM cesta WHERE email=:email_actual');
	$stmt->bindParam(':email_actual',$email_actual);
	$stmt->execute();
	$num_filas = $stmt->rowCount();	
	if($num_filas>0){
	while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$cesta_id_actual=$fila["cesta_id"];
		}
		$_SESSION["cesta_id"]=$cesta_id_actual;
		$stmt=$con->prepare('SELECT item_cesta_id, producto_id, cantidad FROM item_cesta WHERE cesta_id=:cesta_id_actual');
		$stmt->bindParam(':cesta_id_actual',$cesta_id_actual,PDO::PARAM_INT);
		$stmt->execute();
		$num_filas_cesta = $stmt->rowCount();	
		if($num_filas_cesta>0){
			echo "<h3>Tu Cesta</h3>";
			echo"<form action='./modificar_cesta.php' method='post' target='_self'>";
			echo "<table><tr><th>Id del producto</th><th>Cantidad</th><th></th></tr>";
			while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
				echo"<tr>";
				echo"<td>".$fila['producto_id']."</td><td>".$fila['cantidad']."</td>";
				echo "<td><input type='checkbox' name='check_box[]' value='".$fila['item_cesta_id']."'></td>";
				echo"</tr>";
			}
			echo "</table><br><br><input type='submit' name='modificar' value='Modificar'><br><br>
			<input type='submit' name='eliminar' value='Eliminar'><br><br>
			<input type='submit' name='listar' value='Listar'></form><br><br>";
		}
		else{
			echo"<p style=\"color:Orchid;\">Cesta vacia</p>";
		}
	}
	else{
		echo "<p>No existe cesta aún</p>";
	}
	echo "<br><br><a href='./jabones_scarlatti.php'>Volver al Inicio</a><br><br><br>";
	echo "<br><br><a href='./aplicacion.php'>Volver a aplicacion</a><br><br><br>";

if(isset($_POST['eliminar'])){ //--------------------------------------------------------------------------------------------------------------------------------------------------
		$array_eliminar=array();
		$array_eliminar=$_POST['check_box'];
		foreach ($array_eliminar as $checkbox) {
			$stmt = $con->prepare('DELETE FROM item_cesta WHERE item_cesta_id =:id_borrar AND cesta_id=:cesta');
			$stmt->bindParam(':id_borrar',$checkbox,PDO::PARAM_INT);
			$stmt->bindParam(':cesta',$cesta_id_actual,PDO::PARAM_INT);
			if($stmt->execute()){
				header("Refresh: 0; URL=./modificar_cesta.php");
			}
			else{
				header("Refresh: 3; URL=./modificar_cesta.php");
				echo "<p>No existe ese producto en su cesta</p>";
			}
		}
}
if(isset($_POST['modificar'])){ //--------------------------------------------------------------------------------------------------------------------------------------------------
	//mostramos un miniformulario con un input que sea valor a cambiar, con un select , boton submit name='procesar_update'
	//hacer lo del switch y todo el rollo, y si esta ok, lo actualizamos 
	$array_modificar=array();
	if(isset($_POST['check_box'])){
		$array_modificar=$_POST['check_box'];
		$_SESSION["id_modificar"]=$array_modificar;
		echo "<form action='./actualizar_cesta.php' method='post' target='_self'>
			Cantidad: <select name='cantidad_producto'>
  			<option value='1'>1</option>
  			<option value='2'>2</option>
			</select><br><br>	
	     	<input type='submit' name='procesar_update' value='Actualizar pedido'></form>";
	}
	else{
		echo "<h3 style=\"color:red;\">Debe selecionar antes un producto de su cesta</h3><br><br>";
	}
}
if(isset($_POST['listar'])){ //--------------------------------------------------------------------------------------------------------------------------------------------------
	$email_actual=$_SESSION["email"];
	$stmt=$con->prepare('SELECT fecha_creacion FROM cesta WHERE email=:email_actual');
	$stmt->bindParam(':email_actual',$email_actual);
	$stmt->execute();
	$num_filas_cesta = $stmt->rowCount();	
	if($num_filas_cesta>0){
		while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)){
			$fecha_bd=$fila['fecha_creacion'];
		}
		$fecha=new DateTime($fecha_bd);
		$fecha->modify('+14 days');
		$fecha_final=$fecha->format('Y-m-d');
		header("Refresh: 5; URL=./modificar_cesta.php");
		echo "<p>Si pide hoy los productos, se entregaran aproximadamente el: ".$fecha_final." (2 Semanas)</p>";
	}
	else{
		echo "<p>No tienes cesta aun</p>";
	}
}



}
?>
