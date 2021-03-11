<?php
// This is the API call to get and set the telegram bot settings into database

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';

$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}

$result = $db->query("SELECT * FROM `tgSubscriber`");
$data = array();
while ($row = $result->fetch_row()) {
    array_push($data, 
        array(
            'chat_id' => $row[0],
            'firstName' => $row[1],
            'lastName' => $row[2],
            'userName' => $row[3],
            'knowName' => $row[4],
            'validUser' => $row[5],
            'createOn' => $row[6]
        ) );
}

echo json_encode($data);

$db->close();
?>