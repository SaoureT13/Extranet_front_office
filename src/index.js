import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './contexts/ThemeContext';
import { HeaderProvider } from './contexts/HeaderContext';
 
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <HeaderProvider>
          <App />
      </HeaderProvider>
    </ThemeProvider>

  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
