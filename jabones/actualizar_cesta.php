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
	if(isset($_POST['procesar_update'])){
		if(!isset($_SESSION["id_modificar"])){
			header("Refresh: 0; URL=./modificar_cesta.php");
		}
		else{
			
			$cantidad=(int)$_POST['cantidad_producto'];
			$id_modificar=$_SESSION["id_modificar"];
			$cesta_id_actual=$_SESSION["cesta_id"];
			switch ($cantidad) {
			    case 1:
			    case 2:
			    	foreach ($id_modificar as $checkbox) {
					$stmt = $con->prepare('UPDATE item_cesta SET cantidad=:cant WHERE item_cesta_id=:id AND cesta_id=:cesta');
					$stmt->bindParam(':cant',$cantidad,PDO::PARAM_INT);
					$stmt->bindParam(':id',$checkbox,PDO::PARAM_INT);
					$stmt->bindParam(':cesta',$cesta_id_actual,PDO::PARAM_INT);
					$stmt->execute();
				}
				header("Refresh: 0; URL=./modificar_cesta.php");
				break;
   			    default:
      			        header("Refresh: 0; URL=./modificar_cesta.php");
      			       }
      		}
	}
	else{
		header("Refresh: 0; URL=./modificar_cesta.php");
	}


}
?>
