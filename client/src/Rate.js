import React, { Component } from 'react';

class Rate extends Component {
    render() {

        if (this.props.IsShow) {
            return <div>
                <div className="Name">Code:<span>{this.props.Value.CharCode}</span></div>
                <div className="Name">Name:<span>{this.props.Value.Name}</span></div>
                <div className="Name">Code:<span>{this.props.Value.Value}</span></div>
            </div>
        }
        else {
            return null;
        }
    }
}

export default Rate;