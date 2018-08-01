import React from 'react'
import Message from './Message'

/* const DUMMY_DATA = [
    { senderId: 'Phred',   text: 'Hi! You there?' },
    { senderId: 'janedoe', text: "Yes, How about you?" },
    { senderId: 'Phred',   text: "Good to hear from you" }
] */

class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
               {this.props.messages.map(( message , index) => {
                    return (
                        <Message key={index} username={message.senderId} text={message.text} />                        
                    )
               })}
            </div>
        )
    }
}

export default MessageList