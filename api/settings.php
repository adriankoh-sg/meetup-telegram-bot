<?php 

   date_default_timezone_set('Asia/Singapore');

    // web hook url will be saved in db
    // $webhookUrl = 'http://localhost/gongdetzrc/api/telegram/update.php';
     $gongde_db = [
        'host'     => 'localhost',
        'port'     => 3306, // optional
        'user'     => 'root',
        'password' => '',
        'database' => 'gongde',
     ];

     //Telegram API call to access the db tables with telegram prefix
     $telegramAPI = [
        'botUri' => 'http://localhost:8081/bot',
        'config' => 'http://localhost/gongde/api/telegram/config.php'
     ];

     // Global define declaration
     define('API_LOG', __DIR__ . '/logs/apilogs.log');
     define('ADMIN_EMAIL', 'hello.gongde@mail.com');
     define('TG_REPLY_YES', 'yes');
     define('TG_REPLY_NO', 'no');

     define('ASK_FOR_NAME', "Please tell us your known name to us? 请输入在公德大家对您的称呼");
     define('RECORD_UPDATED', "Record updated. 输入完毕");
?>
