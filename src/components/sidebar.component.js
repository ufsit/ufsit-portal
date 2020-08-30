import React from 'react';
import 'react-router-dom';
import { Link } from 'react-router-dom';
import '../App.css'

export default class Sidebar extends React.Component {
  render() {
    return (
      <ul className="nav flex-column nav-tabs">
        <li className="navbar-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="#" className="nav-link">Attendance</Link>
        </li>
        <li className="navbar-item">
          <Link to="#" className="nav-link">Alerts</Link>
        </li>
      </ul>
    );
  }
}