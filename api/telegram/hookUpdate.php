<?php
// This is the webhook handling for Telegram Bot

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

require_once '../settings.php';
require_once './botFunctions.php';

$contents = file_get_contents("php://input");
$data = json_decode($contents);
//apiLog($contents, false);
$db = new mysqli($gongde_db['host'],$gongde_db['user'],$gongde_db['password'],$gongde_db['database']);
if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
    die;
}

if ($data) {
    if ( $data->message) {
        $message = $data->message->text;
        switch ($message) {
            case '/start' : addNewSubscriber($db, $data->message->from, $data->message->date); break;
            default: registerName($db, $data->message, $message);  break;
        }
    } else if ( $data->callback_query ) {
        $reply = $data->callback_query->data;
        $id = $data->callback_query->from->id;
        $text = $data->callback_query->message->text;
        registerName($db, $data->callback_query->message, $reply);
    } else {
        apiLog(json_decode($data), false);
    }

}

function addNewSubscriber($db, $chat, $date) {

    $createOn = date('Y-m-d H:i:s', $date);

    if (isset($chat->id)) {
        $firstName = (isset($chat->first_name)) ? $chat->first_name : '';
        $lastName = (isset($chat->last_name)) ? $chat->last_name : '';
        $userName = (isset($chat->username)) ? $chat->username : '';

        //check whether is subscriber in the db, if yes, then welcome back again
        $query = "SELECT * FROM `tgSubscriber` WHERE `chat_id` = {$chat->id}";
        $result = $db->query($query);
        if ($result->num_rows > 0) {
            //record exsits
            $row = $result->fetch_row();
            $display = (strlen($row[1]) > 0) ? $row[1] : '';
            $display .= (strlen($row[2]) > 0) ? ' ' . $row[2] : '';
            $display .= (strlen($row[4]) > 0) ? ', ' . $row[4] : '';
            $msg = "Welcome back <b>{$display}</b><pre>You are already in the system.</pre>";
            sendMessage($db, $chat->id, $msg);
        } else {
            $query = "INSERT INTO `tgSubscriber` VALUE ({$chat->id}, '{$firstName}', '{$lastName}', '{$userName}', '', 0, '{$createOn}')";
            $db->query($query);
            if (!$db->error) {
                sendWelcome ($db, $chat->id);
                apiLog("New subscriber - id:{$chat->id}, name: {$firstName} {$lastName}", false);
                $msg = ASK_FOR_NAME;
                sendMessage($db, $chat->id, $msg); 
            } else {
                $msg = "Problem creating your account. Please sent an email to ". ADMIN_EMAIL ." Ref [". $chat->id ."]";
                sendMessage($db, $chat->id, $msg);
                apiLog("Error inserting new subscriber - id:{$chat->id}, name: {$firstName} {$lastName}", true);
            }            
        }
    }
}

function registerName ($db, $chat, $msg) {
    //This function will check whether is new user inputing his/her know name  
    switch ($msg) {
        case TG_REPLY_YES:  
            $id = $chat->chat->id; //the person chat id
            
            $query = "UPDATE `tgSubscriber` SET `knowName` = '{$chat->text}' WHERE `chat_id` = {$id}";
            if( $db->query($query) ) 
                $reply = RECORD_UPDATED;
            else
                $reply = "Problem updating record. Please sent an email to ". ADMIN_EMAIL ." Ref [". $id ."]";
            sendMessage($db, $id, $reply);
            break;
        case TG_REPLY_NO:  
            $id = $chat->chat->id; //the person chat id 
            sendMessage($db, $id, ASK_FOR_NAME);     
            break;
        default:          
            $id = $chat->from->id; //the person chat id  
            $query = "SELECT * FROM `tgSubscriber` WHERE `chat_id` = {$id}"; 
            $result = $db->query($query);
            if ($result) {
                //$row = $result->fetch_row();
                //if ($row[4] == '') {
                    confirmName($db, $id, $msg);
                //}
            } 
            break;
    }
}

$db->close();
?>

<?php
/*
examples

{
    "update_id":10000,
    "message":{
    "date":1441645532,
    "chat":{
        "last_name":"Test Lastname",
        "id":1111111,
        "first_name":"Test",
        "username":"Test"
    },
    "message_id":1365,
    "from":{
        "last_name":"Test Lastname",
        "id":1111111,
        "first_name":"Test",
        "username":"Test"
    },
    "text":"/start"
}


{
    "update_id":484467034,
    "callback_query":
        {
            "id":"3500749308061689919",
            "from":
                {
                    "id":815081714,
                    "is_bot":false,
                    "first_name":"Adrian Koh",
                    "last_name":"\u8a31\u6d8c\u6062",
                    "language_code":"en"
                },
            "message":
                {
                    "message_id":259,
                    "from":
                        {
                            "id":1577233399,
                            "is_bot":true,
                            "first_name":"GongdeGroupBot",
                            "username":"Gongde_bot"
                        },
                    "chat":
                        {
                            "id":815081714,
                            "first_name":"Adrian Koh",
                            "last_name":"\u8a31\u6d8c\u6062",
                            "type":"private"
                        },
                    "date":1615118997,
                    "text":"Xu Yonghui",
                    "reply_markup": 
                        {
                            "inline_keyboard":[[
                                {"text":"Correct","callback_data":"correct"},{"text":"Wrong","callback_data":"wrong"},{"text":"Abort","callback_data":"abort"}
                                ]]
                        }
                    },
                    "chat_instance":"-5353115993126188103",
                    "data":"wrong"
                }
            }
*/
?>