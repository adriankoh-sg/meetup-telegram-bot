<?php
// This is the API call for access to members base on a selected group
// Input: group id, action
// output: members

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';
require_once './botFunctions.php';

$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}

if (isset($_GET['action'])) {
    $action = test_input($_GET['action']);
    $group_id = test_input($_GET['group_id']);  
    $chat_id = isset($_GET['cid']) ? test_input($_GET['cid']) : ''; 
}
else
    $action = '';
    
switch ($action) {
    case 'add':
        $query = "INSERT INTO `tggrouplink` VALUE ({$group_id},'{$chat_id}')";
        $result = $db->query($query);
        if ($result) {
            $data = loadAllMembers ($db, $group_id);
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
        break;
    case 'remove':
        $query = "DELETE FROM `tggrouplink` WHERE `group_id` ={$group_id} AND `chat_id` = '{$chat_id}'";
        $result = $db->query($query);
        apiLog($query,false);
        if ($result) {
            $data = loadAllMembers ($db, $group_id);
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
    break;
    case 'read':
        $data = loadAllMembers ($db, $group_id);
        echoResponse(true, $data);
    break;
}

function loadAllMembers ($db, $group_id) {
    $query = "SELECT * FROM `tgGroupLink` 
                LEFT JOIN `tgSubscriber` 
                ON tgGroupLink.chat_id = tgSubscriber.chat_id 
                WHERE tgGroupLink.group_id = {$group_id}";
    $result = $db->query($query); 
    $data = array();
    while ($row = $result->fetch_row()) {
        array_push($data, 
        array(
            'group_id' => $row[0],
            'chat_id' => $row[1],
            'firstName' => $row[3],
            'lastName' => $row[4],
            'userName' => $row[5],
            'knowName' => $row[6],
            'validUser' => $row[7],
            'createOn' => $row[8]
        ));
    }
    
    return $data;
}

$db->close();
?>