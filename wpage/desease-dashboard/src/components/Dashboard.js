// Import necessary modules
import React from 'react';
import MapComponent from './MapComponent';
import ChartComponent from './ChartComponent';
import TableComponent from './TableComponent';

function Dashboard() {
  return (
      <div style={{ padding: '20px', paddingTop: '0px' }}>
          <h1>Dashboard</h1>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
              <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                  <MapComponent />
              </div>
              <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                  <TableComponent />
              </div>
          </div>
          <div style={{ height: '400px', width: '100%', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
              <ChartComponent containerStyle={{ height: '100%', width: '100%' }} />
          </div>
      </div>
  );
}

export default Dashboard;
