import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ToastMessage } from 'rimble-ui';

import { Drizzle } from "@drizzle/store";
import { DrizzleContext } from '@drizzle/react-plugin';
import drizzleOptions from './drizzle/drizzleOptions';
import { CallProvider } from './drizzle/calls';
import { ContractProvider } from './drizzle/drizzleContracts';

import OnBoardUser from './OnBoardUser';
import OnboardUser from './OnBoardUser';

const drizzle = new Drizzle(drizzleOptions);

ReactDOM.render(
  <React.StrictMode>
    <OnboardUser/>
    <ToastMessage.Provider ref={node => (window.toastProvider = node)} />

    <DrizzleContext.Provider drizzle={drizzle}>
      <ContractProvider>
        <CallProvider>
          <App />
        </CallProvider>
      </ContractProvider>
    </DrizzleContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();