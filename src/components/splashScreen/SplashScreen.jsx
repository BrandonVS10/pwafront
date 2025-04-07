import React, { useState, useEffect } from "react";
import logo from '../../imgs/bolas1.png';
import './SplashScreen.css';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 3000);
  }, []);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
      <img src={logo} alt="Logo" className="splash-logo" />
      <h1 className="splash-text">Bienvenido 🚀</h1>
    </div>
  );

};

export default SplashScreen;