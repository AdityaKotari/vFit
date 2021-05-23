import React,{useEffect,createContext,useReducer,useContext} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
 
} from "react-router-dom";
import Home from './components/screens/Home'; 



const Routing = () => 
{
  const history = useHistory()
  
  return (
    <Switch>
    <Route exact path="/">
      <Home />
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

