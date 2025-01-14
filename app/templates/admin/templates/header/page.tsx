import React from 'react';
import '../../../styles/header.css';  

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
        <div className="logo-container">
            <img src="/images/logo.png" alt="Logo" className="logo-img" />
            <h1 className="logo-text">Gestión de Soporte</h1>
        </div>

        <div className="nav-container">
            <button className="logout-btn">Logout</button>
        </div>
        </div>
        
      
    </header>
  );
};

export default Header;