import React, { useEffect, useState } from 'react';
import { crudData } from '../../services/apiService';
import StepWizard from 'react-step-wizard';
import Wizard from './Wizard'


const SaveClient = () => {


  return (
    <>
      <div id="otherpage">
        <div className="page-content container">
        <div className="page-header mb-5 mt-5">
            <div className="container">
              <h1 className="page-title mb-0">Inscription client</h1>
            </div>
          </div>
          <div className='bg-blue-light p-5'>
            <Wizard />
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveClient;
