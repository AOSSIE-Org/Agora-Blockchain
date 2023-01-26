import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import OnboardUser from './OnBoardUser';

ReactDOM.render(
  <React.StrictMode>
    <OnboardUser/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);