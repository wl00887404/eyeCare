import React, {Component} from 'react'
import FakeLoading from '../../components/fakeLoading.js'

let animationTime = 2000
let status = [
    "正在儲存系統設定",
]


const BeforeAlmostFinish=({history})=>{
    return (<FakeLoading  history={history} status={status} animationTime={animationTime} next="/almostFinish"/>)
}

export default BeforeAlmostFinish
