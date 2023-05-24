import express from 'express'
import http from 'http'
import { Server } from "socket.io";

const cors = require('cors');
const app = express()
const server = http.createServer(app)
const socket = new Server(server);

app.get('/', (req, res) => {
    res.send('It is a WS server');
});

app.use(cors());

const messages: Array<any> = [
    {message: 'Hello, Sanya', userId: '2r3333', user: {id: 'ksdajfkd', name: 'Dima'}},
    {message: 'Hello, Dima', userId: 'fdg2gf', user: {id: 'd1fd541f', name: 'Sanya'}},
    {message: 'Hello, Dimych', userId: 'fdg2gf', user: {id: 'd1fd541f', name: 'Sanya'}}
]

const usersState = new Map()

socket.on('connection', (socketChannel) => {
    usersState.set(socketChannel, {id: new Date().getTime().toString(), name: 'anonym'})

    socket.on('disconnect', () => {
        usersState.delete(socketChannel)
    })

    socketChannel.on('client-name-sent', (name: string) => {
        if(typeof name !== 'string'){
            return
        }

        const user = usersState.get(socketChannel)
        user.name = name
    })

    socketChannel.on('client-typed', (name: string) => {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel))
    })

    socketChannel.on('client-message-sent', (message: string, successFn) => {
        if(typeof message !== 'string' || message.length > 20){
            successFn('Message length should be less than 20 chars')
            return
        }

        const user = usersState.get(socketChannel)

        let messageItem = {
            message: message, id: new Date().getTime(),
            user: {id: user.id, name: user.name}
        }

        messages.push(messageItem)

        socket.emit('new-message-sent', messageItem)

        successFn(null)
    })

    socketChannel.emit('init-messages-published', messages, (data: string) => {
        console.log('INIT MESSAGES RECEIVED' + data)
    })

    console.log('a user connected')
})

server.listen(process.env.port || 3009, () => {
    console.log(`App running on port ${process.env.port || 3009}`);
})