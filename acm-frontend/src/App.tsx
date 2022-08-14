import React from 'react';
import './App.css';
import { LoginForm } from './components/Form';

function App() {
  const shouldRender = true;
  return (
    <div className="App">
      <header className="App-header">

        {<LoginForm></LoginForm>}
      </header>
    </div>
  );
}

export default App;
