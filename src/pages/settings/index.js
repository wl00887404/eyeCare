import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ScrollView,
    PixelRatio,
    Image,
    Picker,
    Switch,
    Slider,
    ToastAndroid,
} from 'react-native';
import FadeInView from '../../components/fadeInView'
import {connect} from 'react-redux'
let fontSize = 20
let color = "white"
const noAvailable = () => {
    ToastAndroid.show('功能尚未開放', ToastAndroid.SHORT);
}
const makeText = (txt) => {
    setTimeout(()=>{
        ToastAndroid.show(txt, ToastAndroid.SHORT);
    },500)
}
class Settings extends Component {
    constructor(props) {
        super(props)
        this.egg=7
        this.state = {
            slider: 10
        }
    }
    setBG(){
        if(this.egg==0){
            this.props.dispatch({
                type:"GET_BG"
            })
        }
        else {
            ToastAndroid.show(""+this.egg,ToastAndroid.SHORT)
            this.egg-=1
        }
    }
    render() {

        return (
            <ScrollView style={{
                flex: 1,
                padding: 1 / 2 *fontSize,
                alignSelf: "stretch",
            }}>
                <Section>
                    <H1>取樣</H1>
                    <Item name="偵測頻率" source={require("./1.png")}>
                        <MySlider max={30} min={0} step={1}></MySlider>
                    </Item>
                    <Item name="效能優先" source={require("./2.2.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                </Section>
                <Section>
                    <H1>通知</H1>
                    <Item name="模式" source={require("./4.png")}>
                        <MyPicker options={["通知","土司","靜音"]}></MyPicker>

                    </Item>
                    <Item name="家長監護模式" value={false} source={require("./family.png")}>
                        <MySwitchN></MySwitchN>
                    </Item>
                </Section>
                <Section>
                    <H1>監視症狀</H1>
                    <Item name="疲勞提醒" source={require("./3.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                    <Item name="用眼時間" source={require("./3.png")}>
                        <MySlider max={60} min={0} step={5} value={30}></MySlider>
                    </Item>

                </Section>
                <Section>
                    <H1>自動控制</H1>
                    <Item name="亮度" source={require("./5.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                    <Item name="色溫" source={require("./6.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                    <Item name="藍光" source={require("./7.2.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                    <Item name="關閉螢幕" source={require("./8.png")}>
                        <MySwitch></MySwitch>
                    </Item>
                </Section>
                <Section>
                    <H1>連線</H1>
                    <Item name="離線模式" source={require("./9.png")} onPress={noAvailable}></Item>
                    <Item name="僅使用wifi" source={require("./10.2.png")} onPress={noAvailable}></Item>
                    <Item name="wifi或其餘費率方案" source={require("./11.png")} onPress={noAvailable}></Item>
                </Section>
                <Section>
                    <H1>帳號</H1>
                    <Item name="登出" source={require("./12.2.png")} onPress={noAvailable}></Item>
                    <Item name="與社群帳號連結" source={require("./13.png")} onPress={noAvailable}></Item>
                </Section>
                <Section>
                    <H1>進階功能</H1>
                    <Item name="清除快取" source={require("./14.png")} onPress={makeText.bind(null,"已清除所有快取圖片")}></Item>
                    <Item name="清除歷史紀錄" source={require("./15.png")} onPress={makeText.bind(null,"已清除所有歷史紀錄")}></Item>
                    <Item name="在桌布建立捷徑" source={require("./16.png")} onPress={noAvailable}></Item>
                    <Item name="開機自動啟動" source={require("./17.png")} onPress={noAvailable}></Item>
                </Section>
                <Section>
                    <H1>個人化</H1>
                    <Item name="設置主題" source={require("./18.png")} onPress={this.setBG.bind(this)}></Item>
                    <Item name="下載主題" source={require("./19.png")} onPress={noAvailable}></Item>
                </Section>
                <Section>
                    <H1>協助工具</H1>
                    <Item name="語音模式" source={require("./20.png")}>
                        <MyPicker options={["中文","台語","英文"]}></MyPicker>
                    </Item>
                    <Item name="色盲模式" source={require("./21.png")}>
                        <MySwitch value={false}></MySwitch>
                    </Item>
                </Section>
                <Section>
                    <H1>關於我們</H1>
                    <Item name="提供意見" source={require("./22.png")} onPress={noAvailable}></Item>
                    <Item name="法律及隱私權" source={require("./23.png")} onPress={noAvailable}></Item>
                </Section>
            </ScrollView>
        )
    }
}
export default connect()(Settings)
const H1 = ({children, style}) => {
    return (
        <View style={[
            {
                borderBottomWidth: 1,
                borderColor: "white",
            },
            style,
        ]}>
            <Text style={{
                fontSize: fontSize,
                color,
            }}>{children}</Text>
        </View>

    )
}
const Item = ({
    name,
    children,
    style,
    source,
    onPress,
}) => {
    let Container
    if (onPress) {
        Container = TouchableOpacity
    } else {
        Container = View
    }
    return (
        <Container style={[
            {
                height: 2.5 *fontSize,
                borderBottomWidth: 2 / PixelRatio.get(),
                borderColor: "white",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            },
            style,
        ]} onPress={onPress}>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>

                <View style={{
                    width: 1.6 *fontSize,
                    height: 1 *fontSize,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    top: 2
                }}>
                    <Image style={{
                        width: 1 *fontSize,
                        height: 1 *fontSize,
                    }} source={source}></Image>
                </View>
                <Text style={{
                    lineHeight: 1.4 *fontSize,
                    fontSize: 1.2 *fontSize,
                    color,
                }}>{name}</Text>
            </View>
            <View>{children}</View>
        </Container>
    )
}
const Section = ({children, style}) => {
    return (
        <View style={[
            {
                marginBottom: 1 *fontSize
            },
            style,
        ]}>
            {children}
        </View>
    )
}

class MySwitch extends Component {
    constructor(props) {
        super(props)
        let value = props.value
        if (value==undefined) {
            value = true
        }

        this.state = {
            value
        }
    }
    _on() {
        this.setState({
            value: !this.state.value
        })
    }
    render() {
        return (
            <Switch value={this.state.value} thumbTintColor="white" onTintColor="white" onValueChange={this._on.bind(this)}></Switch>
        )
    }
}

class MySwitchN extends Component {
    constructor(props) {
        super(props)
        let value = props.value
        if (value==undefined) {
            value = false
        }

        this.state = {
            value
        }
    }
    _on() {
        this.setState({
            value: !this.state.value
        })
    }
    render() {
        return (
            <Switch value={this.state.value} thumbTintColor="white" onTintColor="white" onValueChange={this._on.bind(this)}></Switch>
        )
    }
}
class MySlider extends Component {
    constructor(props) {
        super(props)
        let {value} = this.props
        if (!value) {
            value = 10
        }
        this.state = {
            value
        }
    }
    onSlider(value) {

        this.setState({value})
    }
    render() {
        let {max, min, step,} = this.props
        return (
            <View style={{
                position: "relative",
                height: 2.5 *fontSize,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
            }}>
                <Slider value={this.state.value} step={step} onValueChange={this.onSlider.bind(this)} minimumTrackTintColor={'white'} maximumTrackTintColor={'white'} thumbTintColor={'white'} minimumValue={min} maximumValue={max} style={{
                    width: 150,
                    position: "relative",
                    top: 2,
                }}></Slider>
                <Text style={{
                    color,
                    marginRight: 1 / 4 *fontSize,
                    fontSize,
                    width: 1.5 *fontSize
                }}>{this.state.value}</Text>

            </View>
        )
    }
}
class MyPicker extends Component {
    constructor(props) {
        super(props)
        let value = this.props.options[0]
        this.state = {
            value
        }
    }
    onValueChange(value) {
        this.setState({value})
    }
    render() {
        let {value}=this.state
        let {options}=this.props
        options=options.map((o,i)=>(<Picker.Item label={o} value={o} key={i}/>))
        return (
            <Picker selectedValue={value} onValueChange={this.onValueChange.bind(this)}style={{
                color,
                width: 4.5 *fontSize,
                height: fontSize,
                position: "relative",
                left: 2 *fontSize
            }}>
                {options}
            </Picker>
        )
    }
}
