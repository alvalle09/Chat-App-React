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
            roomId: null,
            messages: [],
            joinableRooms: [], // rooms available
            joinedRooms: []   // rooms currentUser already joined
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
        this.createRoom = this.createRoom.bind(this)
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

            this.getRooms()
            //this.subscribeToRoom() //not needed cuz loading by clicking on room list
        })
        .catch(err => console.log('error on connecting ', err))
        
    }

    getRooms() {
        this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms, 
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joinableRooms:', err))   
    }

    subscribeToRoom(roomId) {
        // first clean up the state, otherwise messages stack up on each other from different rooms
        this.setState({ messages: [] })
        this.currentUser.subscribeToRoom({
            roomId: roomId, //passing in roomid to subscribe dynamically
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
            .then(room => {
                this.setState({
                    roomId: room.id
                })
                this.getRooms()
                
            })
            .catch(err => console.log('error on subscribing to room: ', err))

    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text: text,  // in ES6 this can be written as "text," when the key and value are the same
            roomId: this.state.roomId  // get roomId from state
        })
    }

    createRoom(name) {
        // console.log('roomName:', roomName)
        this.currentUser.createRoom({
            name: name,  //same as "name,"

        })
        .then(room => this.subscribeToRoom(room.id))
        .catch(err => console.log('error with creating room: ', err))

    }

    render() {
        //console.log('this.state.messages:', this.state.messages);
        return (
            <div className="app">
                <RoomList 
                    roomId={this.state.roomId}
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList 
                    roomId={this.state.roomId}
                    messages={this.state.messages} />
                <SendMessageForm 
                    disabled={!this.state.roomId}
                    sendMessage={this.sendMessage} />
                <NewRoomForm createRoom={this.createRoom} />

            </div>
        );
    }
}

export default App

