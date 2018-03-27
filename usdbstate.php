<?php

$conn = mysql_connect("localhost", "DBFinal_user", "userpass");
if(!$conn) {
	die("Error connecting to mysql");
}

mysql_select_db("DBFinal", $conn);

include "conf.php";
include "open.php";

header('Content-Type: application/json');
$aResult = array();

switch ($_POST['functionname']) {
	case 'hover' :
		$statename = $_POST["arguments"][0];

		$query = "SELECT Name, Population, MedianIncome, MedianAge, NumPoverty, NumUnemployed FROM State WHERE Name='$statename';"; 
		$result = mysql_query($query);
		if(!$result) { 
			$aResult['error'] = mysql_error(); 
		} else {
			$row = mysql_fetch_assoc($result);	
			$aResult['result'] = $row;
		}
		break;

	case 'custom' :
		$query = $_POST["arguments"][0]; 
		$result = mysql_query($query);
		if(!$result) { 
			$aResult['error'] = mysql_error(); 
		} else {
			//$row = mysql_fetch_assoc($result);	
			$aResult['result'] = array();
			while($row = mysql_fetch_array($result)) {
				$aResult['result'][] = $row;
			}
		}
		break;

	case 'click':
		$statename = $_POST["arguments"][0];
		$querylist = array(
			"SELECT '$statename' as selection;",
			"SELECT Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumWhite/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumBlack/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumHispanic/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumAsian/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumOther/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumPoverty/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * (NumBachelors+NumMasters+NumProfessional+NumDoctorate)/Population as selection FROM State WHERE Name = '$statename';",
 			"SELECT 100 * NumUnemployed/Population as selection FROM State WHERE Name = '$statename';",
			"SELECT COUNT(*) as selection FROM County WHERE StateName like '%$statename%';",
 			"SELECT Name as selection FROM City WHERE StateID IN (SELECT StateID FROM State WHERE Name = '$statename');",
 			"SELECT Population as selection FROM City WHERE StateID IN (SELECT StateID FROM State WHERE Name = '$statename');",
			"SELECT Name as selection FROM Governor WHERE StateName = '$statename';", 
 			"SELECT Value as selection FROM Budget WHERE BudgetItem = 'Total Revenue' AND StateName = '$statename';",
 			"SELECT Value as selection FROM Budget WHERE BudgetItem = 'Total Expenditure' AND StateName = '$statename';");
		$aResult['result'] = array();
		$i = 0;
		foreach($querylist as $query) {
			$i = $i+1;
			$result = mysql_query($query);
			if(!$result) { 
				$aResult['error'] = mysql_error();
				break; 
			} else {
				$row = mysql_fetch_assoc($result);
				$aResult['result']['Query' . $i] = $row['selection'];	
			}
		}
		break;

	default:
		$aResult['error'] = "Hit Default with " . $_POST_['funtionname'];
		break;
}

echo json_encode($aResult);

//$statename = $_POST["arg1"]; 

//$query = "SELECT StateName, Population FROM State WHERE StateName='$statename';"; 

//$result = mysql_query($query);
//if(!$result) { console.log(mysql_error()); }


/*
$multiquery = explode(";", $query);


foreach ($multiquery as $subquery)
{
	$result = mysql_query($subquery);
	if($result) {echo "success";}
	else {echo mysql_error();}
	echo "<br>";
}

*/

mysql_close($conn);
?>
