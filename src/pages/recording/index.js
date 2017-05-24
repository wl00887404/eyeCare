import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    BackAndroid,PixelRatio,Alert
} from 'react-native'
import FadeInView from '../../components/fadeInView'
import CameraModule from '../../components/cameraModule'
import Canvas from '../../components/canvas'

let pixel=PixelRatio.get()

let fontSize = 16
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: fontSize,
        justifyContent: "center",
        alignSelf: "stretch",
        position: "relative"
    },
    h1: {
        fontSize: 2 *fontSize,
        lineHeight: 2 *fontSize
    },
    h2: {
        fontSize: 1.5 *fontSize,
        lineHeight: 1.5 *fontSize
    },
    white: {
        color: "white"
    },
})

class Record extends Component {
    constructor(props) {
        super(props)
        this.state={
            threshold:4
        }
    }
    exit() {
        clearTimeout(this.timer)
        BackAndroid.exitApp()
    }
    finish() {
        Alert.alert('雲端同步', '資料即將上傳至雲端，稍後即可在歷史紀錄查看', [
            {
                text: '上傳',
                onPress: () => {
                    clearTimeout(this.timer)
                    this.props.history.push("/main")
                    CameraModule.stopBackgroundCamera()
                    AsyncStorage.setItem("isRecording", "false")
                }
            },{
                text: '取消',
                onPress: () => {
                    clearTimeout(this.timer)
                    this.props.history.push("/main")
                    CameraModule.stopBackgroundCamera()
                    AsyncStorage.setItem("isRecording", "false")
                },
            }
        ])
    }
    debug(args) {

        if (args.message == "reportSize") {
            this.cHeight=args.height
            this.cWidth=args.width
        }
    }
    draw() {

        let cw=this.cWidth
        let ch=this.vHeight*pixel
        if(cw!=null&&ch!=null&&this.data.length!=0){

            let ctx = this.Canvas.getContext()
            ctx.strokeStyle = "rgba(255,255,255,1)"
            ctx.lineWidth = 1
            ctx.beginPath()
            let length=this.data.length
            // console.error(this.data)
            this.data.forEach((d,i)=>{
                if(i==0){
                    ctx.moveTo(0, d*ch)
                }
                else {
                    ctx.lineTo(i/length*cw,d*ch)
                }
            })
            ctx.stroke()
            ctx.beginPath()
            ctx.lineWidth=3
            ctx.moveTo(0,0.5*ch)
            ctx.lineTo(1*cw,0.5*ch)
            // ctx.moveTo(0,0.5*ch)
            // ctx.lineTo(1*cw,)
            ctx.stroke()
            ctx.finish()
        }

    }
    getSize(event) {
        var {x, y, width, height} = event.nativeEvent.layout

        this.vWidth=width;
        this.vHeight=height;
    }
    componentDidMount(){
        this.data=[]
        for(let i=0;i<20;i++){
            this.data[i]=(Math.round(Math.random()*100)/100)
        }
        this.update()
    }
    componentWillUnmount(){
        clearTimeout(this.timer)
    }
    async update(){
        let threshold=await AsyncStorage.getItem("threshold")
        threshold=Math.round(threshold*100)/100
        let startTime=await AsyncStorage.getItem("startTime")
        startTime=new Date(startTime)
        let mStartTime=startTime.getTime()

        startTime=startTime.toLocaleTimeString()
        let now =Date.now()-mStartTime
        now=new Date(now)
        now=now.toUTCString().match(/\d+:\d+:\d+/)[0]
        let lag=Math.round(Math.random()*10)/10
        let blink=(Math.round(Math.random()*10/2)+lag*2)+12
        this.data.shift()
        this.data[19]=(Math.round(Math.random()*100)/100)

        this.setState({threshold,startTime,now,lag,blink})
        this.draw()
        this.timer=setTimeout(()=>{
            this.update()
        },1000)
    }
    render() {
        return (
            <View style={styles.container}>
                <Row style={{
                    justifyContent: "flex-end",
                    marginBottom: 0.2 *fontSize
                }}>
                    <Button onPress={this.exit.bind(this)}>縮到最小</Button>
                    <Button onPress={this.finish.bind(this)}>結束紀錄</Button>
                </Row>

                <Row style={{
                    marginBottom: 0.6 *fontSize,
                    justifyContent: "space-between",
                    alignItems: "flex-end"
                }}>
                    <Span style={{
                        fontSize: 1.5 *fontSize,
                        lineHeight: 1.5 *fontSize
                    }}>紀錄中 (5/16)</Span>
                    <Span style={{
                        fontSize: 1.5 *0.75 *fontSize,
                        lineHeight: 1.5 *0.75 *fontSize
                    }}>threshold : {this.state.threshold}</Span>
                </Row>
                <Row style={{
                    justifyContent: "space-between",
                    marginBottom: 0.6 *fontSize
                }}>
                    <BlinkRate>{this.state.blink}</BlinkRate>
                    <Healthy/>
                </Row>
                <Row style={{
                    justifyContent: "space-between",
                    marginBottom: 0.6 *fontSize
                }}>
                    <Wifi>{this.state.lag}</Wifi>
                    <Time now={this.state.now} start={this.state.startTime}></Time>
                </Row>
                <Row style={{
                    justifyContent: "space-between",
                    marginBottom: 0.6 *fontSize
                }}>
                    <View style={{
                        borderWidth: 1,
                        padding: fontSize / 2,
                        borderColor: "white",
                        flex: 1,
                        height: 12 *fontSize,
                    }}>
                        <Span style={{
                            fontSize,
                            lineHeight: 1.5 *fontSize,
                            height:2*fontSize
                        }}>眼動分析歷程</Span>
                        <View onLayout={this.getSize.bind(this)} style={{flex:1,alignItems:"stretch",marginTop:5}}>
                            <Canvas style={{
                                flex:1,alignItems:"stretch"
                            }} ref={r => this.Canvas = r} onChangeMessage={this.debug.bind(this)}></Canvas>

                        </View>
                    </View>
                </Row>

            </View>

        )
    }

}

