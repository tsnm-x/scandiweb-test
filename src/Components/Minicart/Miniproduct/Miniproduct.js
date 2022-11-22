import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cartActions } from '../../../store/cart';
import "./Miniproduct.scss"

class Miniproduct extends Component{

    constructor(){
        super();

        this.state = {}
    }

    componentDidMount(){
        if(this.props?.product?.attributes){
            for(let key of Object.keys(this.props?.product?.attributes) ){
                if(key){
                    this.setState({[key]: this.props?.product?.attributes[key]})
                }
            }

            this.setState({
                propertyName: this.getProductCountPropertyName()
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
                propertyName: this.getProductCountPropertyName()
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

    render(){
        return (
            <div className='normal-d-flex custom-justify-evenly'>
                <div className='custom-col-5'>
                <div className=' custom-mb-1 capitalize'>{this.props?.product?.product?.brand}</div>
                    <div className='custom-light capitalize'>{this.props?.product?.product?.name}</div>
                    <div className='custom-pt-1 custom-pb-1'>
                        {this.getCurrency() ? `${this.getCurrency()?.currency?.symbol}${this.getCurrency()?.amount}` : `${this?.props?.currency?.currency}0.00`}
                    </div>
                    {this.props?.product?.product?.attributes?.map((attr, idx) => {
                        return(
                            <div key={idx}>
                                {attr?.name !== 'Color' ? (
                                    <div className='d-flex-column custom-align-between custom-mb-1' style={{gridGap: '0.5rem'}}>
                                        <div className='custom-light capitalize'>{attr?.name}:</div>
                                        <div className='normal-d-flex custom-col-12'>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className='normal-d-flex custom-justify-center custom-p-2 custom-align-center custom-border-black-1 custom-text-center' 
                                                        style={{ backgroundColor: `${this.state[attr?.name] === item?.displayValue ? 'black': 'white'}`, color: `${this.state[attr?.name] === item?.displayValue ? 'white': 'black'}`, width: `25%`, marginRight: '0.12rem', fontSize: `${item?.displayValue?.length > 4 ? '0.47rem' : '0.8rem'} ` }}
                                                    >
                                                        {item?.displayValue}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='d-flex-column custom-align-between' style={{gridGap: '0.5rem'}}>
                                        <div className='custom-light capitalize'>Color:</div>
                                        <div className='normal-d-flex '>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={` ${this.state[attr?.name] === item?.displayValue ? 'custom-border-green-1': ''} color-configuration`} 
                                                        style={{marginRight: '0.10rem'}}
                                                    >
                                                        <div style={{width: '3vh', height: '3vh', backgroundColor: `${item?.value}`, border: `${item?.displayValue === 'White' ? '1px solid grey' : ''}`}}></div>
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
                <div className='custom-col-1 d-flex-column custom-align-center custom-justify-between'>
                    <div 
                        className='normal-d-flex custom-justify-center custom-light custom-align-center custom-border-black-1 custom-cursor-pointer custom-text-center custom-text-6'
                        style={{
                            height: '25px',
                            width: '25px'
                        }}
                        onClick={() => this.increment()}
                    >
                        +
                    </div>
                    <div className='custom-text-center'>
                        {
                            this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`)) ?
                            this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`))[
                                Object.keys(this?.props?.cart?.productsCount?.find((countObj) => Object.keys(countObj)[0].includes(`${this.state.propertyName}`)))[0]
                            ] : 0
                        }
                    </div>
                    <div 
                        className='normal-d-flex custom-justify-center custom-light custom-align-center custom-border-black-1 custom-cursor-pointer custom-text-center custom-text-6'
                        style={{
                            height: '25px',
                            width: '25px'
                        }}
                        onClick={() => this.decrement()}
                    >
                        -
                    </div>
                </div>
                <div className='custom-col-4'>
                    {this.props?.product?.product?.gallery[0] && <img
                        src={this.props?.product?.product?.gallery[0]}
                        className='custom-w-100'
                        style={{minHeight: "80%"}}
                        alt='productImg'
                    />}
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

export default connect(mapStateToProps, mapDispatchToProps)(Miniproduct);