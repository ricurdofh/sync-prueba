<?php

include_once 'db_functions.php';

$db = new DB_Functions();

$data = json_decode(file_get_contents('php://input'), true);

$log = $db->checkLogin($data['info']['user'], $data['info']['pass']);

if ($log) {
    $response = array();
    $last_sync = date('Y-m-d H:i:s', $data['info']['lastSyncDate']/1000);
    $BDBid = $data['info']['BDBid'];
    $result = "OK";
    $message = "Data updated sucessfuly in the server";
    $response["data"]["tabla"] = $db->getDataToSync($last_sync);

    for ($i = 0; $i < count($data['data']['tabla']); $i++) {
        $store = $db->storeUser($data['data']['tabla'][$i]['nombre'], $data['data']['tabla'][$i]['apellido'], strtotime("now"));
        if (!$store) {
            $result = "ERROR";
            $message = "Error updating data in the server";
            break;
        }
    }
    $response["result"] = $result;
    $response["message"] = $message;
    $response["syncDate"] = strtotime("now")*1000;
    //$response["data"]["tabla"] = $db->getAllData();
} else {
    $response["result"] = "ERROR";
    $response["message"] = "Authentication error!";
}

echo json_encode($response);
?>