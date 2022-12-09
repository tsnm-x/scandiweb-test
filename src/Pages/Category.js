import React, { Component } from "react";
import Header from "../Components/Header/HeaderComponent";
import ProductList from "../Components/ProductList/productList";


class PLP extends Component{

    constructor(){
        super();

        this.state={
            cartDropDown: false,
            disableCartIcons: false
        }
    }

    render() {
       

        return(
            <div className="d-flex-column custom-overflow-x-hidden">
                <Header setDisableCartIcons={(newVal) => this.setState({disableCartIcons: newVal})} cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
                <ProductList setDisableCartIcons={(newVal) => this.setState({disableCartIcons: newVal})} disableCartIcons={this.state.disableCartIcons} cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
            </div>
        )
    }
}

export default PLP;