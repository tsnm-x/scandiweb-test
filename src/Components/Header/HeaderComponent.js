import React, { Component } from "react";
import "./Header.scss";
import logo from "../../assets/a-logo.png"
import cart from "../../assets/Empty Cart.png"
import Minicart from "../Minicart/MinicartComponent"
import { getData } from "../../network/ApolloClient";
import queries from "../../enums/queries"
import { categoryActions } from "../../store/selectedCategory"
import { connect } from 'react-redux' 
import { currencyActions } from "../../store/selectedCurrency";
import { history } from "../../history";

class Header extends Component{

    constructor(props){
        super(props);

        this.headerRef = React.createRef();
        this.logoRef = React.createRef();
        this.currencyRef = React.createRef();
        this.overlayRef = React.createRef();
        this.handleClickOutsideCart = this.handleClickOutsideCart.bind(this);
        this.handleClickOutsideCurrency = this.handleClickOutsideCurrency.bind(this);

        this.state = {
            categories: [],
            currencies: [],
            currencyDropDown: false,
            selectedCurrency: '',
            selectedCategory: ''
        }
    }

    async componentDidMount() {

        const categoriesData = await getData(queries.categories);
        const currenciesData = await getData(queries.currencies);

        this.setState({
            categories: categoriesData?.data?.categories,
            currencies: currenciesData?.data?.currencies
        })
        

        if(!this.props?.category?.category){
            this.setState({
                selectedCategory: categoriesData?.data?.categories[0]?.name
            })
            this.props?.setCategory(categoriesData?.data?.categories[0]?.name)
        } else {
            this.setState({
                selectedCategory: this.props?.category?.category
            })
        }

        if(!this.props?.currency?.currency){
            this.setState({
                selectedCurrency: currenciesData?.data?.currencies[0]?.symbol
            })
            this.props?.setCurrency(currenciesData?.data?.currencies[0]?.symbol)
        } else {
            this.setState({
                selectedCurrency: this.props?.currency?.currency
            })
        }

        document.addEventListener("mousedown", this.handleClickOutsideCart);
        document.addEventListener("mousedown", this.handleClickOutsideCurrency);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutsideCart);
        document.removeEventListener("mousedown", this.handleClickOutsideCurrency);
    }

    activateCurrencyDropDown = () => {
        this.setState({currencyDropDown: !this.state.currencyDropDown})
        this.props.setCartDropDown(false)
    }

    activateCartDropDown = () => {
        this.props.setCartDropDown(!this.props.cartDropDown)
        this.setState({currencyDropDown: false})
    }

    selectCurrency = (currency) => {
        this.setState({selectedCurrency: currency})
        this.props?.setCurrency(currency)
        this.setState({currencyDropDown: !this.state.currencyDropDown})
    }

    handleClickOutsideCart(event) {
        if ((this.overlayRef && this.overlayRef.current?.contains(event.target)) || (this.headerRef && this.headerRef.current?.contains(event.target)) || (this.logoRef && this.logoRef.current?.contains(event.target))) {
            this.props.setCartDropDown(false)
        }
    }

    handleClickOutsideCurrency(event) {
        if (this.currencyRef && !this.currencyRef.current?.contains(event.target)) {
            this.setState({currencyDropDown: false})
        }
    }

    setCategory(category){
        this.props?.setCategory(category)
        this.setState({selectedCategory: category});
        window.location.pathname !== "/" && history.push("/")
    }
    
    render() {
        return (
            <>
                { this.props.cartDropDown && 
                    <div className='custom-z-index-10 custom-w-100 custom-h-100 custom-position-fixed' style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}} ref={this.overlayRef}></div>
                }
                <div className={`nav-container custom-bg-white custom-z-index-10 ${this.props.cartDropDown? 'custom-border-b-grey-1': ''}`}>
                    <div className="normal-d-flex custom-col-4 custom-ms-6 custom-mt-3 custom-ps-6 custom-text-style custom-normal-weight" ref={this.props.cartDropDown? this.headerRef : null}>
                        {this.state.categories.map((category, index) =>{
                            return (
                                <div key={index} className={`nav-option custom-ps-1 custom-pe-1 custom-cursor-pointer custom-ms-1 custom-me-1 ${this.state.selectedCategory === category?.name? "active-category": ""}`} tabIndex="0" onClick={() => this.setCategory(category?.name)}>
                                    {category?.name}
                                </div>
                            )
                        })}
                    </div>
                    <div className="custom-col-4 custom-mt-1 custom-justify-center" ref={this.props.cartDropDown? this.logoRef : null}>
                        <div>
                            <img
                                src={logo}
                                alt="logo"
                            />
                        </div>
                    </div>
                    <div className="custom-col-4 custom-justify-end custom-me-6 custom-mt-3 custom-pe-6">
                        <div className="custom-text-style custom-normal-weight">
                            <span style={{marginRight: '0.25rem'}}>{this.state.selectedCurrency}</span>
                        </div>
                        <div className="custom-position-relative custom-text-style" ref={this.currencyRef}>
                            <i className={`fa-solid ${this.state.currencyDropDown? "fa-angle-up":"fa-angle-down"} custom-cursor-pointer custom-me-4 custom-text-2`} onClick={() => this.activateCurrencyDropDown()}></i>
                            {this.state.currencyDropDown && 
                                (<div className="custom-position-absolute custom-top-80 custom-bg-white custom-reverse-left-65 custom-pt-1 custom-pb-1 custom-shadow" style={{width: '6.5vw'}}>
                                    {this.state.currencies.map((currency, index) => {
                                        return (
                                            <div key={index} className={`normal-d-flex custom-justify-center custom-dropdown-option custom-p-1 custom-cursor-pointer ${this.state.selectedCurrency === currency.symbol && 'selected-currency'}`} tabIndex="1" onClick={() => this.selectCurrency(currency.symbol)}>
                                                <span style={{marginRight: '0.25rem'}}>{currency?.symbol}</span> {currency.label}
                                            </div>
                                        )
                                    })}
                                </div>)
                            }
                        </div>
                        <div className="custom-position-relative">
                            <div className="custom-position-relative custom-cursor-pointer" ref={this.cartRef} onClick={() => this.activateCartDropDown()}>
                                <img src={cart} alt="cart" style={{marginTop: '0.14rem'}}/>
                                {this.props?.cart?.count ? <div 
                                    className="custom-rounded custom-position-absolute custom-reverse-top-25 custom-left-65 normal-d-flex custom-justify-center custom-align-center" 
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        height: '20px',
                                        width: '20px',
                                        fontSize: '0.60rem'
                                    }}
                                >
                                    {this?.props?.cart?.count}
                                </div> : null}
                            </div>
                            {
                                this.props.cartDropDown && 
                                <Minicart/>
                            }
                            
                        </div>
                        
                    </div>
                </div>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        category: state.category,
        currency: state.currency,
        cart: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCategory: category => dispatch(categoryActions.setCategory(category)),
        setCurrency: currency => dispatch(currencyActions.setCurrency(currency))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);