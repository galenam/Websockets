import React, { Component } from 'react';
import Rate from './Rate.js';
import Fetch from './Connection';

import 'bootstrap/dist/css/bootstrap.css';
import './css/List.css';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rates: null,
            isLoaded: false,
            error: null,
            currentRate: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const url = process.env.REACT_APP_API_URL;

        Fetch(url)
            .then(result => {
                let list = [<option value="" key="">Choose the rate</option>];
                list = list.concat(result.map(value => <option value={value} key={value}>{value}</option>));
                this.setState(
                    {
                        rates: list,
                        isLoaded: true
                    }
                )
            },
                error => {
                    console.log(error);
                    this.setState({
                        isLoaded: false,
                        error: error
                    })
                })
    };

    handleChange(event) {
        const text = event.target.value;
        if (text !== null) {
            this.setState({
                currentRate: text
            });
        }
    };

    render() {
        return <div>
            <div className="listMain">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="inputGroupSelect01">Currencies</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect01" onChange={this.handleChange}>
                        {this.state.rates}
                    </select>
                </div>
            </div>
            <Rate CurrentRate={this.state.currentRate}></Rate>
        </div>;
    }
}
export default List;