import React, {PropTypes} from 'react';
import {
    NativeModules,
    requireNativeComponent,
    View,
    UIManager,
    findNodeHandle,
} from 'react-native';

var iface = {
    name: 'CameraPreview',
    propTypes: {
        ...View.propTypes, // include the default view properties
        onChangeMessage: React.PropTypes.func,
        user:React.PropTypes.string
    }
}

class MyCameraPreview extends React.Component {
    render() {
        return (
            <CameraPreview {...this.props} onChange={this._onChange.bind(this)}></CameraPreview>
        )
    }
    constructor() {
        super();
        this._onChange = this._onChange.bind(this);
    }
    _onChange(event : Event) {
        if (!this.props.onChangeMessage) {
            return;
        }
        else{
            this.props.onChangeMessage(event.nativeEvent);
            return;
        }

    }
    takePicture() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.CameraPreview.Commands.takePicture, [],)
    }
    test() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.CameraPreview.Commands.test, [],)
    }
}

MyCameraPreview.propTypes = {
    ...View.propTypes,
    onChangeMessage: React.PropTypes.func,
    user:React.PropTypes.string
}

let CameraPreview = requireNativeComponent('CameraPreview', iface);

export default MyCameraPreview;
