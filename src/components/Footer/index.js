import React, { Component } from 'react';

class Footer extends Component {
    state = {  }
    render() { 
        return (  
            <div className="p-3 mb-2 bg-secondary text-white">
            { this.props.children }
            </div>
        );
    }
}
 
 
export default Footer;