import React, { Component } from 'react';
import './ProductCard.scss'
import cartImg from '../../assets/cart-product-card.png'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux' 
import { cartActions } from '../../store/cart';

class ProductCard extends Component {

    constructor(props){
        super(props);

        this.state = {
            viewCartIcon: false
        }
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

    checkAttriubes(finders, newStateObj){

        let isFound = false

        for(let finder of finders){
            if(!isFound){
                const similarities = []

                for(let attr of Object.keys(finder?.attributes)){
                    if(finder?.attributes[attr] === newStateObj[attr] ){
                        similarities.push({[attr]: newStateObj[attr]})
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

    getProductCountPropertyName(newStateObj){
        let propertyName = `${this.props?.product?.id}`;

        for(let attr of Object.keys(newStateObj)){
            propertyName =  propertyName + `-${newStateObj[attr]}`
        }

        return propertyName;
    }

    findIntendedProduct(productsCount, newStateObj){

        const products = productsCount?.filter(
            (countObj) => 
            Object.keys(countObj)[0]
            .includes(`${this.props?.product?.id}`)
        )

        for(let product of products){

            let similarities = []

            for(let attr of Object.keys(newStateObj)){
                if(Object.keys(product)[0].includes(newStateObj[attr])){
                    similarities.push(newStateObj[attr])
                }
            }

            if(similarities.length === Object.keys(newStateObj).length){
                return product
            }
        }

        return {}
    }

    calculateProductCount(productsCount, hasSameAttr, newStateObj){

        const propertyName = this.getProductCountPropertyName(newStateObj)
        let product = {}

        if(!hasSameAttr){

            product = {
                [propertyName]: 1
            }
            
        } else {
            const foundProduct = this.findIntendedProduct(productsCount, newStateObj)

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

        const newStateObj = 
        Object.keys(this.state)
        .filter((key) => !key.includes("viewCartIcon"))
        .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: this.state[key]
            });
        }, {});

        const finder = this.props?.cart?.products?.filter((product) => product?.product?.id === this.props?.product?.id);
        let products = [];
        let productsCount = [];
        let prices = {};
        const totalPrice = this.getNewTotalPriceObj(this.props?.product?.prices);
        const count = this.props.cart.count + 1;

        if(finder[0]){

            const hasSameAttr = this.checkAttriubes(finder, newStateObj)

            products = !hasSameAttr ? [
                ...this.props.cart.products,
                {
                    product: this.props?.product,
                    attributes: {...newStateObj}
                }
            ] : this.props.cart.products

            productsCount = this.calculateProductCount(this.props.cart?.productsCount, hasSameAttr, newStateObj)

            prices = this.props.cart.prices;
    
        } else {
            products = [
                ...this.props.cart.products,
                {
                    product: this.props?.product,
                    attributes: {...newStateObj}
                }
            ]

            productsCount = this.calculateProductCount(this.props?.cart?.productsCount, false, newStateObj);

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

        this.props.setCartDropDown(true)

    }

    render(){
        return (
            <div className={`custom-p-2 product-card custom-mb-4 custom-position-relative custom-text-style`}>
               { !this.props.product?.inStock && 
                    (<div className='custom-z-index-4 custom-position-absolute custom-w-100 custom-h-100 uppercase out-of-stock-text custom-text-5 custom-top-0 custom-left-0 normal-d-flex custom-justify-center custom-align-center' style={{backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
                        out of stock
                    </div>)
               }
                <div onMouseEnter={() => this.setState({viewCartIcon: true})} onMouseLeave={() => this.setState({viewCartIcon: false})}>
                    <Link to={`/product/${this.props.product?.id}`}><div className={`${this.props?.product?.inStock? 'custom-z-index-2' : 'custom-z-index-6'} custom-w-100 custom-h-100 custom-position-absolute`}></div></Link>
                    <div className='custom-mb-2 custom-w-100 '>
                        {this.props.product?.gallery && this.props.product?.gallery[0] && <img
                            src={this.props.product?.gallery[0]}
                            alt='product'
                            style={{width: '334px', height: '310px'}}
                        />}
                        {this.state.viewCartIcon && this.props.product?.inStock && <div className='custom-rounded popup-cart custom-position-absolute custom-justify-center custom-z-index-3' onClick={() => this.addToCart()}>
                            <img
                                src={cartImg}
                                alt={'cartImg'}
                                className='custom-w-60 custom-m-1'
                            />
                        </div>}
                    </div>
                    <div>
                        <div className='custom-light custom-mb-1'>{this.props.product?.brand} {" "} {this.props.product?.name}</div>
                        <div>{this.getCurrency() ? `${this.getCurrency()?.currency?.symbol}${this.getCurrency()?.amount}` : "-"}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);