import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import Footer from './components/Footer/Footer'
import { AuthProvider } from './components/AuthContext/AuthContext';
import HostEventPage from './pages/HostEventPage/HostEventPage'
import EventDetails from './pages/HostEventPage/EventDetails'
import EditProfilePage from './pages/Profile/EditProfilePage'
import ProfilePage from './pages/Profile/ProfilePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ContactUs from './pages/ContactUs/ContactUs'
import AdminPage from './pages/Admin/Admin'

const App = () => {
  
  return (
    <>
    
    <div className='app'>
    <AuthProvider>
      <Navbar />
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/host' element={<HostEventPage/>} />
      <Route path="/event-details/:eventId" element={<EventDetails />} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/edit-profile" element={<EditProfilePage/>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/admin" element={<AdminPage />} />
      </Routes>
      </AuthProvider>
    </div>
    <Footer/>
    </>
  )
}

export default App
