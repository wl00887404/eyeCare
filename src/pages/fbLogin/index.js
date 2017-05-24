/*
*   醜到爆
*
*/

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from 'react-native';
import FadeInView from '../../components/fadeInView'
const styles = StyleSheet.create({
    tCenter: {
        textAlign: "center"
    }
})
export default class FbLogin extends Component {
    toBack() {
        let that=this
        Alert.alert('天呀！你怎麼會在這裡', '這裡一點都不有趣，我馬上帶你回去！！', [
            {
                text: '塊逃呀',
                onPress: () => {
                    that.props.history.goBack()
                },
            },
            {
               text: '我不要',
               onPress: () => {
                   this.no()
               },
           },
        ])
    }
    no(){
        let that=this
        Alert.alert('別鬧了！', '這裡什麼功能沒有，而且程式隨時會崩潰', [
            {
                text: '唉…那好吧',
                onPress: () => {
                    that.props.history.goBack()
                },
            },
            {
               text: '我不要',
               onPress: () => {
                   that.no2()
               },
           },
        ])
    }
    no2(){
        let that=this
        Alert.alert('聽話！', '我不帶你離開，你有可能永遠留在這裡耶！你不希望這種事發生吧？', [
            {
                text: '好吧…帶我走吧',
                onPress: () => {
                    that.props.history.goBack()
                },
            },
            {
               text: '我不要',
               onPress: () => {
                   that.no3()
               },
           },
        ])
    }
    no3(){
        let that=this
        Alert.alert('= =', '這是最後機會喔', [
            {
                text: '要走就走嘛',
                onPress: () => {
                    that.props.history.goBack()
                },
            },
            {
               text: '我不要',
               onPress: () => {
                   that.no4()
               },
           },
        ])
    }
    no4(){
        let that=this
        Alert.alert('拜託啦', '我求求你', [
            {
                text: '既然你都這樣拜託我了',
                onPress: () => {
                    that.props.history.goBack()
                },
            },
            {
               text: '我不要',
               onPress: () => {
                   that.no4()
               },
           },
        ])
    }
    render() {
        return (
            <FadeInView style={{
                alignSelf: "stretch",
                flex: 1,
                borderColor: "black",
                borderWidth: 1
            }}>
                <View style={{
                    flex: 1,
                    alignSelf: "stretch",
                    backgroundColor: "#eceff5"
                }}>
                    <View style={{
                        backgroundColor: "#3b5998",
                        padding: 10,
                        marginBottom: 15
                    }}>
                        <Text style={[
                            styles.tCenter, {
                                color: "white",
                                fontSize: 20,
                                fontWeight: "bold"
                            },
                        ]}>facebook</Text>
                    </View>
                    <View style={{
                        borderColor: "#e2c822",
                        borderWidth: 1,
                        borderRadius: 4,
                        backgroundColor: "#fffbe2",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Image source={require("./BdXc4LF_poc.png")} style={{
                            width: 18,
                            height: 30,
                            marginRight: 10
                        }}></Image>
                        <Text style={{
                            color: "#576b95"
                        }}>使用Android專用Facebook外掛以加快瀏覽速度。</Text>
                    </View>
                    <View style={{
                        marginHorizontal: 10,
                        marginVertical: 15,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,.2)"
                    }}>
                        <TextInput placeholder="電子郵件或電話：" style={{
                            backgroundColor: "white",
                            borderRadius: 4,
                        }}></TextInput>
                        <View style={{
                            borderBottomWidth: 1,
                            borderBottomColor: "rgba(0,0,0,.2)",
                        }}></View>
                        <TextInput placeholder="密碼：" style={{
                            backgroundColor: "white",
                            borderRadius: 4,
                        }}></TextInput>
                    </View>
                    <TouchableOpacity style={{
                        backgroundColor: "rgb(89, 111, 157)",
                        padding: 15,
                        marginHorizontal: 10,
                        borderRadius: 4
                    }} onPress={this.toBack.bind(this)}>
                        <Text style={[
                            styles.tCenter, {
                                color: "white",
                                fontSize: 15,
                                fontWeight: "bold"
                            },
                        ]}>登入</Text>
                    </TouchableOpacity>
                    <Hr>或</Hr>
                    <TouchableOpacity style={{
                        backgroundColor: "rgb(74, 133, 50)",
                        padding: 15,
                        alignSelf: "center",
                        borderRadius: 4
                    }} onPress={this.toBack.bind(this)}>
                        <Text style={[
                            styles.tCenter, {
                                color: "white",
                                fontSize: 15,
                                fontWeight: "bold"
                            },
                        ]}>建立新帳號</Text>
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        marginVertical: 10
                    }}>
                        <Text style={{
                            color: "#7596c8",
                            marginHorizontal: 5
                        }}>忘記密碼？</Text>
                        <Text style={{
                            color: "#7596c8",
                            marginHorizontal: 5
                        }}>使用說明</Text>
                    </View>

                    <View style={{
                        backgroundColor: "white",
                        flex: 1,
                        paddingTop: 15,
                    }}>
                        <View style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                            justifyContent: "space-around"
                        }}>
                            <Text>中文(台灣)</Text>
                            <Text>English (US)</Text>
                        </View>
                        <View style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                            justifyContent: "space-around"
                        }}>
                            <Text>Tiếng Việt</Text>
                            <Text>Español</Text>
                        </View>
                        <View style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                            justifyContent: "space-around"
                        }}>
                            <Text>Bahasa Indonesia</Text>
                            <Text>Português (Brasil)</Text>
                        </View>

                        <View style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            marginVertical: 5,
                            justifyContent: "space-around"
                        }}>
                            <Text>Facebook © 2017</Text>
                        </View>
                    </View>
                </View>
            </FadeInView>
        )
    }
}
const Hr = ({children}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            height: 30,
            margin: 10,
        }}>
            <PartHr left={true}/>
            <Text style={{
                fontSize: 15
            }}>{children}</Text>
            <PartHr/>
        </View>
    )
}
const PartHr = ({left}) => {
    let w = 20
    let s
    if (left) {
        s = {
            marginRight: w
        }
    } else {
        s = {
            marginLeft: w
        }
    }
    return (<View style={[
        {
            flexGrow: 1,
            borderColor: "rgba(0,0,0,0.2)",
            borderBottomWidth: 1,
            height: 15,
            alignSelf: "flex-start"
        },
        s,
    ]}/>)

}
