import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cartActions } from '../../../store/cart';
import CartOrderBtn from '../CartOrderBtn/CartOrderBtn';
import CartProduct from '../CartProduct/CartProduct';

class CartProductList extends Component{

    constructor(props){
        super(props);

        this.state = {}
    }

    render(){
        return (
            <div className='d-flex-column custom-col-11' style={{gridGap: '3rem'}}>
                <div className='uppercase custom-text-6 custom-mt-8' style={{fontWeight: '600'}}>Cart</div>
                <div>
                    {this?.props?.cart?.products?.map((product, index) => {
                        return(
                            <div key={index} className='custom-border-t-grey-1 custom-pt-5 custom-pb-5'>
                                <CartProduct product={product}/>
                            </div>
                        )
                    })}
                    <div className='custom-border-t-grey-1 custom-pt-5 custom-pb-5'>
                        <CartOrderBtn cartDetails={this?.props?.cart} currency={this?.props?.currency?.currency}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CartProductList);