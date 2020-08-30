import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//import Sidebar from './components/sidebar.component';
import Login from './components/login.component';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Login} />
        {/* <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />*/}
      </div>
    </Router>
  );
}

export default App;
