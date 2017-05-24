import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
} from 'react-native'
let animationTime = 2000
const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    img: {
        width: 200,
        height: 200
    },
    relativeUp: {
        position: "relative",
        top: -25,
    }
})

class Welcome extends Component {
    componentDidMount() {
        setTimeout(this.toIntroduce.bind(this), animationTime)
    }
    toIntroduce() {
        this.props.history.push('/introduce')
    }
    toMain() {
        this.props.history.push('/main')
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={require('./logo.png')}/>
                <View style={styles.relativeUp}>
                    <P>lovEye</P>
                </View>
            </View>
        )
    }
}

export default Welcome

const P = ({children}) => {
    let text = children.split("").map((t, i) => (
        <Text key={i} style={{
            fontSize: 30,
            width: 25,
            textAlign: "center",
            color: "white",
            fontWeight: "bold"
        }}>{t}</Text>
    ))
    return (
        <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            opacity: 0.87,
        }}>
            {text}
        </View>
    )
}
