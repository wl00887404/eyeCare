import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,ToastAndroid
} from 'react-native';
import FadeInView from '../../components/fadeInView'

const styles = StyleSheet.create({
    container: {
        width: 320,
        flex:1,
    }
})

class Login extends Component {
    constructor(props) {
        super(props)
        this.state={
            a:"",
            p:""
        }
    }
    toAutoModifySystem(){
        this.props.history.push("/autoModifySystem")
    }
    toFbLogin(){
        this.props.history.push("/fbLogin")
    }
    onLogin(){
        let {a,p}=this.state
        if(a==""||p==""){
            ToastAndroid.show("帳號密碼不得為空",ToastAndroid.SHORT)
        }
        else if(a=="ccumis"&&p=="admin"){
            this.toAutoModifySystem()
        }
        else{
            this.setState({a:"",p:""})
            ToastAndroid.show('帳號或密碼錯誤', ToastAndroid.SHORT);
        }
    }
    stop(){
        ToastAndroid.show('功能尚未開放', ToastAndroid.SHORT);
    }
    render() {
        return (
            <FadeInView style={[styles.container]}>
                <View style={{flex:1}} ></View>
                <Header>
                    <H1>登入</H1>
                    <TouchableOpacity onPress={this.stop}>
                        <Text style={{
                            color: "white",
                            fontSize: 16
                        }}>忘記密碼？</Text>
                    </TouchableOpacity>
                </Header>
                <InputField password={false} onChangeText={a=>{this.setState({a})}} value={this.state.a} icon={require('./user.png')}/>
                <InputField password={true} onChangeText={p=>this.setState({p})} value={this.state.p} icon={require('./key.png')}/>

                <LoginButton onPress={this.onLogin.bind(this)}>登入</LoginButton>
                <Hr>或</Hr>
                <GuestButton onPress={this.toAutoModifySystem.bind(this)}>訪客登入</GuestButton>
                <FbButton  onPress={this.toFbLogin.bind(this)}>使用Facebook登入</FbButton>
                <MakeSure onPress={this.stop}/>
                <View style={{flex:1}} ></View>
            </FadeInView>
        )
    }
}

export default Login
const Header = ({children}) => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 15,
        }}>{children}
        </View>
    )
}
const H1 = ({children}) => {
    return (
        <Text style={{
            fontSize: 30,
            color: "white",
        }}>{children}</Text>
    )
}
const P = ({children}) => {
    let text = children.split("").map((t, i) => (
        <Text style={{
            fontSize: 15,
            width: 15,
            textAlign: "center",
            color: "white",
        }} key={i}>{t}</Text>
    ))
    return (
        <View style={{
            marginBottom: 10,
            justifyContent: "center",
        }}>
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                opacity: 0.87
            }}>
                {text}
            </View>
        </View>
    )
}

const InputField = ({password, icon,onChangeText,value}) => {
    return (
        <View style={{
            borderColor: 'white',
            borderBottomWidth: 1,
            marginBottom: 30,
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Image style={{
                width: 26,
                height: 26,
                marginLeft: 15,
            }} source={icon}/>
            <TextInput style={{
                fontSize: 26,
                paddingHorizontal: 15,
                paddingVertical: 4,
                color: "white",
                flexGrow: 1
            }} keyboardType={'ascii-capable'} value={value} onChangeText={onChangeText} selectionColor="white" secureTextEntry={password} underlineColorAndroid='transparent'></TextInput>
        </View>
    )
}
const LoginButton = ({children,onPress}) => {
    return (<View style={{flexDirection:"row"}}>
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
const GuestButton = ({children,onPress}) => {
    return (<View style={{flexDirection:"row"}}>
        <TouchableOpacity style={{
            flexDirection: "row",
            padding: 10,
            borderRadius: 4,
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "rgb(58,107,187)",
            justifyContent: 'center'
        }} onPress={onPress}>
            <Text style={{
                color: "white",
                fontSize: 20,
            }}>{children}</Text>
        </TouchableOpacity></View>
    )
}
const FbButton = ({children,onPress}) => {
    return (<View style={{flexDirection:"row"}}>
        <TouchableOpacity style={{
            marginTop: 20,
            flexDirection: "row",
            padding: 10,
            borderRadius: 4,
            flexGrow: 1,
            alignItems: 'center',
            backgroundColor: "#3B5998"
        }} onPress={onPress}>
            <Image style={{
                width: 30,
                height: 30
            }} source={require("./facebook-app-logo.png")}></Image>
            <Text style={{
                color: "white",
                fontSize: 20,
                flexGrow: 1,
                textAlign: "center",
            }}>{children}</Text>
        </TouchableOpacity></View>
    )

}
const Hr = ({children}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            height: 30,
            marginVertical: 10
        }}>
            <PartHr left={true}/>
            <Text style={{
                color: "white",
                fontSize: 15,
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
            borderColor: "white",
            borderBottomWidth: 1,
            height: 15,
            alignSelf: "flex-start"
        },
        s,
    ]}/>)

}
const MakeSure = ({onPress}) => {
    return (
        <View style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }}>

            <TouchableOpacity style={{
                marginRight: 8,
                borderBottomWidth: 1,
                borderColor: "white",
                paddingBottom: 2
            }} onPress={onPress}>
                <Text style={{
                    color: "white",
                    fontSize: 16
                }}>註冊</Text>
            </TouchableOpacity>
            <View style={{
                borderBottomWidth: 1,
                borderColor: "transparent",
                paddingBottom: 2
            }}>
                <Text style={{
                    color: "white",
                    fontSize: 16
                }}>前請先同意</Text>
            </View>
            <TouchableOpacity style={{
                marginLeft: 8,
                borderBottomWidth: 1,
                borderColor: "white",
                paddingBottom: 2
            }} onPress={onPress}>
                <Text style={{
                    color: "white",
                    fontSize: 16
                }}>《使用者條款》</Text>
            </TouchableOpacity>
        </View>
    )
}
// const Pass=()=>{
//     return(
//         <View style={
//             {
//                 marginTop:50,flexDirection:"row",
//                 justifyContent:"flex-end"
//             }
//         }>
//         <View style={{
//             borderBottomWidth: 1,
//             borderColor: "transparent",
//             paddingBottom: 2
//         }}>
//             <Text style={{
//                 color: "white",
//                 fontSize: 16
//             }}>不想申請帳號？</Text>
//         </View>
//         <TouchableOpacity style={{
//             marginLeft: 8,
//             borderBottomWidth: 1,
//             borderColor: "white",
//             paddingBottom: 2
//         }}>
//             <Text style={{
//                 color: "white",
//                 fontSize: 16
//             }}>略過</Text>
//         </TouchableOpacity>
//
//         </View>
//     )
// }
const Pass = () => {}
