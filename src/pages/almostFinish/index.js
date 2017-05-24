import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity,AsyncStorage,BackAndroid} from 'react-native'
import FadeInView from '../../components/fadeInView'
import CameraModule from '../../components/cameraModule'
import {connect} from 'react-redux'

class AlmostFinish extends Component {
    render() {
        return (
            <FadeInView style={{
                width:320,
            }}>
                <View style={{
                    marginBottom:20
                }}>
                    <Text style={{
                        fontSize: 30,
                        color: "white",
                        textAlign: "center",
                    }}>快完成了</Text>
                </View>
                <SpreadText>所有「魔法」皆會自動在背景執行</SpreadText>
                <SpreadText>您可以隨時開啟程式監控使用狀況</SpreadText>
                <View style={{
                    marginTop: 30,
                    flexDirection:'row'
                }}>
                    <Button onPress={this.onClick.bind(this)}>我知道了！</Button>
                </View>
            </FadeInView>
        )
    }
    onClick(){
        AsyncStorage.setItem("no Introduce","true")
        AsyncStorage.setItem("isRecording","true")
        AsyncStorage.setItem("startTime",new Date())

        // console.warn(this.props.threshold)
        CameraModule.setThreshold(this.props.threshold)
        CameraModule.setUser("hGod")
        CameraModule.setIndex(0)
        CameraModule.startBackgroundCamera()
        BackAndroid.exitApp()
        //this.props.history.push("/record")
    }
}

const mapToStore=(store)=>{
    return {
        threshold:store.threshold
    }
}
export default connect(mapToStore)(AlmostFinish)

const SpreadText = ({children}) => {
    let t = children.split("").map((t, i) => (
        <Text key={i} style={{
            fontSize: 20,
            color: "white",
        }}>{t}
        </Text>
    ))
    return (
        <View style={{
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "space-between",
        }}>{t}</View>
    )
}

const Button = ({children,onPress}) => {
    return (
        <TouchableOpacity style={{
            flexDirection: "row",
            padding: 10,
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3370c6",
            justifyContent: 'center',
            borderRadius: 4,
        }} onPress={onPress}>
            <Text style={{
                color: "white",
                fontSize: 20
            }}>{children}</Text>
        </TouchableOpacity>
    )
}
