<?php
// This is the API call to get and set the telegram bot settings into database
// API url: http://localhost/gongde/api/telegram/config.php ( will be declare as $telegramAPI['config'])

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

$result = $db->query("SELECT * FROM `tgSettings`");
$row = $result->fetch_row();
$token = $row[0];
$botName = $row[1];
$webhook = $row[2];
$welcome = $row[3];

echo json_encode([
    "token" => $row[0],
    "botName" => $row[1],
    "webhook" => $row[2],
    "welcome" => $row[3],
    "test" => $telegramAPI['botUri']
    ]);


$db->close();
?>