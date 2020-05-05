import React, { Component } from 'react';
import Rate from './Rate.js';

const client = new WebSocket("wss://localhost:5001/ws");

class List extends Component {
    componentWillUnmount() {
        client.close();
    }

    constructor(props) {
        super(props);
        this.state = {
            rates: null,
            isLoaded: false,
            error: null,
            currentRate: null,
            showRate: false
        }
        this.handleChange = this.handleChange.bind(this);
    }
    // todo: api url to the config
    componentDidMount() {
        client.onopen = () => {
            console.log("websocket open")
        };

        client.onmessage = (event) => {

            this.setState({
                currentRate: JSON.parse(event.data),
                showRate: true
            });
        }

        client.onerror = (event) => {
            console.log(event);
        }

        fetch("https://localhost:5001/api/rateexchange")
            .then(res => res.json())
            .then(result => {
                this.setState(
                    {
                        rates: result.map(value => <option value={value} key={value}>{value}</option>),
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
    }

    handleChange(event) {
        const text = event.target.value;
        if (text !== null) {
            client.send(text);
        }
    }

    render() {
        return <div><select onChange={this.handleChange}>
            {this.state.rates}
        </select>
            <Rate Value={this.state.currentRate} IsShow={this.state.showRate}></Rate>
        </div>
    }
}
export default List;