import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contactUs'), formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form: ', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <>
    <div className="container">
    <div className="contact-us-page">
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>Email, call, or complete the form to learn how Evento can solve your messaging problem.</p>
        <p>info@Evento.com</p>
        <p>321-221-231</p>
        <a href="#">Customer Support</a>
        <div className="support-info">
          <div>
            <h3>Customer Support</h3>
            <p>Our support team is available around the clock to address any concerns or queries you may have.</p>
          </div>
          <div>
            <h3>Feedback and Suggestions</h3>
            <p>We value your feedback and are continuously working to improve Evento. Your input is crucial in shaping the future of Evento.</p>
          </div>
          <div>
            <h3>Media Inquiries</h3>
            <p>For media-related questions or press inquiries, please contact us at media@Evento.com.</p>
          </div>
        </div>
      </div>
      <div className="contact-form-container">
        <div className="contact-us-card">
          <h2>Get in Touch</h2>
          <p>You can reach us anytime</p>
          {submitted ? (
            <p className="success-message">Successfully submitted. Shortly our team will be in contact with you.</p>
          ) : (
            <form onSubmit={handleSubmit} className="contact-us-form">
              <div className="form-group">
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="First name" />
                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required placeholder="Last name" />
              </div>
              <div className="form-group">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your email" />
              </div>
              <div className="form-group">
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" />
              </div>
              <div className="form-group">
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="How can we help?" maxLength="120"></textarea>
              </div>
              <button type="submit" className="submit-button">Submit</button>
              <p>By contacting us, you agree to our <a href="#">Terms of service</a> and <a href="#">Privacy Policy</a>.</p>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
   </>
  );
  
};

export default ContactUs;
