import React, { Component } from "react";
// import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "../App.css";
import logo from "../health-journal-high-resolution-logo-white.png";

export function HorizontalNavbar() {
  return (
    <div className="horizontal-navbar">
      <div className="navbar-logo">
        {/* <img className="img-logo" src={logo}></img> */}
        <p className="img-logo">Health Journal</p>
      </div>
      <div className="navbar-nav">
        <Link to="/home" className="nav-items">
          Home
        </Link>
        <Link to="/about" className="nav-items">
          About
        </Link>
        <Link to="/signin" className="nav-items">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-picture">
          <i className="fa fa-user-circle-o" />
        </div>
        <div className="profile-info">
          <i className="fa fa-users" />
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-home">
          <i className="fa fa-home" />
        </div>
        <div className="sidebar-settings">
          <i className="fa fa-cog" />
        </div>
        <div className="sidebar-logout">
          <i className="fa fa-sign-out" />
        </div>
      </div>
    </div>
  );
}
