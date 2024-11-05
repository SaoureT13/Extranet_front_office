// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect
import Breadcrumb from './Breadcrumb'

const AppMenu = () => {

  const breadcrumbItems = [
    { label: 'Home', url: 'demo1.html' },
    // { label: 'edmond', url: 'demo1.html' },
    // { label: 'Products' }
  ];
  
  return (
    <nav className="breadcrumb-nav container">
            <Breadcrumb items={breadcrumbItems} />
            

      {/* <ul className="product-nav list-style-none">
        <li className="product-nav-prev">
          <a href="#">
            <i className="w-icon-angle-left" />
          </a>
          <span className="product-nav-popup">
            <img
              src="assets/images/products/product-nav-prev.jpg"
              alt="Product"
              width={110}
              height={110}
            />
            <span className="product-name">Soft Sound Maker</span>
          </span>
        </li>
        <li className="product-nav-next">
          <a href="#">
            <i className="w-icon-angle-right" />
          </a>
          <span className="product-nav-popup">
            <img
              src="assets/images/products/product-nav-next.jpg"
              alt="Product"
              width={110}
              height={110}
            />
            <span className="product-name">Fabulous Sound Speaker</span>
          </span>
        </li>
      </ul> */}
    </nav>

  );
};

export default AppMenu;
