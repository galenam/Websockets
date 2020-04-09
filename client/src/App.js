import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";


const client = new W3CWebSocket("ws://127.0.0.1:5000/ws");

class App extends Component {
  componentDidMount() {
    client.onopen = () => {
      console.log("websocket open")
    };

    client.onmessage = (event) => {
      console.log(event.data);
    }
  }

  componentWillUnmount() {
    console.log('close1');
    client.close();
    console.log('close2');
  }
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    const text = event.target.value;
    console.log('text=' + text);
    this.setState({ text: text });

    if (client.readyState == client.OPEN) {
      client.send(text);
    }
    else {
      console.log('just connecting');
    }
  }

  render() {
    return <div>
      <header >
        <input type='text' value={this.state.text} onChange={this.handleChange}></input>
      </header>
    </div >;
  };
}

export default App;
