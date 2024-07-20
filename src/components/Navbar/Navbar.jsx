import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const { loginWithGoogle, logout } = useAuth();
  const [menu, setMenu] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='navbar'>
      <div className="navbar-container">
        <Link to='/'><img src="" alt="Evento" className="logo" /></Link>
        <ul className="navbar-menu">
          <li>
            <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          </li>
          <li>
            <a href='#events' onClick={() => setMenu("events")} className={menu === "events" ? "active" : ""}>Events</a>
          </li>
          <li>
            <a href='#communityforum' onClick={() => setMenu("CommunityForum")} className={menu === "CommunityForum" ? "active" : ""}>Community Forum</a>
          </li>
          <li>
            <a href='/contact-us' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
          </li>
        </ul>
        <div className="profile-menu">
          {user ? (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="profile-picture" />
              ) : (
                <div className="profile-placeholder">{user.displayName.charAt(0)}</div>
              )}
              <div className="profile-menu-content">
                <Link to='/profile'>Profile</Link>
                <Link to='/host'>Host Event</Link>
                <Link to='/dashboard'>Dashboard</Link>
                <a href='#' onClick={logout}>Logout</a>
              </div>
            </>
          ) : (
            <button onClick={loginWithGoogle} className="btn-primary">Login with Google</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
