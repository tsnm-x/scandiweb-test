import React, { Component } from "react";
import Header from "../Components/Header/HeaderComponent";
import ProductList from "../Components/ProductList/productList";


class PLP extends Component{

    constructor(){
        super();

        this.state={
            cartDropDown: false
        }
    }

    render() {
       

        return(
            <div className="d-flex-column custom-align-center custom-overflow-x-hidden">
                <Header cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
                <ProductList setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
            </div>
        )
    }
}

export default PLP;