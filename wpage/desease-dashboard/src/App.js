// Import necessary modules
import "leaflet/dist/leaflet.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import './App.css';

function Navbar() {
    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', padding: '10px', backgroundColor: '#d6e6f2', borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: 'black' }}>
                <span role="img" aria-label="home">🏠</span> Welcome
            </Link>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>
                <span role="img" aria-label="dashboard">📊</span> Dashboard
            </Link>
        </div>
    );
}
function App() {
    return (
                <Router>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex',paddingTop: '50px', flexDirection: 'column', backgroundColor: '#f0f9ff' }}>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
            </div>
        </div>
                </Router>
    );
}


export default App;
