import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet,AsyncStorage,BackAndroid} from 'react-native'
import CameraModule from '../../components/cameraModule'


let fontSize = 16
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: fontSize*4,
        width:320,
        // justifyContent: "space-around",
        // alignSelf: "stretch",
        // alignItems:"",
        position: "relative",
    },
    h1: {
        fontSize: 2 *fontSize,
        lineHeight: 2.5 *fontSize,
    },
    h2: {
        fontSize: 1.5 *fontSize,
        lineHeight: 2.5 *fontSize,
    },
    white: {
        color: "white"
    }
})

export default class Main extends Component {
    constructor(props) {
        super(props)
    }
    toRecord() {
        this.props.history.push('/record')
    }
    toSettings(){
        this.props.history.push('/settings')
    }
    onClick(){
        AsyncStorage.setItem("isRecording","true")
        AsyncStorage.setItem("startTime",new Date())
        CameraModule.startBackgroundCamera()
        BackAndroid.exitApp()
        //this.props.history.push("/record")
    }
    render() {
        return (
            <View style={styles.container}>
                <Row style={{
                    justifyContent: "space-between",
                    marginBottom:5*fontSize
                }}>
                    <Row>
                        <H1>愛眼</H1>
                        <H2 style={{marginLeft:0.8*fontSize}}>lovEye</H2>
                    </Row>
                    <H2>ver 0.0.8.7</H2>
                </Row>

                    <LoginButton style={{marginBottom:30}} onPress={this.onClick.bind(this)}>開始下一次歷程</LoginButton>
                    <LoginButton style={{marginBottom:30}}>觀看歷史紀錄</LoginButton>
                    <LoginButton style={{marginBottom:30}} onPress={this.toSettings.bind(this)} >設定</LoginButton>

                {/* <TouchableOpacity onPress={this.toRecord.bind(this)}><Text style={{color:"white"}}>正在紀錄</Text></TouchableOpacity> */}
            </View>
        )
    }
}

const Row = ({children, style}) => {
    return (
        <View style={[
            {
                flexDirection: "row"
            },
            style,
        ]}>
            {children}
        </View>
    )
}

const H1 = ({children, style}) => {
    return (
        <Text style={[styles.h1, styles.white, style,]}>
            {children}
        </Text>
    )
}
const H2 = ({children, style}) => {
    return (
        <Text style={[styles.h2, styles.white, style,]}>
            {children}
        </Text>
    )
}

const Span = ({children, style}) => {
    return (
        <Text style={[styles.white, style,]}>{children}</Text>
    )
}
const LoginButton = ({children,onPress,style}) => {
    return (<View style={[{flexDirection:"row"},style]}>
        <TouchableOpacity style={{
            flexDirection: "row",
            padding: 10,
            borderRadius: 4,
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3a7edf",
            justifyContent: 'center'
        }} onPress={onPress}>
            <Text style={{
                color: "white",
                fontSize: 20,
            }}>{children}</Text>
        </TouchableOpacity></View>
    )
}
