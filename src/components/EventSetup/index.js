import React, { Component, useState } from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function EventSetup() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <div className="row">
            <div className="col-sm-auto">
                <DatePicker 
                    selected={startDate} 
                    onChange={date => setStartDate(date)} 
                    monthsShown={1}
                    inline
                />
            </div>
            <div className="col-sm">
                <h3>Events Form Input</h3>
                
            </div>
      </div>
    );
  }
export default EventSetup;