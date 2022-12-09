import React, { Component } from "react";
import CartProductList from "../Components/Cart/CartProductList/CartProductList";
import Header from "../Components/Header/HeaderComponent";


class Cart extends Component{

    constructor(){
        super();

        this.state={
            cartDropDown: false
        }
    }

    render() {
        return(
            <div className="d-flex-column custom-align-center">
                <Header cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
                <CartProductList/>
            </div>
        )
    }
}

export default Cart;