import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import Axios from 'axios';
import Config from '../../Config'
import { Tabs, Tab, Form, Button, Toast } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'antd/dist/antd.css';
import { TimePicker } from 'antd';
import { findIndex, size, upperCase } from 'lodash';
import { createEvent } from '@testing-library/dom';

function EventSetup() {
    const [loaded, setLoaded] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [key, setKey] = useState('showEvent')
    const [allGroup, setAllGroup] = useState([])
    const [selectGroup, setSelectGroup] = useState({})
    const [toast, setToast] = useState({ show: false, action: '', msg: '', type: ''})
    const [formInputs, setFormInputs] = useState({
                                            title: '',
                                            description: '',
                                            startDate: '',
                                            startTime: '',
                                            group_id: 0
                                        })
    const [events, setEvents] = useState([])
    
    useEffect( () => {    
        if (!loaded) {
            Axios.get(Config.api.tgGroups + '?action=read')
            .then( (result) => {
                setSelectGroup(result.data.data[0])
                setAllGroup(result.data.data)
                setFormInputs({ 
                    title: '', 
                    description: '', 
                    startDate: Moment(startDate).format('YYYY-MM-DD'), 
                    startTime: '', 
                    group_id: result.data.data[0].id })
                setLoaded(true)
            })            
        }

    }, [allGroup])


    function displayEvents (date) {
        console.log('d',date)
        let postData = {
            action: 'read',
            startDate: Moment(date).format('YYYY-MM-DD')
        }
        Axios.post(Config.api.tgEvents, postData) 
            .then ( (r) => {
                
                if ((r.data.success === 'true') && (size(r.data.data) > 0)) {
                    console.log('data',r.data.data)
                    setEvents(r.data.data)
                } else {
                    setEvents([])
                }
                
            })
    }

    //This function will create the new event in database
    function createEvent() {
        let postData = {
            action: 'add',
            title:  formInputs.title,
            description: formInputs.description,
            startDate:  formInputs.startDate + ' ' + formInputs.startTime,
            group_id: formInputs.group_id
        }

        Axios.post(Config.api.tgEvents, postData) 
            .then ( (r) => {
                setToast({ show: true, action: 'Event Save', msg: 'New Event ID: '+r.data.data, type: (r.data.success === 'true') ? '' : 'bg-warning' })
                setFormInputs({
                    title: '',
                    description: '',
                    startDate: formInputs.startDate,
                    startTime: formInputs.startTime,
                    group_id: formInputs.group_id
                })
                document.getElementById('titleInput').focus()
            })
    }
    //This function will delete event
    function deleteEvent(eventId) {
        console.log('eventid', eventId)
        let postData = {
            action: 'delete',
            title:  formInputs.title,
            description: formInputs.description,
            startDate:  Moment(formInputs.startDate).format('YYYY-MM-DD'),
            group_id: formInputs.group_id,
            event_id: eventId
        } 

        Axios.post(Config.api.tgEvents, postData) 
        .then ( (r) => {
            if (r.data.success === 'true') {
                console.log('data',r.data.data)
                displayEvents (postData.startDate)
                //setEvents(r.data.data)
            } 
        })
    }

    function sendReminder(eventId) {
        let i = findIndex(events, ['id', eventId])
        let message = '<b>'+events[i].title+'</b>' + "\n" 
                        + events[i].description 
                        + '<pre>Date: ' + Moment(events[i].startDate).format('DD/MM/YYYY') + '</pre>'
                        + '<pre>Time: ' + Moment(events[i].startDate).format('hh:mm a') + '</pre>'
        let data = { group_id: events[i].group_id, text: message }

        console.log('data', data, i)
        let url = Config.api.tgSendMessage;
        Axios.post(url, data)
            .then( (r) => {
                console.log(r)
                setToast({ show: true, action: 'Broadcast', msg: r.data.data, type: (r.data.success === 'true') ? '' : 'bg-warning' }) 
            })
    }


    function handleFormInputs (event, isDate) {
        let data = formInputs;
        if (typeof(event.target) === 'undefined') {
            //then its the time object
            data.startTime = Moment(event).format('HH:mm:ss')
            if (isDate) {
                data.startDate = Moment(event).format('YYYY-MM-DD')
                setStartDate(event)
                if (key === 'showEvent') {
                    //go and load the events to display
                    displayEvents(event) //event is the selected Moment object
                }
            }
        } else {
            let value = event.target.value
            let id = event.target.id
            switch (id) {
                case 'titleInput': data.title = value;                  break;
                case 'descriptionInput': data.description = value;      break;
                case 'allGroupList': data.group_id = parseInt(value);   break;
                case 'actionSave': createEvent();   break;
                //user call from 'Events' tab. value contains the selected event_id
                case 'delete' : deleteEvent(event.target.value);   break; 
                case 'broadcast' : sendReminder(event.target.value);   break; 
            }
        }
        setFormInputs({ title: data.title, 
                        description: data.description, 
                        startDate: data.startDate, 
                        startTime: data.startTime, 
                        group_id: data.group_id })
    }

    function displayRemainingTime(startDate) {
        let now = Moment()
        let duration = Moment.duration( Moment(startDate).diff(now))
        let strFooter = 'Time to start event: ' + duration._data.days 
                        + ' day(s), ' + duration._data.hours + ' hour(s), '
                        + duration._data.minutes + ' minute(s).'
        return strFooter
    }

    return (
        <div className="row">
            <div className="col-sm-auto">
                <DatePicker 
                    selected={startDate} 
                    onChange={date => handleFormInputs(date, true)} 
                    monthsShown={1}
                    inline
                    todayButton="Today"
                    highlightDates={[new Date()]}
                />
            </div>
            <div className="col-sm border shadow-sm p-2">
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                >
                <Tab className='p-2' eventKey="showEvent" title="Events">
                    <div className='col-12'>{ /* Current events */ }
                        <h5>Current Events</h5>
                    </div>
                    <div className="col-sm-12 p-2">
                        {
                            (size(events) > 0) ? events.map( (item, i) => { 
                                return (
                                    <div className="card m-2 shadow-sm" key={i} id={item.id}>
                                        <div className="card-header">
                                            <h5 className="card-title">{item.title}</h5>
                                        </div>
                                        <div className="card-body">
                                            <pre className="card-text wrap">{item.description}</pre>
                                            <Button variant="primary" id='delete' 
                                                onClick={(e) => handleFormInputs(e)} value={item.id} >Delete</Button>
                                            <span>  </span>
                                            <Button variant="primary" id='broadcast' 
                                                onClick={(e) => handleFormInputs(e)} value={item.id} >Send Reminder Now</Button>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between">
                                            <span>{displayRemainingTime(item.startDate)}</span>
                                            <span>   </span>
                                            <p>Status: <span class="badge bg-info p-1">{upperCase(item.status)}</span></p>
                                        </div>
                                    </div>
                                )
                            }) : <p>No Events</p>
                        }

                    </div>
                </Tab>
                <Tab className='p-2' eventKey="addEvent" title="Add Event">
                    <div className='col-12'>
                        <h5>Add New Event</h5>
                    </div>
                    <div className='col-12'>
                        <div className="mb-3">
                            <label htmlFor='titleInput' className="form-label">Title</label>
                            <input type="text" className="form-control" id="titleInput" 
                                    onChange={(e) => handleFormInputs(e)} value={formInputs.title}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descriptionInput" className="form-label">Description</label>
                            <textarea className="form-control" id="descriptionInput" rows="5"  
                                        onChange={(e) => handleFormInputs(e)} value={formInputs.description}></textarea>
                        </div>

                        <div className='row'>
                            <div className='col-sm-3'>
                                <Form.Control type="text" placeholder={Moment(startDate).format('YYYY-MM-DD')} readOnly />
                            </div>
                            <div className='col-sm-3'>
                                <TimePicker use12Hours format="h:mm a" onChange={(t) => handleFormInputs(t)} />
                            </div>
                            <div className='col-sm-auto'>
                                <label>For recipients group:</label>{' '}
                                <select className="form-select-auto mb-3" id="allGroupList" onClick={(e) => handleFormInputs(e)} onChange={(e) => handleFormInputs(e)}>
                                {
                                    allGroup.map ( (item, i) => {
                                        return (
                                            <option value={item.id} key={i}>{item.groupName}</option>
                                        )
                                    })
                                }
                                </select>
                            </div>                         
                        </div>
                        <div className='mb-3'>
                            <Button variant="primary" id='actionSave' onClick={(e) => handleFormInputs(e)}>Save</Button>
                        </div> 
                    </div>
                </Tab>
            </Tabs>
                
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
    );
  }
export default EventSetup;