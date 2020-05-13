import React, { Component } from 'react';
import './css/Rate.css';

class Rate extends Component {
    render() {

        if (this.props.IsShow) {
            return <div className="rateMain">
                <div className="jumbotron pb-1">
                    <h1 className="display-8">Rate of {this.props.Value.Name}</h1>
                    <hr className="my-4"></hr>
                    <div className="ml-3">
                        <p className="lead font-weight-bold">Code:<span className="font-weight-light ml-1">{this.props.Value.CharCode}</span></p>
                        <p className="lead font-weight-bold">Name:<span className="font-weight-light ml-1">{this.props.Value.Name}</span></p>
                        <p className="lead font-weight-bold">Price in rubles:<span className="font-weight-light ml-1">{this.props.Value.Value}&nbsp;&#8381;</span></p>
                        <div className="alert alert-primary w-50 text-center h2" role="alert">
                            {this.props.Value.Previous}<svg className="bi bi-arrow-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd" />
                            </svg>
                            {this.props.Value.Value}
                        </div>
                    </div>
                </div>
            </div>
        }
        else {
            return null;
        }
    }
}

export default Rate;