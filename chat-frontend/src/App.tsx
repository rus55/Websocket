import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {createConnection, destroyConnection, sendMessage, setClientName, typeMessage} from "./chat-reducer";
import {AppStateType} from "./index";


function App() {
    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])

    const [message, setMessage] = useState('Hello')
    const [name, setName] = useState('Dima')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (
        <div className="App">
            <div>
                <div style={{
                    border: '1px solid black',
                    padding: '10px',
                    height: '300px',
                    width: '300px',
                    overflowY: 'scroll'
                }} onScroll={(e) => {
                    let element = e.currentTarget
                    const maxScrollPosition = element.scrollHeight - element.clientHeight
                    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
                        setIsAutoScrollActive(true)
                    } else {
                        setIsAutoScrollActive(false)
                    }
                    setLastScrollTop(element.scrollTop)
                }}>
                    {messages.map((m: any) => {
                        return <div key={m.id}>
                            <b>{m.user.name}:</b> {m.message}
                            <hr/>
                        </div>
                    })}
                    {typingUsers.map((m: any) => {
                        return <div key={m.id}>
                            <b>{m.name}:</b> ...
                            <hr/>
                        </div>
                    })}
                    <div ref={messagesAnchorRef}></div>
                </div>
                <div>
                    <input value={name} onChange={(e) => setName(e.currentTarget.value)}/>
                    <button onClick={() => {
                        dispatch(setClientName(name))
                    }}>Send name
                    </button>
                </div>
                <div>
                    <textarea value={message}
                              onKeyPress={() => {
                                  dispatch(typeMessage())
                              }}
                              onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
                    <button onClick={() => {
                        dispatch(sendMessage(message))
                        setMessage('')
                    }}>Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App;
