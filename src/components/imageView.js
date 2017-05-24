//


import React, {PropTypes} from 'react';
import {
    NativeModules,
    requireNativeComponent,
    View,
    UIManager,
    findNodeHandle,
} from 'react-native';

var iface = {
    name: 'ImageView',
    propTypes: {
        ...View.propTypes,
        source:PropTypes.string
    }
}

class MyImageView extends React.Component {
    render() {
        return (
            <ImagePreview {...this.props} ></ImagePreview>
        )
    }
}

MyImageView.propTypes = {
    ...View.propTypes,
    source:PropTypes.string
}

let ImagePreview = requireNativeComponent('ImageView', iface);

export default MyImageView;
