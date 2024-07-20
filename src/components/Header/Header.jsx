import React from 'react';
import Card from './Card';
import './Header.css';

const Header = () => {
  return (
    <div className="main-page">
        <div className="main-page-content">
            <div className="heading-container">
                <h1>Host, Participate, Learn</h1>
                <p>Explore opportunities to learn, showcase skills, and participate in events  win exciting rewards</p>
            </div>
            <div className="cards-container">
                <Card
                    title="Dashboard"
                    description="View your dashboard"
                    imgSrc="https://cdn-icons-png.flaticon.com/512/6821/6821002.png"
                    link="/dashboard"
                />
                <Card
                    title="Profile"
                    description="Manage your profile"
                    imgSrc="https://cdn-icons-png.freepik.com/512/3135/3135768.png"
                    link="/profile"
                />
                <Card
                    title="Host"
                    description="Host an event"
                    imgSrc="https://www.pngitem.com/pimgs/m/462-4623510_host-icon-120170926-2578-j6zkdv-circle-hd-png.png"
                    link="/host"
                />
            </div>
        </div>
    </div>
);
};

export default Header;
