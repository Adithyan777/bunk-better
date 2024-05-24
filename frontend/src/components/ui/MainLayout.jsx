import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import CustomFooter from './CustomFooter';


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <CustomFooter />
    </div>
  );
};

export default MainLayout;