import React, { useState, useEffect  } from 'react';
import { useHistory } from 'react-router-dom';
import Config from '../../Config';
import Axios from 'axios';
import { findIndex, size } from 'lodash';
import { Toast, Badge } from 'react-bootstrap';
import PuffLoader from "react-spinners/PuffLoader";


function Broadcast () {
    const [allGroup, setAllGroup] = useState([])
    const [selectGroup, setSelectGroup] = useState({})
    const [members, setMembers] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [message, setMessage] = useState('')
    const [toast, setToast] = useState({ show: false, action: '', msg: '', type: ''})


    useEffect( () => {
        if (!loaded) {
            
            Axios.get(Config.api.tgGroups + '?action=read')
            .then( (result) => {
                setSelectGroup(result.data.data[0])
                setAllGroup(result.data.data)
                setLoaded(true)
            })
        }
    }, [allGroup])

    function handleGroupSelect (event) {
        let group_id = event.target.value
        let i = findIndex(allGroup, ['id', event.target.value])
        setSelectGroup(allGroup[i]) //sets the group id
        loadGroupMembers(group_id)
    }

    function loadGroupMembers (group_id) {
        //loads the member list base on selected group
        let url = Config.api.tgMembers + '?action=read&group_id='+group_id
        Axios.get(url)
        .then( (resp) => {
            setMembers(resp.data.data)
        })
    }

    function updateForm(event) {
        //updates the textarea
        setMessage(event.target.value)
    }

    function Broadcast() {
        let data = { group_id: selectGroup.id, text: message }
        let url = Config.api.tgSendMessage;
        Axios.post(url, data)
            .then( (r) => {
                console.log(r)
                setToast({ show: true, action: 'Broadcast', msg: r.data.data, type: (r.data.success === 'true') ? '' : 'bg-warning' }) 
            })
    }

    return (
        <div className='border shadow-sm'> 
            {
                !loaded ?
                    <div className="justify-content-md-center">
                        <PuffLoader size={120} loading={true} color={'#eee'}/>
                    </div> :
                    <div className='row w-100 p-3 d-flex flex-wrap'>
                        <div className='col-12'>
                            <h5>Broadcast</h5>
                        </div>
                        <div className='col-12'>
                            <label>Select the recipients group:</label>{' '}
                            <select className="form-select-auto mb-3" id="allGroupList" onClick={(e)=>handleGroupSelect(e)} onChange={(e)=>handleGroupSelect(e)}>
                            {
                                allGroup.map ( (item, i) => {
                                    return (
                                        <option value={item.id} key={i}>{item.groupName}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className='col-12 d-flex flex-wrap'>
                            {(size(members) > 0) ? <div><label className='px-3'>Members:</label></div> : ''}
                            {
                                (size(members) > 0) ?
                                members.map( (item, i) => {
                                    return (
                                        <div key={i}>
                                            <Badge variant='info' className='p-1 m-1'>{item.knowName}</Badge>
                                        </div>
                                    )
                                }) : ''
                            }
                        </div>
                        <div className='col-12 pt-3'>
                            <div className="mb-3">
                                <textarea 
                                    className="form-control" id="broadcastMessage" rows="10"
                                    value={message} onChange={(e) => updateForm(e)}></textarea>
                            </div>
                        </div>
                        <div className='col-12'>
                            <button type="button" className="btn btn-primary" onClick={()=>Broadcast()}>Broadcast</button>
                        </div>
                    </div>  
            }
            <Toast onClose={() => setToast({show: false})} show={toast.show} delay={3000} 
                autohide animation style={{ position: 'absolute', top: 0, right: 0, width: '300px' }}>
                <Toast.Header className={toast.type}>
                    <strong className="mr-auto">Notification</strong>
                    <small>{toast.action}</small>
                </Toast.Header>
                <Toast.Body>{toast.msg}</Toast.Body>
            </Toast>
        </div>

    )
}

export default Broadcast;