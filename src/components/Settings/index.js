import React, { useState, useEffect  } from 'react';
import { useHistory } from 'react-router-dom';
import Config from '../../Config';
import Axios from 'axios';

function Settings () {
    let histroy = useHistory(); //use this method to re-directs
    const [loaded, setLoaded] = useState(false)
    const [token, setToken] = useState('')
    const [botName, setBotName] = useState('')
    const [webhook, setWebhook] = useState('')
    const [welcome, setWelcome] = useState('')
    const [updateHook, setUpdateHook] = useState(true)

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        
        if (!loaded) {
            Axios.get(Config.api.tgGetConfig)
            .then( (result) => {
                setLoaded(true)
                setToken(result.data.token)
                setBotName(result.data.botName)
                setWebhook(result.data.webhook)
                setWelcome(result.data.welcome)
                console.log('done',result)
            })
        }
    }, [loaded]);

    function handler (event) {
        event.preventDefault();
        if (event.target.name === 'cancel') {
            histroy.push('/'); //homepage
        } else {
            //make api call to save in db
            let data = {
                token,
                botName,
                webhook,
                welcome : welcome.replaceAll("'",'"'),
                updateHook
            }
            console.log('save data', data)
            Axios.post(Config.api.tgSetting, data)
                .then ( (resp) => console.log('resp',resp) )
        }
    }
    
    function updateForm (event) {
        const id = event.target.id
        const value = event.target.value
        console.log('text',id, value)
        switch (id) {
            case 'inToken': setToken(value);      break;
            case 'botName': setBotName(value);    break;
            case 'webhook': setWebhook(value);    break;
            case 'welcomeNote': setWelcome(value);break;
            case 'changeWebhook': setUpdateHook(!updateHook);  break;
        }
        event.preventDefault();
    }
    

    return (
        <div className="container-fluid">
            {console.log('token',token)}
            <form>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="inToken" className="form-label">Bot Token</label>
                        <input type="text" className="form-control" id="inToken" value={token} onChange={(e) => updateForm(e)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="botName" className="form-label">Telegram Bot Name</label>
                        <input type="text" className="form-control" id="botName" value={botName} onChange={(e) => updateForm(e)} />
                    </div>
                    
                        <div className="col-md-6">
                            <label htmlFor="webhook" className="form-label">Webhook</label>
                            <input type="text" className="form-control" id="webhook" value={webhook} onChange={(e) => updateForm(e)} />    
                        </div>
                        <div className="col-md-6">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="changeWebhook" defaultChecked={updateHook} onChange={(e) => updateForm(e)}/> 
                                <label className="form-check-label" htmlFor="changeWebhook">
                                    Update webhook upon save
                                </label> 
                            </div>   
                        </div>
                    
                    <div className="col-12">
                        <label htmlFor="welcomeNote" className="form-label">Welcome Message</label>
                        <textarea className="form-control" id="welcomeNote" rows="10" cols="50" value={welcome} onChange={(e) => updateForm(e)} />
                    </div>

                    <div className="col-12 d-flex flex-row mt-3 justify-content-between">
                        <button type="submit" className="btn btn-primary" onClick={(e)=>handler(e)} name='save'>Save</button>
                        <button type="submit" className="btn btn-secondary" onClick={(e)=>handler(e)} name='cancel'>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Settings;


