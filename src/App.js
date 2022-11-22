import './App.css';
import React, { Component } from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from "react-router-dom";
import PLP from './Pages/Category';
import PDP from './Pages/Product';
import Cart from './Pages/Cart';
import { history } from './history';

class App extends Component {
  render (){
    return(
      <HistoryRouter history={history}>
         <Routes>
            <Route exact path='/' element={<PLP/>} />
            <Route exact path='/product/:id' element={<PDP/>} />
            <Route exact path='/cart' element={<Cart/>} />
          </Routes>
      </HistoryRouter>
    )
  }
}

export default App;
