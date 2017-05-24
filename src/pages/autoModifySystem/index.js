import React, {Component} from 'react'
import FakeLoading from '../../components/fakeLoading.js'

let animationTime = 1500
let status = [
    "正在偵測硬體設定",
    "正在調整驅動程式",
    "正在取得相機解析度",
    "正在最佳化系統效能",
]


const AutoModifySystem=({history})=>{
    return (<FakeLoading  history={history} status={status} animationTime={animationTime} next="startPreview"/>)
}

export default AutoModifySystem
