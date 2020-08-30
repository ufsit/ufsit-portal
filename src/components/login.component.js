import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../App.css';

export default class Login extends React.Component {
  render() {
    return (
      <div className="container">
        <img src={process.env.PUBLIC_URL + '/sit.png'} className="logo-login"/>
        <h1>UFSIT Portal</h1>
        <form className="col">
          <div className="row">
            <input type="text" placeholder="Username"/>
          </div>
          <div className="row">
            <input type="password" placeholder="Password"/>
          </div>
          <div className="row">
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
    );
  }
}
