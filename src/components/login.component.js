import React from 'react';
import {Form, Button} from 'react-bootstrap';
//import axios from 'axios';
import '../App.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isForLogin: true, // Sees if the component will send a login request
    };
  }

  login(username, password) {

  }

  render() {
    return (
      <div className="container">
        <img src={process.env.PUBLIC_URL + '/sit.png'} alt={"UFSIT LOGO"} className="logo-login" />
        <h1>UFSIT Portal</h1>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Control type="email" placeholder="Username" className="col-md-4 offset-sm-4" />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Control type="password" placeholder="Password" className="col-md-4 offset-sm-4" />
          </Form.Group>
          <Button variant="primary" type="submit">Log In</Button>
        </Form>
        <p>Register Here</p>
      </div>
    );
  }
}
