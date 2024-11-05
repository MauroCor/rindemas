import React, { Component } from 'react';
import './App.css';
import RouterConfig from './navegation/RouterConfig';

class App extends Component {
  render() {
    return (
      <div className="dark">
        <RouterConfig />
      </div>
    );
  }
}

export default App;