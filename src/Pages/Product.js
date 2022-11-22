import React, { Component } from "react";
import Header from "../Components/Header/HeaderComponent";
import ProductCarousel from "../Components/ProductDetails/ProductCarousel/ProductCarousel";
import ProductOptions from "../Components/ProductDetails/ProductOptions/ProductOptions";
import queries from "../enums/queries";
import { getData } from "../network/ApolloClient";


class PDP extends Component{

    constructor(){
        super();

        this.state={
            cartDropDown: false,
            id: '',
            product: {}
        }
    }

    async componentDidMount(){
        const id = window.location.pathname.split("/")[2];
        const productQuery = queries.product(id)
        const product = await getData(productQuery);

        this.setState({
            id: id,
            product: product?.data?.product
        })
    }

    
    render() {
        return(
            <div className="d-flex-column custom-align-center custom-overflow-x-hidden">
                <Header cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/>
                <div className="normal-d-flex custom-mt-8 custom-pt-5 custom-pb-5 custom-justify-evenly">
                    <div className="custom-col-7"><ProductCarousel product={this.state.product}/></div>
                    <div className="custom-col-4"><ProductOptions product={this.state.product} cartDropDown={this.state.cartDropDown} setCartDropDown={(newVal) => this.setState({cartDropDown: newVal})}/></div>
                </div>
            </div>
        )
    }
}

export default PDP;