import React from 'react';
import Header from "./components/Header";
import Main from "./components/Main";
import { Container } from '@material-ui/core';

function App() {

  return (
    <div >
      <Header className="App-header" />
      <Container align="center"  component="main" >
        <Main />
      </Container>
    </div>
  );

}

export default App;
