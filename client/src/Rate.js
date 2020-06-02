import React, { Component } from 'react';
import './css/Rate.css';

const urlWss = process.env.REACT_APP_WSS_URL;
const client = new WebSocket(urlWss);

class Rate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            currentRateData: null
        };
    }

    componentWillUnmount() {
        client.close();
    }

    componentDidMount() {
        client.onopen = () => {
            if (this.props.CurrentRate !== null) {
                client.send(this.state.currentRate);
            }
        };

        client.onmessage = (event) => {

            this.setState({
                currentRateData: JSON.parse(event.data),
                isShow: true
            });
        }

        client.onerror = (event) => {
            console.log(event);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.CurrentRate !== prevProps.CurrentRate && this.props.CurrentRate !== null) {
            client.send(this.props.CurrentRate);
        }
    }

    render() {
        if (this.state.isShow) {
            return <div className="rateMain">
                <div className="jumbotron pb-1">
                    <h1 className="display-8">Rate of {this.state.currentRateData.Name}</h1>
                    <hr className="my-4"></hr>
                    <div className="ml-3">
                        <p className="lead font-weight-bold">Code:<span className="font-weight-light ml-1">{this.state.currentRateData.CharCode}</span></p>
                        <p className="lead font-weight-bold">Name:<span className="font-weight-light ml-1">{this.state.currentRateData.Name}</span></p>
                        <p className="lead font-weight-bold">Price in rubles:<span className="font-weight-light ml-1">{this.state.currentRateData.Value}&nbsp;&#8381;</span></p>
                        <div className="alert alert-primary w-50 text-center h2" role="alert">
                            {this.state.currentRateData.Previous}<svg className="bi bi-arrow-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd" />
                            </svg>
                            {this.state.currentRateData.Value}
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