import React, { useState, useEffect  } from 'react';
import { useHistory } from 'react-router-dom';
import Config from '../../Config';
import Axios from 'axios';
import { findIndex, size } from 'lodash';
import { Modal, Button, Toast, Card } from 'react-bootstrap';
import PuffLoader from "react-spinners/PuffLoader";

function Subscribers () {
    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState('all');
    const [allGroups, setAllGroups] = useState([])
    const [selectGroup, setSelectGroup] = useState({})
    const [members, setMembers] = useState([])
    const [show, setShow] = useState(false); //for modal display
    const [modalText, setModalText] = useState('') //for Modal display
    const [toast, setToast] = useState({ show: false, action: '', msg: '', type: ''})

    useEffect( () => {
        
        if (!loaded) {
            
            Axios.get(Config.api.tgGetSubscribers)
            .then( (result) => {
                  setLoaded(true) 
                  setData(result.data)
            })
            Axios.get(Config.api.tgGroups + '?action=read')
            .then( (result) => {
                setSelectGroup(result.data.data[0])
                setAllGroups(result.data.data)
            })
        }
    }, [data, allGroups])

    function updateApprove (event) {
        let idx = findIndex(data, ['chat_id', event.target.id])
        data[idx].validUser = (data[idx].validUser === '1' ? '0' : '1')
        console.log(event.target.id, data[idx]);
        setData(data);

        Axios.post(Config.api.tgEditSubscriber, data[idx])
            .then ( (resp) => console.log('Response:', resp))
    }

    function displayAll () {
        //display all subscribers in the db
        return (
            <div className='d-flex flex-wrap'>
            { data.map( row => {
                return (
                    <div className="card border-info m-3 shadow-sm" key={row.chat_id}>
                        <div className="card-header"><h5>{row.chat_id} - {row.knowName ? row.knowName : 'not set'}</h5></div>
                        <div className="card-body">
                            <p className="card-text">{row.firstName} {row.lastName}</p>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id={row.chat_id} defaultChecked={(row.validUser === '1')} onChange={(e)=>updateApprove(e)} />
                                <label className="form-check-label" htmlFor={row.chat_id}>Approved</label>
                            </div>
                        </div>
                        <div className="card-footer text-muted">Create on: {row.createOn}</div>
                    </div>
                )
            })}
            </div>
        )
    }

    //------- Below are for Modal box display --------------------------------------------------------
    const handleClose = (save) => { 
        if (save) {
            //then call api to add new group
            Axios.post(Config.api.tgGroups+'?action=add&groupName='+encodeURI(modalText))
                .then ( (resp) => {
                    if (resp.data.success === 'true') {
                        //reloads the group combo list
                        setAllGroups(resp.data.data)
                    }
                })
        }
        setShow(false)
    }

    const handleShow = () => {
        setModalText('')
        setShow(true)
    }

    const showModal = (title) => {

        function updateForm (event) {
            setModalText(event.target.value)
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <input type="text" className="form-control" id="modalText" value={modalText} onChange={(e) => updateForm(e)} placeholder='Enter new group name' />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>handleClose(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>handleClose(true)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    // ---- End for all Modal Display functions --------------------------------

    function displayGroup () {
        //This function is the render page for Group Tab
        function loadGroupMembers (group_id) {
            //loads the member list base on selected group
            let url = Config.api.tgMembers + '?action=read&group_id='+group_id
            Axios.get(url)
            .then( (resp) => {
                setMembers(resp.data.data)
            })
        }

        function handleGroupSelect (event) {
            let group_id = event.target.value
            let i = findIndex(allGroups, ['id', event.target.value])
            setSelectGroup(allGroups[i]) //sets the group id
            loadGroupMembers(group_id)
        }

        function removeMember(m) {
            console.log('current id', m.chat_id)
            let url = Config.api.tgMembers + '?action=remove&group_id='+selectGroup.id+'&cid='+m.chat_id
            
            Axios.get(url)
            .then( (resp) => {
                if (resp.data.success === 'true') {
                    setMembers(resp.data.data)
                    setToast({ show: true, action: 'Remove Member', msg: m.knowName + ' is remove from '+selectGroup.groupName, type: ''})
                }
                else
                    setToast({ show: true, action: 'Error', msg: 'Problem on removing '+m.knowName, type: 'bg-warning'})

            })
        }
        function addMembersCard () {
            //selectGroup is the current selected group
            function handleAddMemeber () {
                
                if (selectGroup) { //if it is define
                    let cid = document.getElementById('memberID').value
                    if (size(cid) >= 9) {
                        let url = Config.api.tgMembers + '?action=add&group_id='+selectGroup.id+'&cid='+cid
                        Axios.get(url)
                        .then( (resp) => {
                            setMembers(resp.data.data)
                            document.getElementById('memberID').value = ''
                        })
                    }
                } else {
                    setToast({ show: true, action: '', msg: 'Please select or create a group first.', type: ''}) 
                }
            }
            return (
                <div className="card m-2 shadow-sm">
                    <div className="card-body p-2">
                        <input className="form-control" list="datalistOptions" id="memberID" placeholder="Type to search..."></input> 
                        <datalist id="datalistOptions">
                            {
                                data.map( (row, i) => {
                                        if (row.validUser === '1')
                                            return <option value={row.chat_id} key={i}>{row.firstName +' / '+row.knowName}</option>
                                        else
                                            return
                                    })
                            }
                        </datalist>
                        <button type="button" className="btn btn-primary" onClick={()=>handleAddMemeber()}>Add Member</button>  
                    </div>
                </div>
            )
        }

        function deleteGroup() {
            let deleteGroupName = selectGroup.groupName
            Axios.post(Config.api.tgGroups+'?action=delete&id='+selectGroup.id)
            .then ( (resp) => {
                if (resp.data.success === 'true') {
                    //reloads the group combo list
                    setAllGroups(resp.data.data)
                    setToast({ show: true, action: 'Delete Group', msg: deleteGroupName + ' is deleted.', type: ''}) 
                    if (size(resp.data.data) > 0) loadGroupMembers(resp.data.data[0].id)                       
                } else {
                    setToast({ show: true, action: 'Error', msg: 'Error occur in deleting group.', type: 'bg-warning'}) 
                }
            })
        }

        return (
            <div>
                {showModal('Add New Group')}
                <div className="row m-2">
                    <div className="col-8">
                        <div className='row'>
                            <div className='col-auto'>
                                <label htmlFor="allGroupsList" className="form-label">Groups:</label>
                            </div>
                            <div className='col'>
                                <select className="form-select-auto mb-3" id="allGroupList" onClick={(e)=>handleGroupSelect(e)} onChange={(e)=>handleGroupSelect(e)}>
                                {
                                    allGroups.map ( item => {
                                        return (
                                            <option value={item.id} key={item.id}>{item.groupName}</option>
                                        )
                                    })
                                }
                                </select>
                            </div>                        
                        </div>
                    </div>
                    <div className="col-4-md d-flex justify-content-md-between">
                        <button type="button" data-bs-target="#exampleModal" data-bs-toggle="modal"
                            className="btn btn-primary" onClick={handleShow}>Add Group</button>
                        <button type="button" data-bs-target="#exampleModal" data-bs-toggle="modal"
                            className="btn btn-secondary" onClick={deleteGroup}>Delete Group</button>
                    </div> 
                </div>
                <div className="row m-2">
                    <div className="d-flex flex-wrap mb-1">
                        {
                            //displayMembers()
                            (size(members) > 0) ?
                            members.map( (item, i) => {
                                return (
                                    <div className="card m-2 shadow-sm" key={i}>
                                        <div className="card-body">
                                            <p>{item.firstName} | {item.knowName}</p>
                                            <button type="button" className="btn btn-secondary" onClick={()=>removeMember(item)}>Remove</button>
                                        </div>
                                    </div>
                                )
                            }) : ''
                        }
                        {addMembersCard()}
                    </div>
                </div>
            </div>
        )
    }


    //Below is the start of the main page render for subscribers
    return (
        !loaded ? 
        <div>
            <div className='row justify-content-md-center'>
                <PuffLoader size={120} loading={true} color={'#eee'}/>
            </div>
            <div className='row justify-content-md-center'>
                <p>loading</p>
            </div>
        </div> :
        <div>
            <h3>Subscribers | ({size(data)})</h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                
                <li className="nav-item" role="presentation">
                
                    <button className={"nav-link" + ((page === 'all') ? " active" : "")} 
                        id="all-tab" data-bs-toggle="tab" data-bs-target="#all" 
                        type="button" role="tab" aria-controls="all" 
                        aria-selected={(page === 'all') ? "true" : "false"}
                        onClick={()=>setPage('all')}>All</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={"nav-link" + ((page === 'group') ? " active" : "")} 
                        id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" 
                        type="button" role="tab" aria-controls="profile" 
                        aria-selected={(page === 'group') ? "true" : "false"}
                        onClick={()=>setPage('group')}>Group</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={"nav-link" + ((page === 'pending') ? " active" : "")} 
                        id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" 
                        type="button" role="tab" aria-controls="contact" 
                        aria-selected={(page === 'pending') ? "true" : "false"}
                        onClick={()=>setPage('pending')}>Pending</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className={"tab-pane fade" + ((page === 'all') ? " show active" : "")} 
                    id="all" role="tabpanel" aria-labelledby="all-tab">{displayAll()}</div>
                <div className={"tab-pane fade" + ((page === 'group') ? " show active" : "")}  
                    id="profile" role="tabpanel" aria-labelledby="profile-tab">{displayGroup()}</div>
                <div className={"tab-pane fade" + ((page === 'pending') ? " show active" : "")} 
                    id="contact" role="tabpanel" aria-labelledby="contact-tab"><p>Pending for approval</p></div>
            </div>
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

export default Subscribers;