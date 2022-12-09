import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cartActions } from '../../../store/cart';
import './CartOrderBtn.scss'

class CartOrderBtn extends Component{

    constructor(props){
        super(props);

        this.state = {}
    }

    getCurrency(){
        if(this.props?.cartDetails?.totalPrice){
            
            for(let key of Object.keys(this.props?.cartDetails?.totalPrice)){
                if(key === this.props?.currency){
                    return {
                        amount: this.props?.cartDetails?.totalPrice[key],
                        symbol: key
                    }
                }
            }
        }

        return null;
    }

    clearCart(){
        this.props?.setCart(
            {
                products: [],
                productsCount: [],
                prices: {},
                totalPrice: {},
                count: 0
            }
        )
    }

    render(){
        return (
            <div className='custom-text-4 custom-text-style'>
                <div className='custom-mb-3 normal-d-flex'>
                    <div className='custom-light custom-me-1'>Tax 21%: </div>
                    <div className="amount">{this.getCurrency() ? `${this.getCurrency()?.symbol}${(this.getCurrency()?.amount * (21 / 100)).toFixed(2) }` : `${this?.props?.currency}0.00`}</div>
                </div>
                <div className='custom-mb-3 normal-d-flex'>
                    <div className='custom-light custom-me-1'>Quantity: </div>
                    <div className="amount">{this?.props?.cartDetails?.count}</div>
                </div>
                <div className='custom-mb-3 normal-d-flex'>
                    <div className='custom-light custom-me-1'>Total: </div>
                    <div className="amount">
                    {this.getCurrency() ? `${this.getCurrency()?.symbol}${(this.getCurrency()?.amount).toFixed(2)}` : `${this?.props?.currency}0.00`}
                    </div>
                </div>
                <div>
                <button 
                    disabled={!this?.props?.cartDetails?.count} 
                    className={`order-btn custom-w-20 custom-p-3 custom-text-center uppercase ${this?.props?.cartDetails?.count ? "custom-cursor-pointer" : ""} ${this?.props?.cartDetails?.count ? 'active-order' : 'inactive-order'} roboto-font `}
                    onClick={() => this.clearCart()}
                >
                    order
                </button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCart: cart => dispatch(cartActions.setCart(cart))
    }
}

export default connect(null, mapDispatchToProps)(CartOrderBtn);