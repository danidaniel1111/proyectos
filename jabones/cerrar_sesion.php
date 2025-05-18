<?php
session_start();
Unset($_SESSION["autenticado"]);
Unset($_SESSION["email"]);
setcookie(session_name(),time()-3600);
session_destroy();
header("refresh:5;url=./jabones_scarlatti.php");
echo "Sesion cerrada,redirigiendo al inicio...";
?>
