import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer'id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src="" alt="Evento"/>
            <p>Evento provides platform to organise events participate in these events and win exciting prizes and a community froum where you can engage with community</p>
            <div className="footer-social-icons">
                <img src={assets.linkedin_icon} alt="" />
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
            </div>

        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link >Events</Link></li>
            <li><Link>Privacy-Policy</Link></li>
            <li><Link >About us</Link></li>
            </ul>

        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
            <li>+91 123456789</li>
            <li>contact@evento.com</li>
            </ul>
            
        </div>

      </div>
      <hr/>
      <p className="footer-copyright">copyright 2024 @evento.com-All Right Reserved.</p>
    </div>
  )
}

export default Footer
