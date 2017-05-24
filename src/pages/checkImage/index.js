import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Dimensions,
    PixelRatio,
    ToastAndroid,AsyncStorage
} from 'react-native';
import {connect} from 'react-redux'
import ImageView from '../../components/imageView'
import FadeInView from '../../components/fadeInView'
import Canvas from '../../components/canvas'

let {width, height} = Dimensions.get('window')
let pixel = PixelRatio.get()
let fontSize = 18
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        alignSelf: "stretch",
        justifyContent: "center",
    },

    prompt: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    promptText: {
        color: "white",
        marginBottom: fontSize / 5,
        fontSize
    },

    buttonContainer: {
        position: "absolute",
        left: fontSize,
        right: fontSize,
        bottom: 1.2 *fontSize,
        flexDirection: "row",
        zIndex: 300,
    },
    imgContainer: {
        flexDirection: "row",
        position: "relative",
        width: 10 *width,
    },
    img: {
        width,
        height: 640 / 480 *width,
    },text: {
        textAlign: "center",
        color: "white",
        fontSize: 24,
        marginBottom:12
    }
})
/*"/storage/emulated/0/Android/data/com.example.user.myapplication/files/iu.jpg"*/
class CheckImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            left: new Animated.Value(0),
            canvas: 0,
            showButton: false,
        }
        this.index = 0
        this.lock = false
        this.f = []
    }
    _onNext() {

        this.index += 1
        let {index} = this
        if (index == this.props.imgData.length) {
            let f=this.f
            let open=this.props.imgData.slice(0,5)
            let openf=this.f.slice(0,5)

            let colse=this.props.imgData.slice(5,10)
            let colsef=this.f.slice(5,10)
            // console.error(openf)
            let opend=open.filter((e,i)=>openf[i]).map(e=>e.data.EAR)
            let colsed=colse.filter((e,i)=>colsef[i]).map(e=>e.data.EAR)
            // console.error(openf)
            if(opend.length>2||colsed.length>2){
                let o=opend.reduce((b,a)=>b+a,0)/opend.length
                let c=colsed.reduce((b,a)=>b+a,0)/colsed.length
                AsyncStorage.setItem("threshold",(o+c)/2+"")
                this.props.dispatch({type:"GET_THRESHOLD",value:(o+c)/2})
                this.props.history.push("/beforeAlmostFinish")
            }

        }
        this.lock = true
        this.setState({
            canvas: (index)*(width)
        }, (() => {
            Animated.timing(this.state.left, {
                toValue: -1 *width *(index),
                duration: 500
            }).start(() => {
                this.lock = false
                this.draw()
            })
        }).bind(this))
    }
    true() {
        if (this.lock) {
            return
        }
        this.f[this.index] = true
        this._onNext()
    }
    false(delay) {
        if (this.lock) {
            return
        }
        this.f[this.index] = false
        //console.warn(delay)
        if (delay) {
            setTimeout(() => {
                this._onNext()
            }, 1000)

        } else {
            this._onNext()
        }

    }
    debug(args) {
        // console.error(args.message)
        if (args.message == "reportSize") {
            this.draw()
        }
    }
    th() {}
    draw() {
        if (this.index == this.props.imgData.length) {
            return
        }
        let data = this.props.imgData[this.index].data
        let {rPupil, lPupil, rightEye, leftEye,} = data
        //console.error(rightEye)
        let ctx = this.Canvas.getContext();

        ctx.strokeStyle = "rgba(255, 0,0,0.87)"
        //ctx.fillStyle = "rgba(255, 255, 0,0.5)"

        ctx.lineWidth = 10
        // ctx.reset()
        if (rightEye.length != 0 && leftEye.length != 0) {
            rightEye.forEach((d, i) => {
                let x = d[0] / 480 * width * pixel
                let y = d[1] / 640 * (640 / 480 * width) * pixel
                if (i == 0) {
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.endPath()
            // ctx.stroke()
            ctx.stroke()
            leftEye.forEach((d, i) => {
                let x = d[0] / 480 * width * pixel
                let y = d[1] / 640 * (640 / 480 * width) * pixel
                if (i == 0) {
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.endPath()
            ctx.stroke()
            this.setState({showButton: true})
        } else {
            ToastAndroid.show("這張照片沒有任何眼睛", ToastAndroid.SHORT, ToastAndroid.CENTER)
            this.false(true)
        }

        ctx.finish()
    }
    toCameraPreview(){
        this.props.history.goBack()
    }
    render() {
        // console.error(this.props.imgData[0])

        if (this.index == this.props.imgData.length) {
            return(
                <View>
                    <Text style={styles.text}>取樣標準不足</Text>
                    <Text style={styles.text}>請重新拍攝樣本</Text>
                    <View style={{marginTop:20}}>
                        <LoginButton onPress={this.toCameraPreview.bind(this)}>重新拍攝</LoginButton>
                    </View>
                </View>
            )
        }
        let s = this.state.showButton
            ? {}
            : {
                display: "none"
            }
        let image = this.props.imgData.map((img, i) => (<Result source={img.filePath} leftEye={img.leftEye} rightEye={img.rightEye} lPupil={img.lPupil} rPupil={img.rPupil} key={i} index={i}/>))
        return (
            <FadeInView style={styles.container}>
                <View style={styles.prompt}>
                    <View>
                        <Text style={styles.promptText}>請問此照片有捕捉到您的眼睛嗎？</Text>
                    </View>
                </View>
                <Animated.View style={[
                    styles.imgContainer, {
                        left: this.state.left
                    },
                ]}>
                    {image}
                    <Canvas style={{
                        width,
                        height: 640 / 480 *width,
                        zIndex: 200,
                        position: "absolute",
                        left: this.state.canvas,
                        top: 0
                    }} ref={r => this.Canvas = r} onChangeMessage={this.debug.bind(this)}></Canvas>
                </Animated.View>

                <View style={[styles.buttonContainer, s,]}>
                    <Button left={true} onPress={this.true.bind(this)}>有</Button>
                    <Button left={false} onPress={this.false.bind(this)}>沒有</Button>
                </View>
            </FadeInView>
        )
    }
}

const mapToStore = (store) => {
    return {imgData: store.preview}
}
export default connect(mapToStore)(CheckImage)
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
class Result extends Component {

    render() {
        let {source, index,} = this.props
        return (
            <View style={[
                styles.img, {
                    position: "relative"
                },
            ]}>
                <ImageView style={styles.img} source={source}></ImageView>

            </View>
        )
    }
}

const Button = ({children, onPress, left}) => {
    let s
    if (left) {
        s = {
            backgroundColor: "rgba(51, 204, 51,0.7)",
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
        }
    } else {
        s = {
            backgroundColor: "rgba(204, 51, 0,0.7)",
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
        }
    }
    return (
        <TouchableOpacity style={[
            {
                paddingVertical: fontSize,
                flex: 1
            },
            s,
        ]} onPress={onPress}>
            <Text style={{
                fontSize,
                color: "white",
                textAlign: "center"
            }}>{children}</Text>
        </TouchableOpacity>
    )
}
