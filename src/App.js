import React, { Component } from 'react';
import './App.css';
import AddScreen from './pages/AddScreen';

class App extends Component {
  render() {
    return (
      <div className="dark">
        <AddScreen />
      </div>
    );
  }
}

export default App;