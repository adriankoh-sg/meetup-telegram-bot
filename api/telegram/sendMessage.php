<?php
// This is the webhook handling for Telegram Bot

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';
require_once './botFunctions.php';
require_once './members.php';

$contents = file_get_contents("php://input");
$data = json_decode($contents);

/*
 input json example
 {
     group_id : 5,
     text : "Something to send"
 }
*/

$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
    die;
}

//---- START

if (isset($data->group_id)) {
    //find all members
    $text = $data->text;
    $members = loadAllMembers($db, $data->group_id);
    $N = sizeof($members);
    $success = true;
    for ($i = 0; $i < $N; $i++) {
        $cid = $members[$i]['chat_id'];
        $output = sendMessage($db, $cid, $text);
        $output = json_decode($output);
        $OK = ($output->ok) ? 'OK' : 'Not OK';
        $success = $success && $output->ok;
        apiLog("Message send to {$cid} is {$OK}", !$output->ok);
        if (($i % TRX_RATE) == 0) sleep(1); //Telegram limits @ 30 msg/sec 
    }
    $msg = ($success) ? 'All message are delivered.' : 'One or more message have error.';
    echoResponse($success, $msg);
}

//----- END

$db->close();
?>