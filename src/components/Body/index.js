
import React, { Component } from 'react';

class Body extends Component {
    state = {  }
    render() { 
        return (  
            <div className="container-fluid p-3" >
                { this.props.children }
            </div>
        );
    }
}
 
export default Body;
