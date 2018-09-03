/**
 * Button Component
 * Created by Alexey S. Kiselev
 */

import React, { Component } from 'react';

class Button extends Component {
    constructor(props) {
        super(props);
        let additionalClass = this.props.additionalClass || ''
        this._className = 'button ' + additionalClass;
    }

    render() {
        return (
            <div className={this._className} onClick={this.props.clickHandler}>
                {this.props.label}
            </div>
        );
    }
}

export default Button;
