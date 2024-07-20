import React from 'react'
import './Home.css'
import Header from '../Header/Header'
import CommunityForum from '../CommunityForum/CommunityForum'
import Events from '../Events/Events';
const Home = () => {


  return (
    <div>
         <Header/>
         <Events/>
         <CommunityForum/>
         
    </div>
  )
}

export default Home
