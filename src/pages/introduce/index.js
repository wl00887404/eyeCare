import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated,
    PanResponder
} from 'react-native'
import FadeInView from '../../components/fadeInView'
let data = [
    {
        title: "全球第一眼睛疲勞監控",
        img: require("./makeup.png"),
        backgroundColor: '#97c9e7',
        content: "疲勞偵測、眼動分析、歷程記錄、護眼建議…多元整合App，愛眼以您的健康、安全為出發點，致力於保護您和您的雙眼。",
    }, {
        title: "雲端服務、自動同步",
        img: require("./cloud-computing.png"),
        backgroundColor: '#ffb3d9',
        content: "資料雲端處理、紀錄，多平台資訊同步完全沒有問題！手機、平板、筆電…多種設備，登入帳號就能一次搞定。",
    }, {
        title: "隨時帶著走",
        img: require("./responsive.png"),
        backgroundColor: '#82bee3',
        content: "無需複雜準備，只要有前置鏡頭，愛眼讓您走到哪用到哪，隨時隨地輕鬆使用，暢行E化生活。",
    },
]
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        alignSelf: "center",
        width: 320,
    }
})

class Introduce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            left: new Animated.Value(0),
            dot: new Animated.Value(10),
        }
        this.index = 0
        this.moveX = 0
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
        })
    }
    toNext() {

        if (this.index < data.length) {
            this.index += 1
        }
        if (this.index == data.length) {
            this.props.history.push("/login")
        }
        let {index} = this
        this.lastAnim = this._return()

    }
    toLast() {

        if (this.index > 0) {
            this.index -= 1
        }
        let {index} = this
        this.lastAnim = this._return()
    }
    _follow() {
        let {index} = this
        Animated.timing(this.state.left, {
            toValue: -340 *(index) + this.moveX, // Animate to opacity: 1, or fully opaque
            duration: 1,
        }).start();
    }
    _return() {
        let {index} = this
        let a = Animated.sequence([// decay, then spring to start and twirl
            Animated.parallel([ // after decay, in parallel:
                Animated.spring(this.state.left, {
                    toValue: -340 *(index), // Animate to opacity: 1, or fully opaque
                    duration: 500,
                }),
                Animated.spring(this.state.dot, { // and twirl
                    toValue: 20 *(index) + 10,
                    duration: 500,
                }),
            ])])
        a.start()
        return a
    }
    toLogin() {
        this.props.history.push('/login')
    }

    render() {
        let {index} = this
        let cards = data.map(({
            title,
            content,
            img,
            backgroundColor
        }, index) => {
            return (
                <Card key={index} title={title} index={index} content={content} img={img} backgroundColor={backgroundColor}></Card>
            )
        })
        return (
            <FadeInView style={{
                alignSelf: "stretch"
            }}>
                <View style={styles.container} removeclippedsubviews={false}>
                    <Animated.View style={{
                        flexDirection: "row",
                        position: "relative",
                        alignSelf: "flex-start",
                        left: this.state.left
                    }} {...this._panResponder.panHandlers}>
                        {cards}
                    </Animated.View>
                    <ButtonField>
                        <Button onPress={this.toLogin.bind(this)}>略過</Button>
                        <IndexDot dot={this.state.dot}/>
                        <Arrow onPress={this.toNext.bind(this)}/>
                    </ButtonField>
                </View>
            </FadeInView>
        )

    }

    _handleStartShouldSetPanResponder(e, gestureState) {
        // Should we become active when the user presses down on the circle?
        return true;
    }

    _handleMoveShouldSetPanResponder(e, gestureState) {
        // Should we become active when the user moves a touch over the circle?
        return true;
    }

    _handlePanResponderGrant(e, gestureState) {
        if (this.lastAnim) {
            this.lastAnim.stop()
        }
        //console.warn("Grant")
        //this._highlight();
    }
    _handlePanResponderMove(e, gestureState) {
        this.moveX = gestureState.dx
        this._follow()
        // this._circleStyles.style.left = this._previousLeft + ;
        // this._circleStyles.style.top = this._previousTop + gestureState.dy;
        // this._updateNativeStyles();
    }
    _handlePanResponderEnd(e, gestureState) {

        if (this.moveX > 150) {
            this.toLast()
        } else if (this.moveX < -150) {
            this.toNext()
        } else {
            this._return()
        }
        this.moveX = 0
        //console.warn("end")
        // this._unHighlight();
        // this._previousLeft += gestureState.dx;
        // this._previousTop += gestureState.dy;
    }
}

export default Introduce
const Card = ({title, index, content, img, backgroundColor}) => {
    let marginLeft = index == 0
        ? 0
        : 20
    return (
        <View style={{
            alignItems: "center",
            width: 320,
            marginLeft
        }}>
            <Icon img={img} backgroundColor={backgroundColor}/>
            <H1>{title}</H1>
            <P>{content}</P>
        </View>
    )
}
const Icon = ({img, backgroundColor}) => {
    return (
        <View style={{
            borderRadius: 300,
            width: 250,
            height: 250,
            backgroundColor,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20
        }}>
            <Image style={{
                width: 150,
                height: 150,
            }} source={img}/>
        </View>
    )
}
const H1 = ({children}) => {
    return (
        <Text style={{
            fontSize: 30,
            height: 40,
            marginBottom: 10,
            color: "white"
        }}>{children}</Text>
    )
}

const P = ({children}) => {
    let text = children.split("").map((t, i) => (
        <Text style={{
            fontSize: 15,
            width: 15,
            marginBottom: 5,
            textAlign: "center",
            color: "white"
        }} key={i}>{t}</Text>
    ))
    return (
        <View style={{
            height: 80
        }}>
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                opacity: 0.87,
            }}>
                {text}
            </View>
        </View>
    )
}

const ButtonField = ({children}) => {
    return (
        <View style={{
            marginTop: 40,
            width: 320,
            height: 40,
            borderWidth: 0,
            flexDirection: "row",
            justifyContent: "space-between"
        }}>{children}</View>
    )
}
const Button = ({onPress, children}) => {
    return (
        <TouchableOpacity style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 56
        }} onPress={onPress}>
            <Text style={{
                color: "white",
                fontSize: 15
            }}>{children}</Text>
        </TouchableOpacity>
    )
}
const Arrow = ({onPress}) => {
    return (
        <TouchableOpacity style={{
            width: 56,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }} onPress={onPress}><Image source={require("./right-arrow.png")} style={{
            width: 30,
            height: 30,
        }}/></TouchableOpacity>
    )
}
const IndexDot = ({dot}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
        }}>
            <ActiveDot dot={dot}/>
            <Dot/>
            <Dot/>
            <Dot/>
        </View>
    )
}

const ActiveDot = ({dot}) => {
    let width = 12
    return (
        <Animated.View style={{
            width: width,
            height: width,
            borderRadius: width,
            backgroundColor: "white",
            position: "absolute",
            top: 20,
            left: dot,
            zIndex: 10,
            transform: [
                {
                    translateX: width * - 1 / 2
                }, {
                    translateY: width * - 1 / 2
                },
            ],
        }}></Animated.View>
    )
}
const Dot = ({active}) => {
    return (
        <View style={{
            width: 10,
            height: 10,
            borderRadius: 10,
            marginHorizontal: 5,
            backgroundColor: "#3a7edf"
        }}></View>
    )
}
