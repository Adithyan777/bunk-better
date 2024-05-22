import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Make sure to create a Navbar component

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
