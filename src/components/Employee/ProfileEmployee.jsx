import React from 'react';
import { FaUserTie } from "react-icons/fa";
import Header from "../../common/Header/Header";
import "./Profile.css";
import PreventNav from "../Functions/Navigate";

const ProfileEmployee = () => {
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("names");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");

    return (
        <>
            <PreventNav />
            <Header />
            <div className="profiler-header-container">
                <div className="profile-employee__container">
                    <div className="profile-employee__content">
                        <div className="profile-employee__header">
                            <FaUserTie className="profile-employee__header-icon" />
                            <h1 className="profile-employee__title">Profile</h1>
                        </div>
                        <div className="profile-employee__info">
                            <p className="p-text"><b className="b-text">Names:</b> {name}</p>
                            <p className="p-text"><b className="b-text">Last names:</b> {lastName}</p>
                            <p className="p-text"><b className="b-text">Username:</b> {username}</p>
                            <p className="p-text"><b className="b-text">E-mail:</b> {email}</p>
                            <p className="p-text"><b className="b-text">Phone:</b> {phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileEmployee;
