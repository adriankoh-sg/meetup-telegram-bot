<?php
require_once '../settings.php';



function apiLog ($msg, $err) {
    $handle = fopen(API_LOG, "a");
    $log = '[' . date('Y-m-d H:i:s') .'] - ';
    $log .= ($err) ? "[ERROR]" : "";
    $log .= "[{$msg}]\n";
    fwrite($handle, $log);
    fclose($handle);
}

function echoResponse ($success, $msg) {
    //this function is the standardize output response for all API request
    $output = array(
        'success'=> $success ? 'true' : 'false',
        'data' => $msg
    );
    echo json_encode($output);
}

//function to test the recieve POST data
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

function sendWelcome ($db, $chat_id) {
    global $telegramAPI;
    $result = $db->query("SELECT * FROM `tgSettings`");
    $row = $result->fetch_row();
    $token = $row[0];
    $welcome = urlencode($row[3]); //need to use urlencode to make this API work
    
    $result->close();
    $url = $telegramAPI['botUri'] . $token . "/sendMessage?chat_id={$chat_id}&parse_mode=HTML&text={$welcome}";

    $data = array(
        "inline_keyboard" => array(array(
            array(
                "text" => "0", 
                "callback_data" => "cb1"
            ),
            array(
                "text" => "1", 
                "callback_data" => "cb2"
            )
            ))
    );
    $payload = json_encode($data);


    // create & initialize a curl session
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    // Attach encoded JSON string to the POST fields
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $output = curl_exec($curl);
    apiLog("Welcome Message Send to {$chat_id}, {$output}", false);
    curl_close($curl);
}

function updateWebhook ($db) {
    global $telegramAPI;
    $result = $db->query("SELECT * FROM `tgSettings`");
    $row = $result->fetch_row();
    $token = $row[0];
    $webhook = urlencode($row[2]);
    
    //first is to delete previous webhook
    $url = $telegramAPI['botUri'] . $token . "/deleteWebhook";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $output = curl_exec($curl);
    
    //set the new webhook
    $url = $telegramAPI['botUri'] . $token . "/setWebhook?url={$webhook}";
    curl_setopt($curl, CURLOPT_URL, $url);
    apiLog("Webhook Updated: {$url}", false);
    $output = curl_exec($curl);
    curl_close($curl);
    return $url;
}

function sendMessage ($db, $id, $msg) {
    global $telegramAPI;
    $result = $db->query("SELECT * FROM `tgSettings`");
    $row = $result->fetch_row();
    $token = $row[0];
    
    $result->close();
    $url = $telegramAPI['botUri'] . $token . "/sendMessage?chat_id={$id}&parse_mode=HTML&text={$msg}";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $output = curl_exec($curl);
    curl_close($curl);
}

function confirmName ($db, $id, $msg) {
    global $telegramAPI;
    $result = $db->query("SELECT * FROM `tgSettings`");
    $row = $result->fetch_row();
    $token = $row[0];
    
    $result->close();
    //markup keyboard
    // $buttons = array(array(['text' => 'Correct'], ['text' => 'Wrong']));
    // $data = array('chat_id' => $id, "text" => $msg, 'reply_markup' => array(
    //     'keyboard' => $buttons,
    //     'one_time_keyboard' => true,
    //     'resize_keyboard' => true));

    //inline keyboard
    $data = array('chat_id' => $id, "text" => $msg, 'reply_markup' => array(
        'inline_keyboard' => array( 
            array(
                array(
                    'text' => 'Yes', 
                    'callback_data' => TG_REPLY_YES
                ),
                array(
                    'text' => 'No',
                    'callback_data' => TG_REPLY_NO
                ),))));


    $payload =  json_encode($keyboard);

    $url = $telegramAPI['botUri'] . $token . "/sendMessage";
    $curl = curl_init();
    //curl_setopt($curld, CURLOPT_POSTFIELDS, $postfields);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $output = curl_exec($curl);
    curl_close($curl);

}
?>
