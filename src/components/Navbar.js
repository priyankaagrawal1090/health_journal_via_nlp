import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import '../App.css'

export function HorizontalNavbar() {
  return (
    <nav className="horizontal-navbar">
      <li>
        {/* <Link to="/home" activeClassName='active'>Home</Link> */}
        Home
      </li>
      <li>
        {/* <Link to="/home" activeClassName='active'>Home</Link> */}
        About
      </li>
    </nav>
  )
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-picture"><i className="fa fa-user-circle-o"/></div>
        <div className="profile-info"><i className="fa fa-users"/></div>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-home"><i className="fa fa-home"/></div>
        <div className="sidebar-settings"><i className="fa fa-cog"/></div>
        <div className="sidebar-logout"><i className="fa fa-sign-out"/></div>
      </div>
    </div>
    // <nav className="Vertical-navbar">
    //   <ul className="vertical-navbar-ul">
    //     <li>
    //       {/* <Link to="/home" activeClassName='active'>Home</Link> */}
    //       Home
    //     </li>
    //     <li>
    //       {/* <Link to="/home" activeClassName='active'>Home</Link> */}
    //       About
    //     </li>
    //   </ul>
    // </nav>
  )
}

