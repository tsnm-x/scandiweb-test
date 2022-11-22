import React, { Component } from 'react';
import './ProductOptions.scss';
import { connect } from 'react-redux' ;
import { cartActions } from '../../../store/cart';

class ProductOptions extends Component{

    constructor(props){
        super(props);

        this.state = { }
    }

    componentDidMount(){
        if(this.props?.product?.attributes){
            for(let attr of this.props?.product?.attributes ){
                if(attr?.items && attr?.items[0]){
                    this.setState({[attr?.name]: attr?.items[0]?.displayValue})
                }
            }
        }
    }

    componentDidUpdate(prevProps){
        if(this.props?.product?.attributes && this?.props?.product?.id !== prevProps?.product?.id){
            for(let attr of this.props?.product?.attributes ){
                if(attr?.items && attr?.items[0]){
                    this.setState({[attr?.name]: attr?.items[0]?.displayValue})
                }
            }
        }
    }

    changeState(attr, item){
        this.setState({[attr?.name]: item?.displayValue})
    }

    getCurrency(){
        if(this.props?.product?.prices){
            for(let price of this.props?.product?.prices){
                if(price?.currency?.symbol === this.props?.currency?.currency){
                    return price
                }
            }
        }

        return null;
    }

    checkAttriubes(finders){

        let isFound = false

        for(let finder of finders){
            if(!isFound){
                const similarities = []

                for(let attr of Object.keys(finder?.attributes)){
                    if(finder?.attributes[attr] === this.state[attr] ){
                        similarities.push({[attr]: this.state[attr]})
                    }
                }

                if(similarities.length === Object.keys(finder?.attributes).length){
                    isFound = true
                } else {
                    isFound = false
                }
            }
        }

        return isFound
    }

    getProductCountPropertyName(){
        let propertyName = `${this.props?.product?.id}`;

        for(let attr of Object.keys(this.state)){
            propertyName =  propertyName + `-${this.state[attr]}`
        }

        return propertyName;
    }

    findIntendedProduct(productsCount){

        const products = productsCount?.filter(
            (countObj) => 
            Object.keys(countObj)[0]
            .includes(`${this.props?.product?.id}`)
        )

        for(let product of products){

            let similarities = []

            for(let attr of Object.keys(this.state)){
                if(Object.keys(product)[0].includes(this.state[attr])){
                    similarities.push(this.state[attr])
                }
            }

            if(similarities.length === Object.keys(this.state).length){
                return product
            }
        }

        return {}
    }

    calculateProductCount(productsCount, hasSameAttr){

        const propertyName = this.getProductCountPropertyName()
        let product = {}

        if(!hasSameAttr){

            product = {
                [propertyName]: 1
            }
            
        } else {
            const foundProduct = this.findIntendedProduct(productsCount)

            product = {
                [propertyName]: foundProduct[Object.keys(foundProduct)[0]] + 1
            }
            
        }

        const newProductCount = productsCount?.filter((productObj) => Object.keys(productObj)[0] !== propertyName)

        return [
            ...newProductCount,
            product
        ]
    }

