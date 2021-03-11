<?php
// This is the API call to get and set the telegram bot settings into database
// API url: http://localhost/gongde/api/telegram/config.php ( will be declare as $telegramAPI['config'])

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';
require_once './botFunctions.php';

$data = json_decode(file_get_contents("php://input"));
$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}

if(isset($data->chat_id))
{
    $valid = ($data->validUser === '1') ? 1 : 0;
    $query = "UPDATE `tgSubscriber` SET 
                        `firstName` = '{$data->firstName}',
                        `lastName` = '{$data->lastName}',
                        `userName` = '{$data->userName}',
                        `knowName` = '{$data->knowName}',
                        `validUser` = {$valid} 
                        WHERE `chat_id` = {$data->chat_id}";
    $db->query($query);
    if (!$db->error) {
        echoResponse(true, $data);
        apiLog("Edited Subscriber: {$data->chat_id} | {$data->firstName} | {$data->knowName}", false);
    } else {
        echoResponse(false, $db->error);
        apiLog("{$db->error}", true);
    }
}


$db->close();

?>