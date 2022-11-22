import React, { Component } from 'react';

class ProductCarousel extends Component{

    constructor(){
        super();

        this.state = {
            selectedImg: null
        }
    }

    componentDidMount(){
        this.props?.product?.gallery && this.setState({selectedImg: this.props?.product?.gallery[0]}) 
    }

    componentDidUpdate(prevProps){
        if(this.props?.product?.gallery && this.props?.product?.id !== prevProps?.product?.id){
            this.setState({selectedImg: this.props?.product?.gallery[0]}) 
        }
    }

    render(){
        return (
            <div className='normal-d-flex custom-justify-evenly'>
                <div className='custom-col-2 d-flex-column'>
                    {this.props?.product?.gallery?.map((photo, idx) => {
                        return (
                            <div key={idx} className='custom-mb-5 custom-cursor-pointer'>
                                <img
                                    src={photo}
                                    alt="mainImg"
                                    className='custom-w-50'
                                    onClick={() => this.setState({selectedImg: photo})}
                                />
                            </div>
                        )
                    })}
                    
                </div>
                <div className='custom-col-9'>
                    {this.state.selectedImg && 
                        <img
                            src={this.state.selectedImg}
                            alt="mainImg"
                            className='custom-w-100'
                        />
                    }
                </div>
            </div>
        )
    }
}

export default ProductCarousel;