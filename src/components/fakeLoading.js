import React, {Component} from 'react'
import {StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import ActivityIndicatorExample from './activityIndicatorExample'
import FadeInView from './fadeInView'


const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 24
    }
})

export default class FakeLoading extends Component {
    constructor(props){
        super(props)
        this.state = {
            index: 0
        }
    }

    componentDidMount() {
        let {status,animationTime}=this.props
        if(!animationTime){
            return
        }
        this.timer=setTimeout(this.changeStatus.bind(this), animationTime)
    }
    changeStatus() {
        let {status,animationTime,next}=this.props
        if (this.state.index == status.length - 1) {
            this.props.history.push(next)

        } else {
            this.setState({
                index: this.state.index + 1
            })
            this.timer=setTimeout(this.changeStatus.bind(this), animationTime)
        }
    }
    componentWillUnmount(){
        clearTimeout(this.timer)
    }
    render() {
        let {status}=this.props
        return (
            <FadeInView style={[{
                width: 320
            }]}>
            <ActivityIndicator animating = {true}
              size = {150}
              color="#3a7edf"
              style={{marginBottom:10}}
          /><Text style={styles.text} >{status[this.state.index]}</Text></FadeInView>
        )
    }
}
