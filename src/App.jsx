import React from 'react';
import './App.css';
import Header from "./components/Header";
import Main from "./components/Main";
import { Container } from '@material-ui/core';

function App() {

  return (
    <div className="App">
      <Header className="App-header" />
      <Container>
        <Main />
      </Container>
    </div>
  );

}

export default App;
