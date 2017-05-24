import React, {Component} from 'react';
import {Text, View, StyleSheet, Image,} from 'react-native';

const styles = StyleSheet.create({
    bgImg: {
        //opacity:0.6,
        flex: 1,
        width: null,
        height: null,
    },
    bgImgContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor:"black"
    },
})

class AragakiYui extends Component {
    render() {
        let opacity=this.props.opacity
        if(!opacity){
            opacity=1
        }
        return (
            <View style={styles.bgImgContainer}>
                <Image style={[styles.bgImg,{opacity}]} source={require('./bg.jpg')}/>
            </View>
        )
    }
}
export default AragakiYui
