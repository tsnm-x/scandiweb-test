import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cartActions } from '../../../store/cart';
import "./CartProduct.scss"

class CartProduct extends Component{
    constructor(props){
        super(props);

        this.state = {
            selectedImg: "",
            selectedImgIndex: 0
        }
    }

    componentDidMount(){
        if(this.props?.product?.attributes){
            for(let key of Object.keys(this.props?.product?.attributes) ){
                if(key){
                    this.setState({[key]: this.props?.product?.attributes[key]})
                }
            }

            this.setState({
                propertyName: this.getProductCountPropertyName(),
                selectedImg: this.props?.product?.product?.gallery[0],
                selectedImgIndex: 0
            })
        }

        
    }

    componentDidUpdate(prevProps){
        if(this.props?.product?.attributes && (this?.props?.product?.attributes !== prevProps?.product?.attributes || this?.props?.product?.product?.id !== prevProps?.product?.product?.id)){
            for(let key of Object.keys(this.props?.product?.attributes)){
                if(key){
                    this.setState({[key]: this.props?.product?.attributes[key]})
                }
            }

            this.setState({
                propertyName: this.getProductCountPropertyName(),
                selectedImg: this.props?.product?.product?.gallery[0],
                selectedImgIndex: 0
            })
        }

    }

    getCurrency(){
        if(this.props?.cart?.prices){

            const prices = 
            Object.keys(this.props?.cart?.prices)
            .filter((key) => key.includes(this.props?.product?.product?.id))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                  [key]: this.props?.cart?.prices[key]
                });
            }, {});
            
            for(let price of prices[this.props?.product?.product?.id]){
                if(price?.currency?.symbol === this.props?.currency?.currency){
                    return price
                }
            }
        }

        return null;
    }

    getProductCountPropertyName(){
        let propertyName = `${this.props?.product?.product?.id}`;

        for(let attr of Object.keys(this.props?.product?.attributes)){
            propertyName =  propertyName + `-${this.props?.product?.attributes[attr]}`
        }

        return propertyName;
    }

    findIntendedProduct(productsCount){

        const propertyName = this.getProductCountPropertyName()

        const product = productsCount?.find(
            (countObj) => 
            Object.keys(countObj)[0]
            .includes(`${propertyName}`)
        ) ? productsCount?.find(
            (countObj) => 
            Object.keys(countObj)[0]
            .includes(`${propertyName}`)
        ) : {}

        return product
    }

    getIncrementedTotalPrice(productPrices){
        let totalPrice = {};

        for(let price of productPrices){
            const finder = Object.keys(this.props?.cart?.totalPrice).find((key) => key === price?.currency?.symbol)?
            Object.keys(this.props?.cart?.totalPrice).find((key) => key === price?.currency?.symbol): null;

            if(finder){
                totalPrice = {...totalPrice, [price?.currency?.symbol]: this.props?.cart?.totalPrice[price?.currency?.symbol] + price?.amount}
            } else {
                totalPrice = {...totalPrice, [price?.currency?.symbol]: price?.amount}
            }
        }

        return totalPrice;
    }

    getDecrementedTotalPrice(productPrices){
        let totalPrice = {};

        for(let price of productPrices){
            const finder = Object.keys(this.props?.cart?.totalPrice).find((key) => key === price?.currency?.symbol)?
            Object.keys(this.props?.cart?.totalPrice).find((key) => key === price?.currency?.symbol): null;

            if(finder){
                const newTotalPrice =  this.props?.cart?.totalPrice[price?.currency?.symbol] - price?.amount
                totalPrice = {...totalPrice, [price?.currency?.symbol]:newTotalPrice < 0 ? 0 : newTotalPrice}
            } 
        }

        return totalPrice;
    }

    calculateIncrementedProductCount(productsCount){

        const propertyName = this.getProductCountPropertyName()

        const foundProduct = this.findIntendedProduct(productsCount)

        let product = {
            [propertyName]: foundProduct[Object.keys(foundProduct)[0]] + 1
        }

        const newProductCount = productsCount?.filter((productObj) => Object.keys(productObj)[0] !== propertyName)

        return [
            ...newProductCount,
            product
        ]
    }

    calculateDecrementedProductCount(productsCount){

        const propertyName = this.getProductCountPropertyName()

        const foundProduct = this.findIntendedProduct(productsCount)

        let product = {
            [propertyName]: foundProduct[Object.keys(foundProduct)[0]] - 1
        }

        const newProductCount = productsCount?.filter((productObj) => Object.keys(productObj)[0] !== propertyName)

        return [
            ...newProductCount,
            product
        ]
    }

    checkAttriubes(finder){

        let isFound = false

        

        if(!isFound){
            const similarities = []

            for(let attr of Object.keys(finder?.attributes)){
                if(finder?.attributes[attr] === this.props?.product?.attributes[attr] ){
                    similarities.push({[attr]: this.props?.product?.attributes[attr]})
                }
            }

            if(similarities.length === Object.keys(finder?.attributes).length && finder?.product?.id === this?.props?.product?.product?.id){
                isFound = true
            } else {
                isFound = false
            }
        }

        return isFound
    }

    increment(){
        let count = this?.props?.cart?.count + 1;
        let productsCount = this.calculateIncrementedProductCount(this.props.cart?.productsCount);
        let totalPrice = this.getIncrementedTotalPrice(this.props?.product?.product?.prices);

        this.props?.setCart(
            {
                ...this?.props?.cart,
                count,
                productsCount,
                totalPrice
            }
        )
    }

    decrement(){
        let count = this?.props?.cart?.count - 1;
        let productsCount = this.calculateDecrementedProductCount(this.props.cart?.productsCount);
        let totalPrice = this.getDecrementedTotalPrice(this.props?.product?.product?.prices);
        const propertyName = this.getProductCountPropertyName()

        let finder = productsCount?.find((productObj) => Object.keys(productObj)[0].includes(`${propertyName}`)) ? 
        productsCount?.find((productObj) => Object.keys(productObj)[0].includes(`${propertyName}`)) : {}


        if(finder[propertyName] > 0){
            this.props?.setCart(
                {
                    ...this?.props?.cart,
                    count,
                    productsCount,
                    totalPrice
                }
            )
        } else {

            const newCartProducts = this.props?.cart?.products?.filter(
                (productObj) => !this.checkAttriubes(productObj)
            )
            const newProductCount = this.props?.cart?.productsCount?.filter((productObj) => Object.keys(productObj)[0] !== propertyName)
            
            const newPrices = 
            newCartProducts.find((productObj) => productObj?.product?.id === this?.props?.product?.product?.id) ?
            this?.props?.cart?.prices :
            Object.keys(this?.props?.cart?.prices)
            .filter((key) => !key.includes(`${this?.props?.product?.product?.id}`))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: this.props?.cart?.prices[key]
                });
            }, {});

            this.props?.setCart(
                {
                    products: [...newCartProducts],
                    productsCount: [...newProductCount],
                    prices: {...newPrices},
                    count,
                    totalPrice
                }
            )
        }

        
    }

    selectImgForward(){
        if(this.state?.selectedImgIndex < (this.props?.product?.product?.gallery?.length - 1)){
            this.setState({
                selectedImg: this.props?.product?.product?.gallery[this.state?.selectedImgIndex + 1],
                selectedImgIndex: this.state?.selectedImgIndex + 1
            })
        } else {
            this.setState({
                selectedImg: this.props?.product?.product?.gallery[0],
                selectedImgIndex: 0
            })
        }
    }

    selectImgBackward(){
        if(this.state?.selectedImgIndex > 0){

            this.setState({
                selectedImg: this.props?.product?.product?.gallery[this.state?.selectedImgIndex - 1],
                selectedImgIndex: this.state?.selectedImgIndex - 1
            })

        } else {
            this.setState({
                selectedImg: this.props?.product?.product?.gallery[this.props?.product?.product?.gallery?.length - 1],
                selectedImgIndex: this.props?.product?.product?.gallery?.length - 1
            })
        }
    }

    render(){
        return (
            <div className='normal-d-flex custom-justify-between'>
                <div className='custom-col-5'>
                    <div className='custom-mb-3 custom-text-style'>
                        <div className='custom-text-6 custom-mb-1'>{this.props?.product?.product?.brand}</div>
                        <div className='custom-text-6 custom-light'>{this.props?.product?.product?.name}</div>
                    </div>
                    <div className='custom-pt-1 custom-pb-1 custom-text-5 custom-mb-3 custom-text-style amount'>
                        {this.getCurrency() ? `${this.getCurrency()?.currency?.symbol}${this.getCurrency()?.amount}` : "-"}
                    </div>
                    <div className='d-flex-column gridGap-attribute'>
                    {this.props?.product?.product?.attributes?.map((attr, idx) => {
                        return(
                            <div key={idx}>
                                {attr?.name !== 'Color' ? (
                                    <div className='d-flex-column custom-align-between custom-text-style gridGap-item'>
                                        <div className='custom-normal-weight uppercase roboto-condensed-font attr-fontSize'>{attr?.name}:</div>
                                        <div className='normal-d-flex custom-col-12'>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={`normal-d-flex custom-justify-center custom-w-15 custom-p-2 custom-align-center custom-border-black-1 custom-me-2 custom-text-center ${this.state[attr?.name] === item?.displayValue ? 'selected': 'unselected'}`} 
                                                    >
                                                        {item?.displayValue}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='d-flex-column custom-align-between custom-text-style gridGap-item'>
                                        <div className='custom-normal-weight uppercase roboto-condensed-font attr-fontSize'>Color:</div>
                                        <div className='normal-d-flex '>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={` ${this.state[attr?.name] === item?.displayValue ? 'custom-border-green-1': ''} color-configuration custom-me-1`} 
                                                    >
                                                        <div className={`color-attr ${item?.displayValue === 'White' ? 'color-border' : ''}`} style={{ backgroundColor: `${item?.value}`}}></div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            }
                            </div>
                        )
                    })}
                    </div>
                </div>
                
                <div className='custom-col-3 normal-d-flex custom-justify-between custom-position-relative'>
                    <div className='custom-col-2 d-flex-column custom-align-center custom-justify-between custom-text-style custom-me-2'>
                        <div 
                            className='normal-d-flex custom-justify-center custom-light custom-align-center custom-border-black-1 custom-cursor-pointer custom-text-center custom-text-7 increment-decrement-cart-product'
                            onClick={() => this.increment()}
                        >
                            +
                        </div>
                        <div className='custom-text-center custom-text-4'>
                            {
                                this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`)) ?
                                this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`))[
                                    Object.keys(this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`)))[0]
                                ] : 0
                            }
                        </div>
                        <div 
                            className='normal-d-flex custom-justify-center custom-light custom-align-center custom-border-black-1 custom-cursor-pointer custom-text-center custom-text-7 increment-decrement-cart-product'
                            onClick={() => this.decrement()}
                        >
                            -
                        </div>
                    </div>
                    {this.state.selectedImg && 
                    <div className="product-img d-flex-column custom-align-center custom-justify-center">
                        <img
                            src={this.state.selectedImg}
                            className='custom-w-100'
                            alt='productImg'
                        />
                    </div>}
                    {this.props?.product?.product?.gallery?.length > 1 && <div className='custom-position-absolute custom-top-90 custom-left-80 normal-d-flex'>
                        <div 
                            className='normal-d-flex custom-justify-center custom-align-center custom-cursor-pointer custom-z-index-2' 
                            style={{
                                width: "25px", 
                                height: "25px", 
                                backgroundColor: "rgba(0, 0, 0, 0.7)", 
                                marginRight: "0.25rem", 
                                color: "white"
                            }}
                            onClick={() => this.selectImgForward()}
                        >
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.75 1.06857L6.375 6.6876L0.75 12.3066" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div 
                            className='normal-d-flex custom-justify-center custom-align-center custom-cursor-pointer custom-z-index-2' 
                            style={{
                                width: "25px", 
                                height: "25px", 
                                backgroundColor: "rgba(0, 0, 0, 0.7)", 
                                color: "white"
                            }}
                            onClick={() => this.selectImgBackward()}
                        >
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.25 1.06857L1.625 6.6876L7.25 12.3066" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currency: state.currency,
        cart: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCart: cart => dispatch(cartActions.setCart(cart))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct);