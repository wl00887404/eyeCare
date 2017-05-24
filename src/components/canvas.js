import React, {PropTypes} from 'react';
import {
    NativeModules,
    requireNativeComponent,
    View,
    UIManager,
    findNodeHandle,
} from 'react-native';
var iface = {
    name: 'Canvas',
    propTypes: {
        ...View.propTypes // include the default view properties
    }
}

let Canvas = requireNativeComponent('Canvas', iface);

class MyCanvas extends React.Component {
    render() {
        return (
            <Canvas {...this.props} onChange={this._onChange.bind(this)}></Canvas>
        )
    }
    _onChange(event : Event) {
        if (!this.props.onChangeMessage) {
            return;
        } else {
            this.props.onChangeMessage(event.nativeEvent);
        }
    }
    parseRGBA(rgba) {
        let result = rgba.match(/\d+/g)
        let r = parseInt(result[0])
        let g = parseInt(result[1])
        let b = parseInt(result[2])
        let a
        if (rgba.match(/\./) != null) {
            a = parseFloat(rgba.match(/\.\d+/)[0])
        } else {
            a = parseFloat(result[3])
        }
        return {r, g, b, a,}
    }
    set fillStyle(value) {
        this._fillStyle = value
    }
    getContext() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.getContext, [],)
        return this
    }
    set fillStyle(rgba) {
        let {r, g, b, a,} = this.parseRGBA(rgba)
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.fillStyle, [
            r, g, b, a,
        ],)

    }
    set strokeStyle(rgba) {
        let {r, g, b, a,} = this.parseRGBA(rgba)
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.strokeStyle, [
            r, g, b, a,
        ],)
    }
    set lineWidth(l) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.lineWidth, [parseFloat(l)],)
    }
    fillRect(x, y, width, height) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.fillRect, [
            x, y, width, height,
        ],)
    }
    strokeRect(x, y, width, height) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.strokeRect, [
            x, y, width, height,
        ],)
    }
    clearRect(x, y, width, height) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.clearRect, [
            x, y, width, height,
        ],)
    }
    fill() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.fill, [],)
    }
    stroke() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.stroke, [],)
    }
    beginPath() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.beginPath, [],)
    }
    moveTo(x, y) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.moveTo, [
            parseFloat(x), parseFloat(y),
        ],)
    }
    lineTo(x, y) {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.lineTo, [
            parseFloat(x), parseFloat(y),
        ],)
    }
    endPath() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.endPath, [],)
    }
    finish() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.finish, [],)
    }
    reset() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.Canvas.Commands.reset, [],)
    }
}

MyCanvas.propTypes = {
    ...View.propTypes
}

export default MyCanvas;
