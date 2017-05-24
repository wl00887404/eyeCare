import React, {Component} from 'react'
import FakeLoading from './fakeLoading.js'

let status = [
    "等待雲端運算",
]


const EndPreview=({history})=>{
    return (<FakeLoading status={status}/>)
}

export default EndPreview
