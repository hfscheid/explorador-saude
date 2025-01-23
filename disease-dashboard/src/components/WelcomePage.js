import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <div style={{ padding: '20px', paddingTop: '0px', height: '100%' }}>
            <h1>Welcome to the Health Dashboard</h1>
            <p>
                This project is part of a university initiative to visualize and analyze
                health data for the state of Minas Gerais. Explore the map, historical
                trends, and detailed tables.
            </p>
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    );
}

export default WelcomePage;
