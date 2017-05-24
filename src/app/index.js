import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'

import Test from '../pages/test'
import LinearGradient from 'react-native-linear-gradient';

import Welcome from '../pages/welcome'
import Introduce from '../pages/introduce'
import Login from '../pages/login'
import FbLogin from '../pages/fbLogin'
import startPreview from '../pages/startPreview'
import AutoModifySystem from '../pages/autoModifySystem'
import CameraPreview from '../pages/cameraPreview'
import CheckImage from '../pages/checkImage'

import BeforeAlmostFinish from '../pages/beforeAlmostFinish'
import AlmostFinish from '../pages/almostFinish'

import AragakiYui from "../pages/AragakiYui"

import Main from '../pages/main'
import Record from "../pages/recording"
import Settings from "../pages/settings"

import toBool from '../components/toBool'
import {NativeRouter, Route, Switch} from 'react-router-native'

import {
    Text,
    BackAndroid,
    BackHandler,
    Dimensions,
    AsyncStorage,
    TouchableOpacity
} from 'react-native'
import {Link} from 'react-router-native'

import store from "./store.js"
import {Provider} from 'react-redux'

let {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6193da',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: "white",
        position: 'absolute',
        top: 0
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    linearGradient: {
        // flex: 1,
        position: "absolute",
        // width:null,
        width,
        height
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
})

class Back extends Component {
    async componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack.bind(this))
        // AsyncStorage.setItem("no Introduce", "false")
        let isRecording = await AsyncStorage.getItem("isRecording");
        if (toBool(isRecording)) {
            this.props.history.push('/record')
        } else {
            let noIntroduce = await AsyncStorage.getItem("no Introduce");
            if (toBool(noIntroduce)) {
                this.props.history.push('/main')
            } else {
                this.props.history.push('/welcome')
            }
        }

    }

    handleBack() {

        // if(this.props.location.pathname.match(/^\/settings/)!==null){
        // this.props.history.goBack()
        // }
        // else {

        // }
        if (this.props.location.pathname.match(/^\/(record|main)/)) {
            AsyncStorage.setItem("no Introduce", "false")
            AsyncStorage.setItem("isRecording", "false")
            this.props.history.push('/welcome')
        } else {
            // this.props.history.push('/checkIm4545665age')
            // this.props.history.push('/checkImage')
            this.props.history.goBack()
        }
        return true
    }
    render() {
        return (
            <View></View>
        )
    }
}

class App extends Component {
    // Within your render function
    render() {

        return (
            <NativeRouter>
                <Provider store={store}>
                    <View style={styles.container}>
                        {/* {<AragakiYui opacity={0.5}/>} */}
                        <LinearGradient colors={['#3370c6', '#6193da', '#6193da', '#1e3e96',]} style={styles.linearGradient}/>

                        <Route path="/" component={Back}/>
                        <Switch>
                            <Route exact path="/welcome" component={Welcome}/>
                            <Route path="/introduce" component={Introduce}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/fbLogin" component={FbLogin}/>
                            <Route path="/autoModifySystem" component={AutoModifySystem}/>
                            <Route path="/startPreview" component={startPreview}/>
                            <Route path="/cameraPreview" component={CameraPreview}/>
                            <Route path="/checkImage" component={CheckImage}/>
                            <Route path="/beforeAlmostFinish" component={BeforeAlmostFinish}/>
                            <Route path="/almostFinish" component={AlmostFinish}/>
                            <Route path="/aragakiYui" component={AragakiYui}/>
                            <Route path="/record" component={Record}/>
                            <Route path="/main" component={Main}/>
                            <Route path="/settings" component={Settings}/>
                            <Route path="/test" component={Test}/>
                        </Switch>
                    </View>
                </Provider>
            </NativeRouter>
        )
    }
}

export default App
