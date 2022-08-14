import React from 'react';
import { Hello } from './components/Hello';
import './App.css';

function App() {
  const shouldRender = true;
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          {shouldRender && <Hello extraText='hello' extra={5}></Hello>}
        </a>
      </header>
    </div>
  );
}

export default App;
