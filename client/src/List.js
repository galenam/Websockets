import React, { Component } from 'react';
import Rate from './Rate.js';
import 'bootstrap/dist/css/bootstrap.css';
import './css/List.css';

const urlWss = process.env.REACT_APP_WSS_URL;
const client = new WebSocket(urlWss);
// todo : история просмотров курсов???
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
    // todo: delete redundant console.log
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
        const url = process.env.REACT_APP_API_URL;
        fetch(url)
            .then(res => {
                console.log(res);
                return res.json();
            })
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
            client.send(text);
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
            <Rate Value={this.state.currentRate} IsShow={this.state.showRate}></Rate>
        </div>;
    }
}
export default List;