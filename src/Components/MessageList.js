import React from 'react'

const DUMMY_DATA = [
    {
        senderId: 'Phred',
        text: 'Hi! You there?'
    },
    {
        senderId: 'janedoe',
        text: "Yes, How about you?"
    },
    {
        senderId: 'Phred',
        text: "Good to hear from you"
    }
]

class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
               {DUMMY_DATA.map(( message , index) => {
                    return (
                        <div key={index} className="message">
                            <div className="message-username"> {message.senderId} </div>
                            <div className="message-text"> {message.text} </div>
                        </div>
                    )
               })}
            </div>
        )
    }
}

export default MessageList