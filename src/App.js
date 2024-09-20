import React from 'react';
import './assets/scss/themes.scss';
import Routes from './Routes';
import { DataProvider } from './DataContext';

// Fake Backend 
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
fakeBackend();

function App() {
  return (
    <DataProvider>
      <Routes />
    </DataProvider>
  );
}

export default App;
