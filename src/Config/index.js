// Upon deployment, please modify the BASE_URL accordingly
const BASE_URL = 'http://192.168.1.101/gongde/api/telegram'
const Config = {
    api : {
        'tgSetting' : BASE_URL + '/config.php',
        'tgGetConfig':  BASE_URL + '/getConfig.php',
        'tgGetSubscribers' : BASE_URL + '/getSubscribers.php',
        'tgEditSubscriber' : BASE_URL + '/editSubscribers.php',
        'tgGroups' : BASE_URL + '/groups.php',
        'tgMembers' : BASE_URL + '/members.php'
    }
    
}
export default Config;