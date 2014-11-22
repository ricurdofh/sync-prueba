<?php

$data = json_decode(file_get_contents('php://input'), true);
/*$pheeds = "holis";
$res = "chais";*/
//header('Content-Type: application/json');
//echo json_encode(array('pheeds' => $pheeds, 'res' => $res));
echo json_encode($data);
?>