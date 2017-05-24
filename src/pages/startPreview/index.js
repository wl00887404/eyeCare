import React, {Component} from 'react'
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import FadeInView from '../../components/fadeInView'

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 24,
        marginBottom:12
    }
})
export default class startPreview extends Component {
    toCameraPreview(){
        this.props.history.push("/cameraPreview")
    }
    render() {
        return (
            <FadeInView >
                <Text style={styles.text}>為了增加判斷精確度</Text>
                <Text style={styles.text}>請協助系統個人化偵測模組</Text>
                <View style={{marginTop:20}}>
                    <LoginButton onPress={this.toCameraPreview.bind(this)}>確定</LoginButton>
                </View>

            </FadeInView>
        )
    }
}


const LoginButton = ({children,onPress}) => {
    return (<View style={{flexDirection:"row"}}>
        <TouchableOpacity style={{
            flexDirection: "row",
            padding: 10,
            borderRadius: 4,
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3370c6",
            justifyContent: 'center'
        }} onPress={onPress}>
            <Text style={{
                color: "white",
                fontSize: 20,
            }}>{children}</Text>
        </TouchableOpacity></View>
    )
}
