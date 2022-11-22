import React, { Component } from 'react';
import Miniproduct from './Miniproduct/Miniproduct';
import './Minicart.scss';
import { connect } from 'react-redux';
import { cartActions } from '../../store/cart';
import { Link } from 'react-router-dom';

class Minicart extends Component{

    constructor(props){
        super(props);

        this.state = {}
    }

    getCurrency(){
        if(this.props?.cart?.totalPrice){
            for(let key of Object.keys(this.props?.cart?.totalPrice)){
                if(key === this.props?.currency?.currency){
                    return {
                        amount: this.props?.cart?.totalPrice[key],
                        symbol: key
                    }
                }
            }
        }

        return null;
    }


    render(){
        return (
            <div className="custom-position-absolute custom-top-105 custom-bg-white custom-reverse-left-1600 custom-pt-2 custom-pb-2 custom-ps-1 custom-pe-1 custom-z-index-6 custom-text-style custom-normal-weight" style={{width: '25vw'}} >
                <div className='custom-m-3'>
                    <span className='custom-bold'>My Bag</span>, {`${this.props?.cart?.products?.length} ${this.props?.cart?.products?.length > 1 ? 'items' : 'item'}`}
                </div>
                <div style={{height: '53vh'}} id='products-container'>
                    {this?.props?.cart?.products?.map((product, index) => {
                        return (
                            <div key={index} className='custom-mb-4'><Miniproduct product={product}/></div>
                        )
                    })}
                </div>
                <div className='custom-m-3'>
                    <div className='custom-mb-2 normal-d-flex custom-justify-between custom-bold'>
                        <div>Total</div>
                        <div>{this.getCurrency() ? `${this.getCurrency()?.symbol}${(this.getCurrency()?.amount).toFixed(2)}` : `${this?.props?.currency?.currency}0.00`}</div>
                    </div>
                    <div className='normal-d-flex custom-justify-between'>
                        <Link to={"/cart"}>
                            <button 
                                className='view-bag-button custom-p-2 custom-ps-5 custom-pe-5 custom-text-center' 
                            >
                                VIEW BAG
                            </button>
                        </Link>
                        <button 
                            className='checkout-button custom-p-2 custom-ps-5 custom-pe-5 custom-text-center' 
                            disabled={!this?.props?.cart?.count}
                            style={{backgroundColor: `${this?.props?.cart?.count ? '#5ECE7B' : '#aee6bd'}`}}
                        >
                            CHECK OUT
                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Minicart);