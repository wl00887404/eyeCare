require('../../sass/reset.scss')
require("babel-polyfill")

import DogNames from 'dog-names'
import React from 'react'
import style from './style.scss'
import Rx from 'rxjs'
//let io = require('socket.io-client')()



export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            name: DogNames.allRandom(),
            canvasWidth: 320,
            fps: 1,
            aspectRatio: 0,
            isStreaming: false
        }
    }

    async componentDidMount() {
        await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            })
            .then((stream) => {
                return new Promise(
                    ((that, res, rej) => {
                        that.stream = stream
                        that.video.src = window.URL.createObjectURL(stream)
                        that.video.play()
                        that.video.oncanplay = () => res()
                    }).bind(null, this)
                )
            })
            .catch((error) => {
                console.log('navigator.getUserMedia error: ', error);
            })
        this.setState({ aspectRatio: this.video.videoHeight / this.video.videoWidth })
    }
    startRecording() {
        this.uploadObservable = Rx.Observable
            .interval(1000 / this.state.fps)
            .retry(5).subscribe((value) => {
                this.takePhoto(this.state.name + value)
            })
        this.setState({ isStreaming: true })
    }
    stopRecording() {
        this.uploadObservable.unsubscribe()
        this.setState({ isStreaming: false })
    }
    async takePhoto(name) {
        let context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        let data = await new Promise((res, rej) => {
            this.canvas.toBlob((blob) => res(blob), "image/jpeg", 1);
        })
        let fileReader = new FileReader()
        fileReader.readAsArrayBuffer(data)
        fileReader.onloadend = (e) => {
            let img = new Uint8Array(e.target.result)
            fetch("./upload", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    img
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
    clearPhoto() {
        let context = this.canvas.getContext('2d')
        context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    updateFps(e) {
        this.setState({ fps: e.target.value })
    }
    updateCanvasWidth(e) {
        this.setState({ canvasWidth: e.target.value })
    }
    updateName(e) {
        this.setState({ name: e.target.value })
    }
    render() {
        return (
            <div className={style.container}>
                <div>
                    <video ref={r=>this.video=r}></video>
                </div>
                <div>
                    <div>
                        <span>檔案名稱：</span>
                        <input 
                            type="text" 
                            id="name" 
                            value={this.state.name}
                            onChange={this.updateName.bind(this)}
                        />
                    </div>
                    <div>
                        <span>寬度 (pixel) ：</span>
                        <input 
                            type="number" 
                            id="canvasWidth" 
                            value={this.state.canvasWidth}
                            onChange={this.updateCanvasWidth.bind(this)}
                        />
                    </div>
                    <div>
                        <span>更新率 (frame / second) ：</span>
                        <input 
                            type="number" 
                            id="fps" 
                            value={this.state.fps}
                            onChange={this.updateFps.bind(this)}
                        />
                    </div>
                    <div>
                        <button style={this.state.isStreaming?{display:"none"}:{}} onClick={this.startRecording.bind(this)}>開始紀錄</button>
                        <button style={this.state.isStreaming?{}:{display:"none"}} onClick={this.stopRecording.bind(this)}>停止紀錄</button>
                    </div>
                </div>
                <div>
                    <canvas ref={r=>this.canvas=r} width={this.state.canvasWidth} height={this.state.canvasWidth*this.state.aspectRatio}/>
                </div>
            </div>
        )
    }
}


//  <button type='button' 
//     onClick={this.startRecord}>start recording</button>
// <button type='button' 
//     onClick={this.stopRecord}>stop recording</button>

// let mediaRecorder
// startRecord() {
//     this.mediaRecorder = new MediaRecorder(this.stream)
//     this.mediaRecorder.start()
//     console.debug("recorder started")
//     let chunks = []
//     this.mediaRecorder.ondataavailable = function(e) {
//         chunks.push(e.data)
//     }

//     this.mediaRecorder.onstop = function(e) {
//         console.debug("recorder stopped")
//         var blob = new Blob(chunks, { 'type': 'video/webm;' });
//         chunks = [];
//         io.emit("upload", blob)
//     }
// }
// stopRecord() {
//     if (this.mediaRecorder) {
//         if (this.mediaRecorder.state !== "inactive") {
//             this.mediaRecorder.stop()
//         }
//     }
// }
