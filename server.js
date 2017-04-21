const fs = require('fs')
const http = require('http')
const https = require('https')
const key = fs.readFileSync('ssl/privatekey.pem', 'utf8')
const cert = fs.readFileSync('ssl/certificate.pem', 'utf8')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');

// init
let app = new Koa()
const router = new Router()
let httpServer = http.createServer(app.callback())
let httpsServer = https.createServer({ key, cert }, app.callback())

router.post('/upload', async(ctx, next) => {
    let body = ctx.request.body
    let img = body.img
    let i = 0
    let arr = []
    while (img[i] !== undefined) {
        arr.push(img[i])
        i++
    }
    let res=await new Promise((res, rej) => {
        fs.writeFile(`./tmp/${body.name}.jpg`, new Uint8Array(arr), (error) => {
            if (error) {
                rej({error});
            } else {
                res({succed:true})
            }
        })
    })
    ctx.body=res

})

/*let io = require('socket.io')(httpServer)

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('echo', msg)
    })
    socket.on('test', (blob) => {
        let fileName = `./tmp/${Math.floor((Math.random() * 100) + 1)}.txt`
        fs.writeFile(fileName, blob, (err) => {
            if (err) {
                return console.log(err);
            } else {
                console.log("The file was saved!");
            }
        })
    })
    socket.on('upload', (blob) => {
        let fileName = `./tmp/${Math.floor((Math.random() * 100) + 1)}.webm`
        fs.writeFile(fileName, Buffer.from(new Uint8Array(blob)), (err) => {
            if (err) {
                return console.log(err);
            } else {
                console.log("The file was saved!");
            }
        })
    })
    socket.on('upload', (msg) => {
        
    })
    socket.on('disconnect', () => {})

})
*/

//middleware
app.use(require('koa-static')(__dirname + "/public"))
    .use(bodyParser({ jsonLimit: "50mb" }))
    .use(router.routes())
    .use(router.allowedMethods())




httpServer.listen(3000)
httpsServer.listen(3001)
console.log("http://127.0.0.1:3000")
console.log("https://127.0.0.1:3001")

