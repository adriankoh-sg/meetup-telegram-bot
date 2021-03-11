<?php
// This is the API call to get and create new groups in tgGroup

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
    $groupName = isset($_GET['groupName']) ? test_input($_GET['groupName']) : '';
    $id = isset($_GET['id']) ? test_input($_GET['id']) : '';
} else {
    $action = '';
}
    
    
switch ($action) {
    case 'add':
        $query = "INSERT INTO `tggroup` (`groupName`) VALUE ('{$groupName}')";
        $result = $db->query($query);
        
        if ($result) {
            $data = loadAllGroup ($db);
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
        break;
    case 'delete':
        $query = "DELETE `tggroup`, `tgGroupLink` 
                    FROM `tggroup` LEFT JOIN `tgGroupLink`
                    ON tggroup.id = tggrouplink.group_id
                    WHERE tggroup.id = {$id}";
        $result = $db->query($query);
        if ($result) {
            $data = loadAllGroup ($db);
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
    break;
    case 'read':
        $data = loadAllGroup ($db);
        echoResponse(true, $data);
    break;
}

function loadAllGroup ($db) {
    $result = $db->query("SELECT * FROM `tgGroup`"); 
    $data = array();
    while ($row = $result->fetch_row()) {
        array_push($data, 
            array(
                'id' => $row[0],
                'groupName' => $row[1]
            ));
    }
    return $data;
}

$db->close();
?>