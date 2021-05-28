import React,{useEffect,createContext,useReducer,useContext} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
 
} from "react-router-dom";
import Home from './components/screens/Home'; 
import Signup from './components/screens/Signup'; 
import Solo from './components/screens/Solo'; 
import ScriptTag from 'react-script-tag';

import './App.css'


const Routing = () => 
{
  const history = useHistory()
  
  return (
    <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/signup">
      <Signup />
    </Route>
    <Route exact path="/solo">
      <Solo />
    </Route>

    </Switch>
  ); 
 
}


function App() {
  return (
      <Router>
        
        <div className="myApp">
          {/* <Navbar />
          <Sidenav /> */}
          <Routing />
        </div>
      </Router>
  );
}

export default App;

