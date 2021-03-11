import Header from './components/Headers';
import React, { Component } from 'react';
import Body from './components/Body';
import Footer from './components/Footer';
import Moment from 'moment';
import EventSetup from './components/EventSetup';
import Broadcast from './components/Broadcast';
import Subscribers from './components/Subscribers';
import Settings from './components/Settings';
import PageNotFound from "./components/PageNotFound";

import {
  Switch,
  Route
} from "react-router-dom";



class App extends Component {
  constructor () {
    super();
    this.state = {
      today: Moment().format('DD MMM YYYY, HH:mm:ss')
    }
    this.updateTime = this.updateTime.bind(this);
    this.intNum = 0; //interval ID
  }

  updateTime () {
    this.setState({ today : Moment().format('DD MMM YYYY - HH:mm:ss') })
  } 

  componentDidMount () {
   this.intNum =  setInterval(this.updateTime, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.intNum)
  }

  render() { 
    return ( 
      <div className="container-fluid">
        <Header />
        <Body>
          <Switch>
              <Route exact path='/' component={EventSetup} />
              <Route exact path='/broadcast' component={Broadcast} />
              <Route exact path='/subscribers' component={Subscribers} />
              <Route exact path='/settings' component={Settings} />
              <Route component={PageNotFound} />
          </Switch>
        </Body>
        <Footer>{this.state.today}</Footer>
      </div>
     );
  }
}
 
export default App;