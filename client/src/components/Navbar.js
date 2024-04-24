import React, { useState, Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar"
import "../App.css";

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

export function DoctorSidebar(props) {
  return (
    <aside
      id="sidebar"
      class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div class="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div
          href="#"
          class="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-clipboard-plus"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 14h6" />
            <path d="M12 17v-6" />
          </svg>{" "}
          <span class="ml-3 text-base font-semibold">Health Journal</span>
        </div>
        <ul class="space-y-2 text-sm font-medium">
          <li>
            <Link to="/doctor-ui/">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 lucide lucide-home"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">Home</span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/doctor-ui/create-time-slot">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 lucide lucide-users"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">
                  Create Time Slot
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/doctor-ui/view-unverified-chatbot">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-bot-message-square"
                >
                  <path d="M12 6V2H8" />
                  <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                  <path d="M2 12h2" />
                  <path d="M9 11v2" />
                  <path d="M15 11v2" />
                  <path d="M20 12h2" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">
                  Verify Chatbot Messages
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/doctor-ui/settings">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 lucide lucide-settings"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">Settings</span>
              </a>
            </Link>
          </li>
        </ul>
        <div class="mt-auto flex">
          <div class="flex w-full justify-between">
            <div>
              <Avatar>
                <AvatarImage src={props.pfp} alt="profile-pic" />
                <AvatarFallback>HJ</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-1 w-7/12 truncate">
              <span class="text-xs font-medium text-black dark:text-white">
                {props.userEmail}
              </span>
            </div>
            <svg
              onClick={props.logOut}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-log-out"
              style={{ cursor: "pointer" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function PatientSidebar(props) {
  return (
    <aside
      id="sidebar"
      class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div class="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div
          href="#"
          class="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-clipboard-plus"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 14h6" />
            <path d="M12 17v-6" />
          </svg>{" "}
          <span class="ml-3 text-base font-semibold">Health Journal</span>
        </div>
        <ul class="space-y-2 text-sm font-medium">
          <li>
            <Link to="/patient-ui">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 lucide lucide-home"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">Home</span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/patient-ui/view-appointments">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>
                <span class="ml-3 flex-1 whitespace-nowrap">
                  View Appointments
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/patient-ui/view-doctors">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-medical"><path d="M12 11v4" /><path d="M14 13h-4" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M18 6v14" /><path d="M6 6v14" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>
                <span class="ml-3 flex-1 whitespace-nowrap">
                  View Doctors
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link to="/patient-ui/settings">
              <a
                href="#"
                class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 lucide lucide-settings"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span class="ml-3 flex-1 whitespace-nowrap">Settings</span>
              </a>
            </Link>
          </li>
        </ul>
        <div class="mt-auto flex">
          <div class="flex w-full justify-between">
            <div>
              <Avatar>
                <AvatarImage src={props.pfp} alt="profile-pic" />
                <AvatarFallback>HJ</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-1 w-7/12 truncate">
              <span class="text-xs font-medium text-black dark:text-white">
                {props.userEmail}
              </span>
            </div>
            <svg
              onClick={props.logOut}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-log-out"
              style={{ cursor: "pointer" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
