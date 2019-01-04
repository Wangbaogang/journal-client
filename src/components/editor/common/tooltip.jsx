import React, { Component } from 'react'
import ReactDOM from 'react-dom'

let instance = null

class Tooltip extends Component {
    render() {
        return <div className="journal-tooltip" onClick={this.onClick} style={this.props.style}>
            {this.props.children}
        </div>
    }
    onClick = (evt) =>{
        this.props.onClick && this.props.onClick(evt)
    }
}

Tooltip.hide = function() {
    instance && instance.remove()
}

Tooltip.show = function (props, container) {
    Tooltip.hide();
    let element = React.createElement(
        Tooltip,
        props
    )
    instance = container
    ReactDOM.render(element, container)
    return instance
}




export default Tooltip