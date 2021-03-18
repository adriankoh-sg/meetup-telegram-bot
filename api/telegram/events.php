<?php
// This is the API call to get and create new events (calander)

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';
require_once './botFunctions.php';
require_once './groups.php';

$contents = file_get_contents("php://input");
$data = json_decode($contents);

/*
 input json example
 {
     action : 'add',
     event_id : 33,
     title: '',
     description: '',
     startDate: '',
     group_id: '',
     status : ''
 }
*/

$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}
//---- START ----
if (isset($data->action)) {
    $action = test_input($data->action);
} else {
    $action = '';
}
    
    
switch ($action) {
    case 'add':
        $query = "INSERT INTO 
                    `tgevents` (`title`, `description`, `startDate`, `group_id`, `status`) 
                    VALUE ('{$data->title}', '{$data->description}', '{$data->startDate}', {$data->group_id}, 'new')";
        $result = $db->query($query);
        apiLog($query, false);
        if ($result) {
            $data = $db->insert_id; //loadAllGroup ($db);
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
        break;
    case 'delete':
        $query = "DELETE FROM `tgevents` WHERE `event_id` = {$data->event_id};";
        $result = $db->query($query);
        if ($result) {
            $data = 'Event is deleted.';
            echoResponse(true, $data);
        } else {
            apiLog($db->error,true);
            echoResponse(false, $db->error);
        }
    break;
    case 'read':
        $data = loadEvent ($db, $data->startDate);
        echoResponse(true, $data);
    break;
    case 'broadcast': //action to broadcast a reminder now for selected event
        break;
}


function loadEvent ($db, $startDate) {
    $query = "SELECT * FROM `tgevents` LEFT JOIN `tggroup` 
                ON tgevents.group_id = tggroup.id
                WHERE tgevents.startDate 
                BETWEEN '{$startDate} 00:00:00' AND '{$startDate} 23:59:59'
                ORDER BY tgevents.startDate ASC; ";
    $result = $db->query($query);
    $data = array();
    while ($row = $result->fetch_row()) {
        array_push($data, 
            array(
                'id' => $row[0],
                'title' => $row[1],
                'description' => $row[2],
                'startDate' => $row[3],
                'group_id' => $row[4],
                'groupName' => $row[7],
                'status' => $row[5]
            ));
    }
    return $data;
}


//---- END ----
$db->close();
?>