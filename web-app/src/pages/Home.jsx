import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card.jsx";
import FLogo from '/Users/samio_ayman/FYP-Fuelnomic/web-app/src/assets/FuelnomicLogo.png'

function Home() {
  return (
    <div className="app-container">
    
      <Card>
        <img className="getstarted-logo" src={FLogo} alt="F Logo" />
        
      <Link to="/login">
      <button className="getstarted-button">Login</button>
      </Link>

        <h4>Don't have an account?</h4>
        <Link to="/register">
        Register</Link>
      <br></br>
      
      
      </Card>
      
      
    </div>
  );
}

export default Home;