export default Record
const Button = ({children, onPress}) => {
    let size = fontSize
    return (
        <TouchableOpacity style={{
            borderColor: "white",
            marginLeft: 0.5 *size,
            borderWidth: 1,
            borderRadius: 4,
            paddingVertical: 0.3 *size,
            paddingHorizontal: 0.5 *size
        }} onPress={onPress}>
            <Span>{children}</Span>

        </TouchableOpacity>
    )
}
const Row = ({children, style,}) => {
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

const H1 = ({children, style,}) => {
    return (
        <Text style={[styles.h1, styles.white, style,]}>
            {children}
        </Text>
    )
}
const H2 = ({children, style,}) => {
    return (
        <Text style={[styles.h2, styles.white, style,]}>
            {children}
        </Text>
    )
}

const Span = ({children, style,}) => {
    return (
        <Text style={[styles.white, style,]}>{children}</Text>
    )
}

const BlinkRate = ({children}) => {
    return (
        <View style={{
            borderWidth: 1,
            padding: fontSize / 2,
            borderColor: "white",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: 10 *fontSize,
            height: 9 *fontSize,
        }}>
            <View>
                <H1 style={{
                    textAlign: "center"
                }}>眨眼頻率</H1>
            </View>
            <Row style={{
                justifyContent: "flex-end",
                alignItems: "baseline"
            }}>
                <Span style={{
                    fontSize: 3 *fontSize
                }}>{children}</Span>
                <Span style={{
                    fontSize
                }}>/Min</Span>
            </Row>
        </View>
    )
}

const Healthy = () => {
    // backgroundColor:"rgba(51, 204, 51,0.6)"
    let size = 4
    return (
        <View style={{
            borderWidth: 1,
            borderColor: "white",
            justifyContent: "space-between",
            alignItems: "center",
            height: 9 *fontSize,
            padding: fontSize / 2,
            width: 10 *fontSize,
            position: "relative"
        }}>
            <H1>健康評估</H1>
            <Image style={{
                width: size *fontSize,
                height: size *fontSize,
                position: "absolute",
                top: 5 *fontSize,
                left: 5 *fontSize,
                transform: [
                    {
                        translateX: -1 / 2 *size *fontSize
                    }, {
                        translateY: -1 / 2 *size *fontSize
                    },
                ]
            }} source={require("./view.png")}/>
            <H2>正常</H2>
        </View>
    )
}

const Time = ({now,start}) => {
    return (
        <View style={{
            borderColor: "white",
            borderWidth: 1,
            height: 7 *fontSize,
            width: 14 *fontSize,
            padding: 0.5 *fontSize,
        }}>
            <Row style={{
                justifyContent: "space-between",
                alignItems: "flex-end"
            }}>
                <Span style={{
                    fontSize: 1.5 *fontSize,
                    lineHeight: 1.5 *fontSize
                }}>運行時間</Span>
                <View style={{
                    alignItems: "flex-end"
                }}>
                    <Span style={{
                        fontSize: 1.5 *0.5 *fontSize,
                        lineHeight: 1.5 *0.5 *fontSize
                    }}>開始時間</Span>
                    <Span style={{
                        fontSize: 1.5 *0.5 *fontSize,
                        lineHeight: 1.5 *0.5 *fontSize
                    }}>{start}</Span>
                </View>

            </Row>
            <Row style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                flex: 1
            }}>
                <Span style={{
                    fontSize: 2.5 *fontSize
                }}>{now}</Span>
            </Row>
        </View>
    )
}
const Wifi = ({children}) => {
    return (
        <View style={{
            borderColor: "white",
            borderWidth: 1,
            height: 7 *fontSize,
            width: 6 *fontSize,
            padding: 0.5 *fontSize,
            alignItems: "center",
        }}>
            <Image source={require("./wifi-connection-signal-symbol.png")} style={{
                width: 3 *fontSize,
                height: 3 *fontSize
            }}/>
            <View style={{
                alignSelf: "stretch",
                alignItems: "center"
            }}>
                <Span style={{
                    fontSize
                }}>連線延遲</Span>
                <Span style={{
                    fontSize
                }}>{children}s</Span>
            </View>
        </View>
    )
}

// const Button = () => {
//     let size = fontSize * 4
//     return (
//         <View style={{
//             width: size,
//             height: size,
//             backgroundColor: "white",
//             position: "absolute",
//             borderRadius: size,
//             right: 1 / 4 *size,
//             top: 0
//         }}></View>
//     )
//     // transform:[
//     //     {translateX:-1/2*size},
//     //     {translateY:-1/2*size},
//     // ]
// }
