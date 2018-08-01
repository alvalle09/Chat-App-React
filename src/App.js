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
            messages: [],
            joinableRooms: [], // rooms available
            joinedRooms: []   // rooms currentUser already joined
        }
        this.sendMessage = this.sendMessage.bind(this)
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
            this.currentUser = currentUser // hook currentUser to "this" component 

            this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms, 
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joinableRooms:', err))

            this.currentUser.subscribeToRoom({
                roomId: 12741356,
                messageLimit: 20,
                hooks: {
                    onNewMessage: message => {
                        //console.log('message.text: ', message.text);
                        this.setState({
                            messages: [...this.state.messages, message]
                        })
                    }
                }
            })
            .catch(err => console.log('error on connecting ', err))
        })
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text: text,  // in ES6 this can be written as "text," when the key and value are the same
            roomId: 12741356
        })
    }

    render() {
        //console.log('this.state.messages:', this.state.messages);
        return (
            <div className="app">
                <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}

export default App

