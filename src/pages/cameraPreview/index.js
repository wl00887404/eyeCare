import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
} from 'react-native';
import {connect} from 'react-redux'
import Camera from '../../components/cameraPreview.js';
import FadeInView from '../../components/fadeInView'
import EndPreview from '../../components/endPreview'

let {width, height} = Dimensions.get('window')

let fontSize = 18
let markSize = 80
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        alignSelf: "stretch",
        justifyContent: "center"
    },
    preview: {
        width,
        height: 640 / 480 *width,
    },

    prompt: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    promptText: {
        color: "white",
        marginBottom: fontSize / 5,
        fontSize,
        textAlign: "center",
    },
    crossContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    cross: {
        fontSize: markSize,
        color: "rgba(97, 147, 218,0.7)",
    },
    buttonContainer: {
        position: "absolute",
        left: fontSize,
        right: fontSize,
        bottom: 1.2 *fontSize,
    }
})
let message = [
    [
        "請正視十字中心", "保持張開眼睛、暫時不要眨眼",
    ],
    ["請盡量維持不動、閉上眼睛","繼續取樣"],
]
let step = ["取樣", "取樣",]

class CameraPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }
        this.lock = true
    }

    nextStep() {
        let {index} = this.state
        this.setState({
            index: index + 1
        })
        this.lock = false
    }
    finishedCapture(filePaths){
        this.props.dispatch({
            type:"GET_FILEPATHS",
            filePaths
        })
    }
    finishedFetch(data) {
        this.props.dispatch({
            type:"GET_DATA",
            data
        })
        this.props.history.push('/checkImage')
    }

    render() {
        let {index} = this.state
        let s1
        let s2
        let msg
        if (index != message.length) {
            // return (<EndPreview/>)
            s1 = {
                display: "none"
            }
        } else {
            s2 = {
                display: "none"
            }
        }

        if (message[index] != undefined) {
            msg = message[index].map((txt, i) => (
                <Text style={styles.promptText} key={i}>{txt}</Text>
            ))

        }
        return (
            <View style={{
                position: "relative",
                flex: 1,
                alignSelf: "stretch",
            }}>
                <View style={[
                    {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width,
                        height,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    s1,
                ]}>
                    <EndPreview/>
                </View>
                <FadeInView style={[styles.container, s2,]}>
                    <View style={styles.prompt}>
                        <View>
                            {msg}
                        </View>
                    </View>
                    <Camera style={styles.preview} onChangeMessage={this.onChangeMessage.bind(this)} ref={r => this.Camera = r} user="hGod"></Camera>
                    <View style={styles.crossContainer}>
                        <Text style={styles.cross}>+</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button onPress={this.takePicture.bind(this)}>{step[this.state.index]}</Button>
                    </View>
                </FadeInView>
            </View>
        );
    }

    takePicture() {
        if (this.lock) {
            return
        }
        this.Camera.takePicture()
        this.lock = true
    }
    onChangeMessage(args) {
        switch (args.message) {
            case "reportSize":
                // console.warn(args.width)
                // console.warn(args.height)
                this.lock = false
                break;
            case "finishedHalfCapture":
                this.nextStep();
                break;
            case "finishedCapture":
                this.nextStep();
                this.finishedCapture(args.filePaths)
                break;
            case "finishedFetch":
                this.finishedFetch(args.data);
                break;
            default:
                break;
        }
    }
}

export default connect()(CameraPreview)

const Button = ({children, onPress}) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: "rgba(51, 112, 198,0.7)",
            borderRadius: 4,
            paddingVertical: fontSize,
        }} onPress={onPress}>
            <Text style={{
                fontSize,
                color: "white",
                textAlign: "center"
            }}>{children}</Text>
        </TouchableOpacity>
    )
}
