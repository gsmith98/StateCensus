<!doctype html>
<html>
<head>
</head>

<?php

$conn = mysql_connect("localhost", "DBFinal_admin", "grahamelana");
if(!$conn) {
	die("Error connecting to mysql");
}

mysql_select_db("DBFinal", $conn);

include "conf.php";
include "open.php";


$query = $_POST["querytext"];
$multiquery = explode(";", $query);


foreach ($multiquery as $subquery)
{
	$result = mysql_query($subquery);
	if(!$result) {echo $subquery . ":<br>" . mysql_error() . "<br><br>"; }
}

mysql_close($conn);
?>
</html>
