<?php
session_start();
if(!isset($_SESSION["autenticado"])){
	if(!isset($_POST['enviar'])){
			echo "
			<style>
			h2,a{
				text-align: center;
			}
			form {
			width: 500px;
			margin: auto;
			text-align: center;
			padding: 50px;
			background-color: lightgray;
			border-radius: 10px;
		      }
		      
		      input[type='text'],
		      input[type='password'],
		      input[type='submit'] {
			width: 100%;
			padding: 10px;
			margin-top: 10px;
			font-size: 18px;
			border-radius: 5px;
			border: none;
		      }
		      
		      input[type='submit'] {
			background-color: green;
			color: white;
			cursor: pointer;
		      }
			</style>
			<h2>Inicio de sesion</h2>
			<form action='./login.php' method='post' target='_self'>
			Email:<input type='text' name='email'>
			<br><br>
			Contraseña:<input type='text' name='contrasenia'>
			<br><br>
			<input type='submit' value='Enviar' name='enviar'>
			</form><br><br>
			<a href='./jabones_scarlatti.php'>Volver al inicio</a><br><br>
			";
		}
	else{
	$baseDatos="jabones";
	$user="jabones_usu";
	$pass="jabones";
	$formulario="
	<style>
		h2{
			text-align: center;
		}
		form {
		width: 500px;
		margin: auto;
		text-align: center;
		padding: 50px;
		background-color: lightgray;
		border-radius: 10px;
	      }
	      
	      input[type='text'],
	      input[type='password'],
	      input[type='submit'] {
		width: 100%;
		padding: 10px;
		margin-top: 10px;
		font-size: 18px;
		border-radius: 5px;
		border: none;
	      }
	      
	      input[type='submit'] {
		background-color: green;
		color: white;
		cursor: pointer;
	      }
	</style>
	<h2>Inicio de sesion</h2>
	<form action='./login.php' method='post' target='_self'>
	";
	$patron_contra="/^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]{8,12}$/"; //PATRON PARA CONTRASEÑAS
	$validar_email=false;
	$validar_pass=false;
	include './conexionBD.php';
		if(!isset($_SESSION["autenticado"])){					//1-SI NO EXISTE LA VARIABLE AUTENTICADO,  SEGUIMOS PARA VER SI TIENE LOGIN
				//CONTRASEÑA
			if(isset($_POST['contrasenia'])){ //SI EXISTE UN REGISTRO...
		
			 if(!empty($_POST['contrasenia'])){ //SI NO ESTA VACIO...
			 
			 	$pass=$_POST['contrasenia']; //RECOGEMOS DATO PARA VALIDAR CONTENIDO
			 	
			 	if(strlen($pass)>3){ //SI LA LONGITUD DEL STRING ES MAYOR A 3
			 	
			 		if(preg_match($patron_contra,$pass)){ //SI CONTIENE LETRAS Y NUMEROS...
				 	
				 		$validar_pass=false;
				 	}
				 	else{ //CONTIENE ALGO QUE NO QUEREMOS
				 	
				 		$validar_pass=true;
				 		
				 	}
				 } // ES MENOR DE 3 DE LONGITUD
				 
				 else{
				 	
				 	$validar_pass=true;
				 
				 }
			 }
			 else{ //ESTA VACIO
			 
			 	$validar_pass=true;
			 }
		
			}
			else{ //NO EXISTE UN REGISTRO
				$validar_pass=true;
			}
			//FINAL VALIDAR CONTRASEÑA
	//-------------------------------------------------------------------------------------------------------------------------------------
			if(isset($_POST['email'])){ //SI EXISTE UN REGISTRO...
				if(!empty($_POST['email'])){
					$email=$_POST['email']; //RECOGEMOS DATO PARA VALIDAR CONTENIDO	
					if(filter_var($email, FILTER_VALIDATE_EMAIL)){
						$validar_email=false;	
					}
					else{
						$validar_email=true;
					}
				}
				else{
					$validar_email=true;
				}
			}
			
			else{
				$validar_email=true;
			}

				if($validar_email){
					$formulario.="
						Email:<input type='text' name='email'><br><br>
						<p style=\"color:red;\">Error en el apartado email</p><br><br>";
				}
				else{
					$formulario.="Email:<input type='text' name='email' value='$email'><br><br>";
				}
				
				if($validar_pass){
					$formulario.="
						Contraseña:<input type='text' name='contrasenia'>
						<br><br>
						<p style=\"color:red;\">Error en el apartado contraseña</p><br><br>
						<input type='submit' value='Enviar' name='enviar'>
						</form>";
				}
				else{
					$formulario.="Contraseña:<input type='text' name='contrasenia' value='$pass'><br><br>
						<input type='submit' value='Enviar' name='enviar'>
						</form>";
				}
				if($validar_email==true || $validar_pass==true){
					echo $formulario;
				}
				else{
					//base de datos, y mirar si esta ok ------------------------------------------------------------------------------------------------
				$stmt=$con->prepare('SELECT email,contrasenia FROM clientes WHERE email=:email AND contrasenia=:contra');  //SE ACCEDE A LA BD, PARA VER SI EL USU Y CONTR EXISTEN
				$stmt->bindParam(':email',$email);
				$stmt->bindParam(':contra',$pass);
				$stmt->execute();
				$num_filas = $stmt->rowCount();				
				if($num_filas==1){					
					$_SESSION["autenticado"]="yes";
					$_SESSION["email"]=$email;
					header("Location:./aplicacion.php");		
				}

				else{							
					header("Refresh: 3; url=./login.php");		
					echo"El email y la contraseña no existen en BD";	
				}
				//-----------------------------------------------------------------------------------------------	
				}
				
			}
		else{									//1-EXISTE , ASI QUE YA ESTA LOGUEADO, REDIRIGIMOS A LA PAGINA INICIO
			header("Location:./aplicacion.php");
		}
	}
}
else{
	header("Location:./aplicacion.php");
	exit();
}
?>
