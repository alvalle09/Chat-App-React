import React from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

    constructor() {
        super() //calls the constructor function of the class extened upon (React.Component) 
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: 'Phred',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })

        chatManager.connect()
        .then(currentUser => {
            currentUser.subscribeToRoom({
                roomId: 12741356,
                messageLimit: 20,
                hooks: {
                    onNewMessage: message => {
                        console.log('message.text: ', message.text);
                        this.setState({
                            messages: [...this.state.messages, message]
                        })
                    }
                }
            })
        })
    }

    render() {
        console.log('this.state.messages:', this.state.messages);
        return (
            <div className="app">
                <RoomList />
                <MessageList messages={this.state.messages}/>
                <SendMessageForm />
                <NewRoomForm />
            </div>
        );
    }
}

export default App