    getNewTotalPriceObj(productPrices){
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

    addToCart(){

        const finder = this.props?.cart?.products?.filter((product) => product?.product?.id === this.props?.product?.id);
        let products = [];
        let productsCount = [];
        let prices = {};
        const totalPrice = this.getNewTotalPriceObj(this.props?.product?.prices);
        const count = this.props.cart.count + 1;

        if(finder[0]){

            const hasSameAttr = this.checkAttriubes(finder)

            products = !hasSameAttr ? [
                ...this.props.cart.products,
                {
                    product: this.props?.product,
                    attributes: {...this.state}
                }
            ] : this.props.cart.products

            productsCount = this.calculateProductCount(this.props.cart?.productsCount, hasSameAttr)

            prices = this.props.cart.prices;
    
        } else {
            products = [
                ...this.props.cart.products,
                {
                    product: this.props?.product,
                    attributes: {...this.state}
                }
            ]

            productsCount = this.calculateProductCount(this.props?.cart?.productsCount, false);

            prices = {
                ...this.props?.cart?.prices,
                [this.props?.product?.id]: this.props?.product?.prices
            }
        }

        this.props?.setCart({
            products,
            productsCount,
            prices,
            totalPrice,
            count
        });

        this?.props?.setCartDropDown(
            {cartDropDown: true}
        )

    }

    render(){
        return (
            <div className='custom-text-style'>
                <div className='custom-mb-7'>
                    <div className='custom-text-6 custom-mb-1 capitalize'>{this.props?.product?.brand}</div>
                    <div className='custom-text-6 custom-light capitalize'>{this.props?.product?.name}</div>
                </div>
                <div className='d-flex-column custom-mb-6' style={{gridGap: '1.5rem'}}>
                    {this.props?.product?.attributes?.map((attr, idx) => {
                        return(
                            <div key={idx}>
                                {attr?.name !== 'Color' ? (
                                    <div className='d-flex-column custom-align-between' style={{gridGap: '0.5rem'}}>
                                        <div className='custom-normal-weight uppercase roboto-condensed-font' style={{fontSize: '1.20rem'}}>{attr?.name}:</div>
                                        <div className='normal-d-flex custom-col-12'>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className='normal-d-flex custom-justify-center custom-w-20 custom-p-2 custom-align-center custom-border-black-1 custom-cursor-pointer custom-me-2 custom-text-center' 
                                                        style={{ backgroundColor: `${this.state[attr?.name] === item?.displayValue ? 'black': 'white'}`, color: `${this.state[attr?.name] === item?.displayValue ? 'white': 'black'}` }}
                                                        onClick={() => this.changeState(attr, item)}
                                                    >
                                                        {item?.displayValue}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='d-flex-column custom-align-between' style={{gridGap: '0.5rem'}}>
                                        <div className='custom-normal-weight uppercase roboto-condensed-font' style={{fontSize: '1.20rem'}}>Color:</div>
                                        <div className='normal-d-flex '>
                                            {attr?.items?.map((item, index) => {
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={` ${this.state[attr?.name] === item?.displayValue ? 'custom-border-green-1': ''} color-configuration custom-me-1 custom-cursor-pointer`} 
                                                        onClick={() => this.setState({[attr?.name]: item?.displayValue})}
                                                    >
                                                        <div style={{width: '4vh', height: '4vh', backgroundColor: `${item?.value}`, border: `${item?.displayValue === 'White' ? '1px solid grey' : ''}`}}></div>
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
                <div className='custom-mb-6'>
                    <div className='custom-normal-weight custom-mb-3 uppercase roboto-condensed-font' style={{fontSize: '1.20rem'}}>Price:</div>
                    <div className='custom-normal-weight custom-text-4'>{this.getCurrency() ? `${this.getCurrency()?.currency?.symbol}${this.getCurrency()?.amount}` : "-"}</div>
                </div>
                <div className='custom-mb-6'>
                    <button 
                        disabled={!this.props?.product?.inStock} 
                        style={{fontSize: '1.05rem', backgroundColor: `${this.props?.product?.inStock? '#5ECE7B' : '#aee6bd'}`}} 
                        className={`add-to-cart-btn custom-col-8 custom-p-3 custom-text-center uppercase ${this.props?.product?.inStock ? 'custom-cursor-pointer': ''} roboto-font`}
                        onClick={() => this.addToCart()}
                    >
                        add to cart
                    </button>
                </div>
                <div className='custom-col-8 custom-mb-6 roboto-font'>
                    <div style={{fontSize: '1.05rem'}}>
                        <div dangerouslySetInnerHTML={{ __html: this.props?.product?.description ? this.props?.product?.description : "" }} />
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductOptions);