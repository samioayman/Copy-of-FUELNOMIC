import React from 'react'
import { Link } from 'react-router'
import Card from '../Card.jsx'
import FLogo from '../assets/FuelnomicLogo.png'


const GetStarted = () => {
  return (
    <div className="getstarted-container">
        <Card >
          <img className="getstarted-logo" src={FLogo} alt="F Logo" />
        <h1 className='getstarted-title'>Welcome to Fuelnomic</h1>
        <Link to="/login">
        <button className='getstarted-button'>Get Started</button>
        </Link>
        </Card>
        
        
    </div>
  )
}

export default GetStarted