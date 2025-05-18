<?php
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
	<h2>Registrarse</h2>
	<form action='./registro.php' method='post' target='_self'>
	Email: <input type='text' name='email' placeholder='Email'><br><br>
 	Nombre: <input type='text' name='texto' placeholder='Nombre'><br><br>
  	Contraseña: <input type='password' name='contrasenia' placeholder='Contraseña'><br><br>
  	Direccion: <input type='text' name='direccion' placeholder='Dirección'><br><br>
  	Codigo Postal<input type='text' name='cp' placeholder='Código Postal'><br><br>
  	Telefono: <input type='text' name='telefono' placeholder='Telefono'><br><br><br><br>
  	<input type='submit' name='enviar' value='Enviar'>
	</form><br><br><br><br><a href='./jabones_scarlatti.php'>Volver al inicio</a><br><br>
	";
}
else{
	//validar, insertar en bd y redirigir a login 
	$baseDatos="jabones";
	$user="jabones_usu";
	$pass="jabones";
	include './conexionBD.php';
	$validar_email=false;
	$validar_texto=false;
	$validar_pass=false;
	$validar_direccion=false;
	$validar_cp=false;
	$validar_tele=false;
	$patron_texto = "/^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙ\s]+$/"; //PATRON PARA VALIDAR LETRAS Y ESPACIOS
	$patron_contra="/^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]{8,12}$/"; //PATRON PARA CONTRASEÑAS
	$formulario="<style>
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
	<h2>Registrarse</h2>
	<form action='./registro.php' method='post' target='_self'>
	";

	//EMAIL
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
//-------------------------------------------------------------------------------------------------
	//NOMBRE
	if(isset($_POST['texto'])){ //SI EXISTE UN REGISTRO...
		if(!empty($_POST['texto']) ){ //SI NO ESTA VACIO...
		 	$texto=strtolower($_POST['texto']); //RECOGEMOS DATO PARA VALIDAR CONTENIDO
		 	if(strlen($texto)>=3){ //SI LA LONGITUD DEL STRING ES MAYOR A 3
		 		if(preg_match($patron_texto,$texto)){ //SI CONTIENE LETRAS Y ESPACIOS
			 		$validar_texto=false;
			 	}
			 	else{ //CONTIENE ALGO QUE NO QUEREMOS
			 		$validar_texto=true;
			 	}
			 } // ES MENOR DE 3 DE LONGITUD
			 
			 else{
			 	$validar_texto=true;
			 }
		 }
		 else{ //ESTA VACIO
		 	$validar_texto=true;
		 }
	}
	else{ //NO EXISTE UN REGISTRO
		$validar_texto=true;
	}
	
//------------------------------------------------------------------------------------------------------	
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
	
//-----------------------------------------------------------------------------------------------------	
	//DIRECCION
	if(isset($_POST['direccion'])){ 
		if(!empty($_POST['direccion'])){
			$direccion=$_POST['direccion'];
			$validar_direccion=false;
		}
		else{
			$validar_direccion=true;
		}
	}
	else{
		$validar_direccion=true;
	}
//-----------------------------------------------------------------------------------------------------
	//CODIGO POSTAL
	if(isset($_POST['cp'])){ 
		if(!empty($_POST['cp'])){
			$cp=$_POST['cp'];
			if(strlen($cp)==5){
				if (is_numeric($cp)) {
  					$validar_cp=false;
				} 
				else {
  					$validar_cp=true;	
				}
			}
			else{
				$validar_cp=true;
			}
		}
		else{
			$validar_cp=true;
		}
	}
	else{
		$validar_cp=true;
	}
	
//------------------------------------------------------------------------------------------------------
	//TELEFONO
	if(isset($_POST['telefono'])){ 
		if(!empty($_POST['telefono'])){
			$telefono=$_POST['telefono'];
			if(strlen($telefono)==9){
				if (is_numeric($telefono)){
  					$validar_tele=false;
				} 
				else {
  					$validar_tele=true;	
				}
			}
			else{
				$validar_tele=true;
			}
		}
		else{
			$validar_tele=true;
		}
	}
	else{
		$validar_tele=true;
	}
	
// FIN VALIDACION	
	
	if($validar_email){
		$formulario.="Email: <input type='text' name='email' placeholder='Email'><br><br>
		<p style=\"color:red;\">Error en el apartado email</p><br><br>";
	}
	else{
		$formulario.="Email: <input type='text' name='email' placeholder='Email' value='$email'><br><br>";
	}	
	if($validar_texto){
		$formulario.="Nombre: <input type='text' name='texto' placeholder='Nombre'><br><br>
		<p style=\"color:red;\">Error en el apartado nombre</p><br><br>";
	}
	else{
		$formulario.="Nombre: <input type='text' name='texto' placeholder='Nombre' value='$texto'><br><br>";
	}
	if($validar_pass){
		$formulario.="Contraseña: <input type='password' name='contrasenia' placeholder='Contraseña'><br><br>
		<p style=\"color:red;\">Error en el apartado contraseña</p><br><br>";
	}
	else{
		$formulario.="Contraseña: <input type='password' name='contrasenia' placeholder='Contraseña' value='$pass'><br><br>";
	}	
	if($validar_direccion){
		$formulario.="Direccion: <input type='text' name='direccion' placeholder='Dirección'><br><br>
		<p style=\"color:red;\">Error en el apartado direccion</p><br><br>";
	}
	else{
		$formulario.="Direccion: <input type='text' name='direccion' placeholder='Dirección' value='$direccion'><br><br>";
	}
	if($validar_cp){
		$formulario.="Codigo Postal<input type='text' name='cp' placeholder='Código Postal'><br><br>
		<p style=\"color:red;\">Error en el apartado codigo postal</p><br><br>";
	}
	else{
		$formulario.="Codigo Postal<input type='text' name='cp' placeholder='Código Postal' value='$cp'><br><br>";
	}
	if($validar_tele){
		$formulario.="Telefono: <input type='text' name='telefono' placeholder='Telefono'><br><br>
		<p style=\"color:red;\">Error en el apartado telefono</p><br><br>";
	}
	else{
		$formulario.="Telefono: <input type='text' name='telefono' placeholder='Telefono' value='$telefono'><br><br>";
	}
	$formulario.="<br><br><input type='submit' name='enviar' value='Enviar'></form>";
	if($validar_email==true||$validar_texto==true|| $validar_pass==true || $validar_direccion==true || $validar_cp==true || $validar_tele==true){
		echo $formulario;
	}
	else{
		
		$stmt = $con->prepare('INSERT INTO `clientes`(`email`, `nombre`, `contrasenia`, `direccion`, `cp`, `telefono`) VALUES (:email,:nombre,:pass,:direccion,:cp,:telefono)');
		$stmt->bindParam(':email',$email);
		$stmt->bindParam(':nombre',$texto);
		$stmt->bindParam(':pass',$pass);
		$stmt->bindParam(':direccion',$direccion);
		$stmt->bindParam(':cp',$cp,PDO::PARAM_INT);
		$stmt->bindParam(':telefono',$telefono,PDO::PARAM_INT);
		if($stmt->execute()){
			header("Refresh: 3; url=./login.php");		
			echo"<p>Usuario insertado correctamente</p><br><br><a href='./jabones_scarlatti.php'>Volver al inicio</a><br><br>";
		}
		else{
			echo "<p>Fallo en la insercion en BD</p><br><br><a href='./jabones_scarlatti.php'>Volver al inicio</a><br><br>";
		}
	}
	
	
	
}
?>
