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

if(isset($data->token) && !empty(trim($data->botName)) && !empty(trim($data->webhook)) && !empty(trim($data->welcome)))
{
    $token = trim($data->token);
    $botName = trim($data->botName);
    $webhook = trim($data->webhook);
    $updateHook = $data->updateHook;
    // check is the token already in db, if yes --> update, no --> create new
    $query = "SELECT `token` FROM `tgsettings` WHERE `token` = '{$data->token}'";
    $result = $db->query($query);
    if($db->affected_rows > 0) {
        //update token
        $query = "UPDATE `tgsettings` SET `botName` = '{$botName}', `webhook` = '{$webhook}', `welcomeMessage` = '{$data->welcome}' WHERE `token` = '{$token}'";
        $result = $db->query($query);
        if ($db->affected_rows  > 0) {
            echoResponse(true, 'Settings updated');
        }else{
            echoResponse(false, 'Problem on update settings');
        }
    } else {
        //create new token config
        $query = "INSERT INTO `tgsettings` VALUE ( '{$token}','{$botName}', '{$webhook}', '{$data->welcome}')";
        $result = $db->query($query);
        if($result){
            echoResponse(true, 'Settings inserted');
        }
        else{
            echoResponse(false, 'Problem on inserting settings');
        }
    }

    if ($updateHook) {
        //setup new webhook in Telegram
        $msg = updateWebhook($db);
        echoResponse(true, "Webhook updated: {$msg}");
    }
}

$db->close();

?>