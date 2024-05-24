import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import CustomFooter from './CustomFooter';


const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <CustomFooter/>
    </div>
  );
};

export default MainLayout;
