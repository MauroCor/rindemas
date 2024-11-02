import React, { Component } from 'react';
import './App.css';
import { FixedCostComponent } from './components/FixedCostComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <FixedCostComponent />
      </div>
    );
  }
}

export default App;
