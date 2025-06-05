import React from 'react';
import DashboardAppBar from './dComponents/dAppBar.jsx';
import DashboardDrawer from './dComponents/dDrawer.jsx';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardAppBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <DashboardDrawer />
        <main style={{ flex: 1, padding: 24, marginTop: 64 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}